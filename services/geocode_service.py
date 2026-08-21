"""Resolves a city name to coordinates using Open-Meteo's free geocoding API."""

import requests

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"


class CityNotFoundError(Exception):
    pass


def geocode_city(city):
    response = requests.get(
        GEOCODING_URL,
        params={"name": city, "count": 1},
        timeout=5,
    )
    response.raise_for_status()
    data = response.json()

    results = data.get("results")
    if not results:
        raise CityNotFoundError(f"City '{city}' not found")

    top = results[0]
    return {
        "latitude": top["latitude"],
        "longitude": top["longitude"],
        "name": top["name"],
        "country": top.get("country"),
    }
