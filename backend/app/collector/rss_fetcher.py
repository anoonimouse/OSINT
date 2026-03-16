from datetime import datetime
from typing import Dict, List

import feedparser


RSS_FEEDS = {
    # Core Indian national news
    "The Hindu - National": "https://www.thehindu.com/news/national/feeder/default.rss",
    "The Hindu - Front Page": "https://www.thehindu.com/news/feeder/default.rss",
    "Indian Express - India": "https://indianexpress.com/section/india/feed/",
    "Indian Express - Latest": "https://indianexpress.com/feed/",
    "Times of India - Top Stories": "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    "Times of India - India": "https://timesofindia.indiatimes.com/rssfeeds/newsindia.rss",
    "NDTV - India News": "https://feeds.feedburner.com/ndtvnews-india-news",
    "NDTV - Top Stories": "https://feeds.feedburner.com/ndtvnews-top-stories",
    "Hindustan Times - India News": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
    "India Today - India": "https://indiatoday.in/rss/1206578",
    "India Today - Nation": "https://indiatoday.in/rss/1206514",
    "News18 - India": "https://www.news18.com/rss/india.xml",
    "News18 - Top Stories": "https://www.news18.com/rss/top.xml",

    # Regional and city-specific
    "Hindustan Times - Delhi": "https://www.hindustantimes.com/feeds/rss/cities/delhi-news/rssfeed.xml",
    "Hindustan Times - Mumbai": "https://www.hindustantimes.com/feeds/rss/cities/mumbai-news/rssfeed.xml",
    "Hindustan Times - Kolkata": "https://www.hindustantimes.com/feeds/rss/cities/kolkata-news/rssfeed.xml",
    "NDTV - Cities": "https://feeds.feedburner.com/ndtvnews-cities",
    "NDTV - South": "https://feeds.feedburner.com/ndtvnews-south",
    "Greater Kashmir": "https://www.greaterkashmir.com/rss-feed",
    "The Tribune - Punjab": "https://www.tribuneindia.com/rss/feed.aspx?cat_id=6",
    "The Tribune - J&K": "https://www.tribuneindia.com/rss/feed.aspx?cat_id=37",
    "The Shillong Times": "https://theshillongtimes.com/feed/",
    "Assam Tribune": "https://assamtribune.com/rssfeed",
    "Telangana Today": "https://telanganatoday.com/feed",
    "The Siasat Daily": "https://www.siasat.com/feed",

    # Specialized security-relevant feeds
    "India Today - Crime": "https://indiatoday.in/rss/1786661",
    "India Today - Law": "https://www.indiatoday.in/rss/1206581",
    "Hindustan Times - Crime": "https://www.hindustantimes.com/feeds/rss/crime/rssfeed.xml",
    "India TV - News": "https://www.indiatvnews.com/rssfeed/news.xml",
    "ANI - National": "https://aninews.in/rss/national.xml",
    "APN Live": "https://www.apnlive.com/feed",
    "The Print - Defence": "https://theprint.in/defence/feed/",
    "The Wire - Security": "https://thewire.in/security/feed/",
    "Economic Times - Defence": "https://economictimes.indiatimes.com/industry/defence/rssfeeds/78970352.cms",

    # Cyber / tech context
    "The Hindu - Technology": "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
    "Indian Express - Technology": "https://indianexpress.com/section/technology/feed/",
    "Economic Times - Internet": "https://economictimes.indiatimes.com/tech/internet/rssfeeds/13357270.cms",

    # International / regional context
    "BBC - Asia": "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
    "BBC - World": "https://feeds.bbci.co.uk/news/world/rss.xml",
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


