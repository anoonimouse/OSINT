from datetime import datetime, timedelta

from app.db.models import Article, Incident, Base
from app.db.session import SessionLocal, engine
from app.nlp.scoring import compute_threat_score


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        now = datetime.utcnow()

        samples = [
            {
                "title": "Infiltration attempt detected near LoC in Kupwara",
                "source": "The Hindu",
                "location": "Kupwara, J&K",
                "category": "border_infiltration",
                "summary": "Security forces foiled an infiltration attempt along the LoC in Kupwara sector.",
                "hours_ago": 3,
            },
            {
                "title": "Arms smuggling network busted in Punjab border district",
                "source": "Indian Express",
                "location": "Gurdaspur, Punjab",
                "category": "arms_smuggling",
                "summary": "Police intercepted a consignment of illicit weapons near the international border.",
                "hours_ago": 8,
            },
            {
                "title": "Maoist movement reported in Bastar region",
                "source": "Times of India",
                "location": "Bastar, Chhattisgarh",
                "category": "naxal_activity",
                "summary": "Security forces spotted suspected Maoist movement in interior Bastar forests.",
                "hours_ago": 20,
            },
            {
                "title": "Ransomware attack targets small finance firm in Mumbai",
                "source": "The Hindu",
                "location": "Mumbai, Maharashtra",
                "category": "cyber_attack",
                "summary": "A targeted ransomware attack briefly disrupted operations of a boutique finance firm.",
                "hours_ago": 30,
            },
        ]

        for s in samples:
            published_time = now - timedelta(hours=s["hours_ago"])

            # Avoid duplicates on re-run
            if (
                db.query(Article)
                .filter(Article.title == s["title"], Article.source == s["source"])
                .first()
            ):
                continue

            article = Article(
                title=s["title"],
                source=s["source"],
                published_time=published_time,
                content=s["summary"],
                url=f"demo://{s['title'].replace(' ', '-').lower()}",
            )
            db.add(article)
            db.flush()

            entities = {"location": s["location"]}
            threat_score = compute_threat_score(
                text=f"{s['title']}. {s['summary']}",
                category=s["category"],
                entities=entities,
                source=s["source"],
                published_time=published_time,
            )

            incident = Incident(
                article_id=article.id,
                category=s["category"],
                location=s["location"],
                latitude=None,
                longitude=None,
                threat_score=threat_score,
                entities=entities,
                summary=s["summary"],
                timestamp=published_time,
            )
            db.add(incident)

        db.commit()
        print("Demo data seeded.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

