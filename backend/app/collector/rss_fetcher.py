from datetime import datetime
from typing import Dict, List

import feedparser


RSS_FEEDS = {
    "The Hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
    "Indian Express": "https://indianexpress.com/section/india/feed/",
    "Times of India - Top Stories": "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    "Times of India - India": "https://timesofindia.indiatimes.com/rssfeeds/newsindia.rss",
    "NDTV - India": "https://feeds.feedburner.com/ndtvnews-india-news",
    "NDTV - Top Stories": "https://feeds.feedburner.com/ndtvnews-top-stories",
    "Hindustan Times - India": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
    "India Today - India": "https://indiatoday.in/rss/1206578",
}


def fetch_rss_articles() -> List[Dict]:
    """
    Fetch articles from configured RSS feeds.
    Designed to be robust: even if published dates are missing/invalid,
    it will still return entries with a sensible fallback timestamp.
    """
    articles: List[Dict] = []
    for source, feed_url in RSS_FEEDS.items():
        parsed = feedparser.parse(feed_url)
        entries = getattr(parsed, "entries", [])
        print(f"[RSS] {source}: {len(entries)} entries")

        for entry in entries:
            # Try structured time first
            published_dt = None
            published_parsed = getattr(entry, "published_parsed", None)
            if published_parsed:
                try:
                    published_dt = datetime(*published_parsed[:6])
                except Exception:
                    published_dt = None

            if published_dt is None:
                published_dt = datetime.utcnow()

            articles.append(
                {
                    "title": getattr(entry, "title", "(no title)"),
                    "url": getattr(entry, "link", ""),
                    "source": source,
                    "published_time": published_dt,
                    "summary": getattr(entry, "summary", "") or "",
                }
            )
    return articles


