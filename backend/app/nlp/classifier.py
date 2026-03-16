from typing import Literal


ThreatCategory = Literal[
    "terrorism",
    "border_infiltration",
    "arms_smuggling",
    "naxal_activity",
    "communal_violence",
    "cyber_attack",
    "organized_crime",
    "other",
]


def classify_threat(text: str) -> ThreatCategory:
    lowered = text.lower()
    if any(k in lowered for k in ["infiltration", "loc", "border"]):
        return "border_infiltration"
    if any(k in lowered for k in ["blast", "terror", "ied"]):
        return "terrorism"
    if any(k in lowered for k in ["smuggling", "arms haul"]):
        return "arms_smuggling"
    if any(k in lowered for k in ["maoist", "naxal"]):
        return "naxal_activity"
    if any(k in lowered for k in ["communal clash", "riot"]):
        return "communal_violence"
    if any(k in lowered for k in ["cyber", "ransomware", "data breach"]):
        return "cyber_attack"
    if any(k in lowered for k in ["gang", "organized crime"]):
        return "organized_crime"
    return "other"

