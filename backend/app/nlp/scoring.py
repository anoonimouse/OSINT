from datetime import datetime, timezone
from typing import Any, Dict


def compute_threat_score(
    text: str,
    category: str,
    entities: Dict[str, Any],
    source: str,
    published_time: datetime,
) -> float:
    score = 0.0

    category_weights = {
        "terrorism": 4.0,
        "border_infiltration": 3.5,
        "arms_smuggling": 3.0,
        "naxal_activity": 3.0,
        "communal_violence": 3.0,
        "cyber_attack": 2.5,
        "organized_crime": 2.0,
        "other": 1.0,
    }
    score += category_weights.get(category, 1.0)

    # Base entity weights
    if entities.get("location"):
        score += 0.5
    if len(entities.get("organizations", [])) > 0:
        score += 1.0
    if len(entities.get("persons", [])) > 0:
        score += 0.5

    # Synergistic insights: High severity attacks naming specific organizations/people
    if category in ["terrorism", "naxal_activity", "border_infiltration"]:
        if len(entities.get("organizations", [])) > 0:
            score += 1.5  # E.g. A terror attack where a specific group is named
        if len(entities.get("persons", [])) > 0:
            score += 1.0  # E.g. A naxal attack where a commander or target is named

    source_weights = {
        "The Hindu": 1.5,
        "Indian Express": 1.5,
        "Times of India": 1.5,
    }
    score += source_weights.get(source, 1.0)

    now = datetime.now(timezone.utc)
    published = (
        published_time.replace(tzinfo=timezone.utc)
        if published_time.tzinfo is None
        else published_time.astimezone(timezone.utc)
    )
    age_hours = (now - published).total_seconds() / 3600
    if age_hours < 6:
        score += 2.0
    elif age_hours < 24:
        score += 1.0

    return max(1.0, min(score, 10.0))

