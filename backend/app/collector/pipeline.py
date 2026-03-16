from datetime import datetime
from typing import Dict, List, Optional
import spacy

from sqlalchemy.orm import Session

from ..db.models import Article, Incident
from ..nlp.classifier import classify_threat
from ..nlp.geolocation import lookup_location
from ..nlp.scoring import compute_threat_score
from .rss_fetcher import fetch_rss_articles

# Load SpaCy model, fail gracefully if not installed/downloaded yet
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("[Warning] SpaCy 'en_core_web_sm' model not found. Entities will fallback to empty.")
    nlp = None

def extract_entities_from_text(text: str) -> Dict[str, List[str]]:
    if not nlp:
        return {"locations": [], "organizations": [], "persons": []}
    
    doc = nlp(text)
    entities = {"locations": [], "organizations": [], "persons": []}
    
    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC"]:
            entities["locations"].append(ent.text)
        elif ent.label_ == "ORG":
            entities["organizations"].append(ent.text)
        elif ent.label_ == "PERSON":
            entities["persons"].append(ent.text)
            
    # Remove duplicates
    return {k: list(set(v)) for k, v in entities.items()}

def run_collection_cycle(db: Session) -> Dict[str, int]:
    print("[Pipeline] Starting collection cycle...")
    articles = fetch_rss_articles()
    total_fetched = len(articles)
    print(f"[Pipeline] Fetched {total_fetched} total articles. Starting processing...")
    
    new_articles = 0
    new_incidents = 0

    for i, art in enumerate(articles):
        if (i + 1) % 10 == 0:
            print(f"[Pipeline] Processing article {i + 1}/{total_fetched}...")
            # Incremental commit every 20 articles to ensure visibility and persistence
            if (i + 1) % 20 == 0:
                db.commit()
                print(f"[Pipeline] Committed progress to database.")

        if db.query(Article).filter(Article.url == art["url"]).first():
            continue

        article = Article(
            title=art["title"],
            source=art["source"],
            published_time=art["published_time"],
            content=art["summary"],
            url=art["url"],
        )
        db.add(article)
        db.flush()
        new_articles += 1

        text = f'{art["title"]}. {art["summary"]}'
        category = classify_threat(text)
        
        extracted = extract_entities_from_text(text)
        
        # Determine main location string from the first GPE/LOC identified
        location_str: Optional[str] = None
        lat, lon = None, None
        
        # Limit to first 3 detected locations to avoid huge delays if text is messy
        for loc in extracted["locations"][:3]:
            lat, lon = lookup_location(loc)
            if lat and lon:
                location_str = loc
                break  # Stop at first successfully geocoded location

        entities_payload = {
            "location": location_str,
            "organizations": extracted["organizations"],
            "persons": extracted["persons"]
        }

        threat_score = compute_threat_score(
            text=text,
            category=category,
            entities=entities_payload,
            source=art["source"],
            published_time=art["published_time"],
        )

        incident = Incident(
            article_id=article.id,
            category=category,
            location=location_str,
            latitude=lat,
            longitude=lon,
            threat_score=threat_score,
            entities=entities_payload,
            summary=art["summary"],
            timestamp=art["published_time"] or datetime.utcnow(),
        )
        db.add(incident)
        new_incidents += 1

    db.commit()
    print(f"[Pipeline] Finished. Added {new_articles} articles and {new_incidents} incidents.")
    return {"articles": new_articles, "incidents": new_incidents}

