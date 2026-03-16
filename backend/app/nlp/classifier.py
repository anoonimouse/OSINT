from typing import Literal, Dict, List, Tuple, cast
import re

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

THREAT_KEYWORDS: Dict[ThreatCategory, List[Tuple[str, float]]] = {
    "terrorism": [("terror", 2.0), ("blast", 2.0), ("ied", 2.0), ("bomb", 1.5), ("militant", 1.5), ("extremist", 1.5), ("attack", 1.0)],
    "border_infiltration": [("infiltration", 2.0), ("loc", 2.0), ("border", 1.5), ("ceasefire", 1.5), ("cross-border", 2.0), ("troops", 1.0)],
    "arms_smuggling": [("smuggling", 2.0), ("arms haul", 2.0), ("weapons", 1.5), ("contraband", 1.5), ("narcotics", 1.0), ("seized", 1.0)],
    "naxal_activity": [("maoist", 2.5), ("naxal", 2.5), ("lwe", 2.0), ("insurgency", 1.5), ("ambush", 1.5), ("crpf", 1.0)],
    "communal_violence": [("communal", 2.0), ("riot", 2.0), ("clash", 1.5), ("mob", 1.5), ("stone pelting", 1.5), ("tension", 1.0)],
    "cyber_attack": [("cyber", 2.0), ("ransomware", 2.5), ("data breach", 2.0), ("hacked", 1.5), ("malware", 1.5), ("phishing", 1.5)],
    "organized_crime": [("gang", 1.5), ("organized crime", 2.0), ("syndicate", 1.5), ("extortion", 1.5), ("cartel", 1.5), ("underworld", 1.5)],
}

def classify_threat(text: str) -> ThreatCategory:
    lowered = text.lower()
    scores: Dict[ThreatCategory, float] = {cat: 0.0 for cat in THREAT_KEYWORDS}
    
    for category, keywords in THREAT_KEYWORDS.items():
        for kw, weight in keywords:
            # Count whole word/phrase occurrences
            matches = len(re.findall(r'\b' + re.escape(kw) + r'\b', lowered))
            scores[category] += matches * weight
            
    # Find category with highest score
    best_category, max_score = max(scores.items(), key=lambda x: x[1])
    
    if max_score > 0.5:
        return cast(ThreatCategory, best_category)
    return "other"

