const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather-btn');
const resultsEl = document.getElementById('results');

const THEME_CLASSES = ['theme-clear', 'theme-cloudy', 'theme-rain', 'theme-storm', 'theme-snow', 'theme-night'];
const TEMP_CLASSES = ['temp-cold', 'temp-mild', 'temp-warm', 'temp-hot'];

// maps a condition description to one of the CSS sky-theme classes
function themeFromDescription(description) {
    const text = description.toLowerCase();
    if (text.includes('thunderstorm')) return 'theme-storm';
    if (text.includes('snow')) return 'theme-snow';
    if (text.includes('rain') || text.includes('drizzle')) return 'theme-rain';
    if (text.includes('overcast') || text.includes('cloud') || text.includes('fog')) return 'theme-cloudy';
    return 'theme-clear';
}

// maps temperature (°C) to a warmth class driving accent color intensity
function tempClassFromCelsius(temp) {
    if (temp <= 5) return 'temp-cold';
    if (temp <= 18) return 'temp-mild';
    if (temp <= 28) return 'temp-warm';
    return 'temp-hot';
}

function applyTheme(description, temperature) {
    document.body.classList.remove(...THEME_CLASSES, ...TEMP_CLASSES);
    document.body.classList.add(themeFromDescription(description), tempClassFromCelsius(temperature));
}

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        resultsEl.innerHTML = '<p class="error">Please enter a city name.</p>';
        return;
    }

    resultsEl.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            resultsEl.innerHTML = `<p class="error">${data.error || 'Unable to fetch weather.'}</p>`;
            return;
        }

        applyTheme(data.description, data.temperature);

        resultsEl.innerHTML = `
            <div class="icon" title="${data.description}" tabindex="0">${data.icon}</div>
            <div class="temperature">${Math.round(data.temperature)}°</div>
            <div class="condition">${data.description}</div>
            <div class="details">
                <span>💧 ${data.humidity}%</span>
                <span>💨 ${data.wind_speed} km/h</span>
            </div>
        `;
    } catch (err) {
        resultsEl.innerHTML = '<p class="error">Network error. Please try again.</p>';
    }
}

getWeatherBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') getWeather();
});
