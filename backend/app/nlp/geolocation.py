from typing import Optional, Tuple
from functools import lru_cache
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable

# Initialize the geolocator (must define a custom user_agent)
geolocator = Nominatim(user_agent="osint_threat_monitor_nlp_service")

@lru_cache(maxsize=1000)
def lookup_location(location_name: str) -> Tuple[Optional[float], Optional[float]]:
    if not location_name:
        return None, None
    try:
        # Prevent overly long/vague strings from causing API errors
        if len(location_name) > 60:
            return None, None
            
        location = geolocator.geocode(location_name, timeout=3)
        if location:
            return location.latitude, location.longitude
    except (GeocoderTimedOut, GeocoderUnavailable):
        pass
    except Exception as e:
        print(f"[Geolocation Error] {e}")
    return None, None

