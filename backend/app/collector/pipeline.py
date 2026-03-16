from datetime import datetime
from typing import Dict

from sqlalchemy.orm import Session

from ..db.models import Article, Incident
from ..nlp.classifier import classify_threat
from ..nlp.geolocation import lookup_location
from ..nlp.scoring import compute_threat_score
from .rss_fetcher import fetch_rss_articles


def extract_location(text: str) -> str | None:
    # very simple placeholder: look for known location names in text
    lowered = text.lower()
    for name in ["kupwara", "srinagar", "bastar", "delhi", "mumbai", "kolkata", "chennai"]:
        if name in lowered:
            return name.title()
    return None


def run_collection_cycle(db: Session) -> Dict[str, int]:
    articles = fetch_rss_articles()
    new_articles = 0
    new_incidents = 0

    for art in articles:
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
        location = extract_location(text)
        lat, lon = lookup_location(location or "")
        entities = {"location": location}

        threat_score = compute_threat_score(
            text=text,
            category=category,
            entities=entities,
            source=art["source"],
            published_time=art["published_time"],
        )

        incident = Incident(
            article_id=article.id,
            category=category,
            location=location,
            latitude=lat,
            longitude=lon,
            threat_score=threat_score,
            entities=entities,
            summary=art["summary"],
            timestamp=art["published_time"] or datetime.utcnow(),
        )
        db.add(incident)
        new_incidents += 1

    db.commit()
    return {"articles": new_articles, "incidents": new_incidents}

