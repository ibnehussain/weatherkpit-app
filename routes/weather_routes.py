"""Weather API routes."""

from flask import Blueprint, jsonify, request

from services.geocode_service import CityNotFoundError
from services.weather_service import get_weather, WeatherServiceError

weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/api/weather")
def weather():
    city = request.args.get("city", "").strip()
    unit = request.args.get("unit", "celsius")
    if unit == "f":
        unit = "fahrenheit"

    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    try:
        data = get_weather(city, unit=unit)
    except CityNotFoundError:
        return jsonify({"error": f"City '{city}' not found"}), 404
    except WeatherServiceError:
        return jsonify({"error": "Weather service is currently unavailable"}), 502

    return jsonify(data), 200
