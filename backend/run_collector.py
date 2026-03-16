from app.collector.pipeline import run_collection_cycle
from app.db.models import Base
from app.db.session import SessionLocal, engine


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        stats = run_collection_cycle(db)
        print(f"Collected {stats['articles']} new articles, {stats['incidents']} incidents.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

