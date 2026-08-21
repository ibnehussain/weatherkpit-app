"""Fetches and normalizes current weather from Open-Meteo's forecast API."""

import requests

from services.geocode_service import geocode_city, CityNotFoundError
from services.weather_codes import describe
from services.cache import TTLCache

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

_cache = TTLCache(ttl_seconds=300)


class WeatherServiceError(Exception):
    pass


def get_weather(city, unit="celsius"):
    cache_key = (city.strip().lower(), unit)
    cached = _cache.get(cache_key)
    if cached is not None:
        return cached

    location = geocode_city(city)

    try:
        response = requests.get(
            FORECAST_URL,
            params={
                "latitude": location["latitude"],
                "longitude": location["longitude"],
                "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
                "temperature_unit": unit,
                "timezone": "auto",
            },
            timeout=5,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise WeatherServiceError("Unable to reach weather service") from exc

    data = response.json()
    current = data.get("current", {})
    weather_info = describe(current.get("weather_code"))

    result = {
        "city": location["name"],
        "country": location["country"],
        "temperature": current.get("temperature_2m"),
        "humidity": current.get("relative_humidity_2m"),
        "wind_speed": current.get("wind_speed_10m"),
        "description": weather_info["description"],
        "icon": weather_info["icon"],
    }

    _cache.set(cache_key, result)
    return result
