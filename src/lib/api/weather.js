const SF_LAT = 37.7749;
const SF_LON = -122.4194;

export async function fetchWeather(lat = SF_LAT, lon = SF_LON) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index,surface_pressure&hourly=temperature_2m,weather_code,wind_speed_10m,uv_index,surface_pressure,relative_humidity_2m&forecast_days=2&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Weather API failed');
  return res.json();
}

export function getWeatherLabel(code) {
  const map = {
    0: 'Clear Sky', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    80: 'Rain Showers', 81: 'Mod. Rain Showers', 82: 'Heavy Rain Showers',
    95: 'Thunderstorm', 96: 'Hail Thunderstorm', 99: 'Heavy Hail Storm',
  };
  return map[code] || 'Unknown';
}

export function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '🌨️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}
