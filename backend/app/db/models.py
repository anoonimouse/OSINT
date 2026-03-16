from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.sqlite import JSON as JSONType
from sqlalchemy.orm import relationship

from .session import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    source = Column(String, nullable=False)
    published_time = Column(DateTime, index=True)
    content = Column(Text)
    url = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"))
    category = Column(String, index=True)
    location = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    threat_score = Column(Float, index=True)
    entities = Column(JSONType)
    summary = Column(Text)
    timestamp = Column(DateTime, index=True)

    article = relationship("Article")


class DailyReport(Base):
    __tablename__ = "daily_reports"

    date = Column(DateTime, primary_key=True)
    summary_text = Column(Text)
    high_risk_incidents = Column(JSONType)

