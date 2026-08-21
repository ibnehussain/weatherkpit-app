const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather-btn');
const resultsEl = document.getElementById('results');

const THEME_CLASSES = ['theme-clear', 'theme-cloudy', 'theme-rain', 'theme-storm', 'theme-snow', 'theme-night'];
const TEMP_CLASSES = ['temp-cold', 'temp-mild', 'temp-warm', 'temp-hot'];

// ── Particle animation ──────────────────────────────────────────────────────

const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId = null;
let currentMode = null; // 'rain' | 'storm' | 'snow' | 'clear' | null

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (currentMode !== null) {
        initParticles(currentMode);
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Factory: create a single rain drop
function makeRain(storm) {
    const speed = storm ? 18 + Math.random() * 14 : 10 + Math.random() * 8;
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        len: storm ? 22 + Math.random() * 20 : 14 + Math.random() * 12,
        speed,
        alpha: 0.4 + Math.random() * 0.4,
        windX: storm ? 2 + Math.random() * 3 : 0.5 + Math.random(),
    };
}

// Factory: create a snowflake
function makeSnow() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: 2 + Math.random() * 4,
        speed: 1 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 0.6,
        alpha: 0.6 + Math.random() * 0.4,
    };
}

// Factory: create a sun-ray spoke
function makeSunRay() {
    return {
        angle: Math.random() * Math.PI * 2,
        rotSpeed: 0.0003 + Math.random() * 0.0004,
        len: 80 + Math.random() * 120,
        width: 6 + Math.random() * 18,
        alpha: 0.04 + Math.random() * 0.08,
    };
}

function initParticles(mode) {
    if (mode === 'rain' || mode === 'storm') {
        const count = mode === 'storm' ? 300 : 180;
        particles = Array.from({ length: count }, () => makeRain(mode === 'storm'));
    } else if (mode === 'snow') {
        particles = Array.from({ length: 120 }, makeSnow);
    } else if (mode === 'clear') {
        particles = Array.from({ length: 14 }, makeSunRay);
    } else {
        particles = [];
    }
}

function drawRain(p, storm) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = storm ? 'rgba(180,210,255,0.9)' : 'rgba(174,214,241,0.85)';
    ctx.lineWidth = storm ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.windX * (p.len / p.speed), p.y + p.len);
    ctx.stroke();
    ctx.restore();
}

function updateRain(p, storm) {
    p.x += p.windX;
    p.y += p.speed;
    if (p.y > canvas.height) {
        Object.assign(p, makeRain(storm));
        p.y = -p.len;
    }
}

function drawSnow(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function updateSnow(p) {
    p.x += p.drift;
    p.y += p.speed;
    if (p.y > canvas.height + p.r) {
        Object.assign(p, makeSnow());
        p.y = -p.r;
    }
}

// Sun rays are drawn from the top-left corner (sun position)
const SUN_X = () => canvas.width * 0.15;
const SUN_Y = () => canvas.height * 0.12;

function drawSunRay(p) {
    ctx.save();
    ctx.translate(SUN_X(), SUN_Y());
    ctx.rotate(p.angle);
    const grad = ctx.createLinearGradient(0, 0, p.len, 0);
    grad.addColorStop(0, `rgba(255,240,120,${p.alpha * 3})`);
    grad.addColorStop(1, 'rgba(255,240,120,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -p.width / 2);
    ctx.lineTo(p.len, 0);
    ctx.lineTo(0, p.width / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function updateSunRay(p) {
    p.angle += p.rotSpeed;
}

function drawSun() {
    const x = SUN_X();
    const y = SUN_Y();
    // glow
    const glow = ctx.createRadialGradient(x, y, 10, x, y, 80);
    glow.addColorStop(0, 'rgba(255,240,100,0.45)');
    glow.addColorStop(1, 'rgba(255,240,100,0)');
    ctx.save();
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.fill();
    // core
    ctx.fillStyle = 'rgba(255,248,160,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentMode === 'rain' || currentMode === 'storm') {
        const storm = currentMode === 'storm';
        particles.forEach(p => {
            drawRain(p, storm);
            updateRain(p, storm);
        });
    } else if (currentMode === 'snow') {
        particles.forEach(p => {
            drawSnow(p);
            updateSnow(p);
        });
    } else if (currentMode === 'clear') {
        particles.forEach(p => {
            drawSunRay(p);
            updateSunRay(p);
        });
        drawSun();
    }

    animFrameId = currentMode !== null ? requestAnimationFrame(animate) : null;
}

function startAnimation(mode) {
    if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    currentMode = mode;
    initParticles(mode);
    if (mode !== null) {
        animate();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ── Theme helpers ───────────────────────────────────────────────────────────

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

// maps theme class to animation mode
function animModeFromTheme(themeClass) {
    if (themeClass === 'theme-storm') return 'storm';
    if (themeClass === 'theme-rain') return 'rain';
    if (themeClass === 'theme-snow') return 'snow';
    if (themeClass === 'theme-clear') return 'clear';
    return null;
}

function applyTheme(description, temperature) {
    document.body.classList.remove(...THEME_CLASSES, ...TEMP_CLASSES);
    const themeClass = themeFromDescription(description);
    document.body.classList.add(themeClass, tempClassFromCelsius(temperature));
    startAnimation(animModeFromTheme(themeClass));
}

// ── Weather fetch ───────────────────────────────────────────────────────────

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
