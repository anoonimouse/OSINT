from typing import Optional, Tuple


LOCATION_COORDS = {
    "kupwara": (34.52, 74.26),
    "srinagar": (34.08, 74.79),
    "bastar": (19.07, 81.93),
    "mumbai": (19.07, 72.88),
    "delhi": (28.61, 77.21),
    "kolkata": (22.57, 88.36),
    "chennai": (13.08, 80.27),
}


def lookup_location(location_name: str) -> Tuple[Optional[float], Optional[float]]:
    if not location_name:
        return None, None
    key = location_name.lower()
    for name, (lat, lon) in LOCATION_COORDS.items():
        if name in key:
            return lat, lon
    return None, None

