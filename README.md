# Weather KPIT App

A Flask-based weather dashboard that fetches current weather data by city using the Open-Meteo APIs.

## Features
- Search current weather by city
- Weather condition icon and description
- Temperature, humidity, and wind speed display
- Dynamic UI theme based on weather conditions

## Project Structure
- `app.py` - Flask app entrypoint
- `routes/weather_routes.py` - Weather API route
- `services/` - Geocoding, weather retrieval, and caching logic
- `templates/index.html` - Main UI template
- `static/` - Frontend JavaScript and CSS

## Requirements
- Python 3.9+
- `pip`

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run the App
```bash
python app.py
```

Open your browser at: `http://127.0.0.1:5000/`

## API
### `GET /api/weather`
Query parameters:
- `city` (required): City name
- `unit` (optional): `celsius` (default) or `fahrenheit` (`f` also supported)

Example:
```bash
curl "http://127.0.0.1:5000/api/weather?city=London&unit=celsius"
```

## Notes
- Uses Open-Meteo Geocoding API and Forecast API.
- Weather responses are cached briefly in memory to reduce repeated upstream calls.
