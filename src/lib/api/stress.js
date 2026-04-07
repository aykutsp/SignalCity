/**
 * Computes an ambient stress score (0-100) for a location
 * based on environmental signals and social sentiment.
 *
 * Factors:
 * - Wind, UV, Temp deviation (Environmental)
 * - Social Tension (News Sentiment)
 * - Market Stability (FX Volatility - placeholders for now)
 */
export function computeStress(weather, newsSentiment = 50) {
  if (!weather?.current) return null;

  const c = weather.current;
  const temp = c.temperature_2m ?? 21;
  const humidity = c.relative_humidity_2m ?? 45;
  const wind = c.wind_speed_10m ?? 0;
  const uv = c.uv_index ?? 0;
  const pressure = c.surface_pressure ?? 1013;

  // Temperature stress: deviation from 21°C comfort
  const tempStress = Math.min(Math.abs(temp - 21) * 3.0, 20);

  // Wind stress
  const windStress = Math.min(wind * 1.0, 15);

  // UV stress
  const uvStress = Math.min(uv * 2.5, 15);

  // Humidity stress: deviation from 45%
  const humidityStress = Math.min(Math.abs(humidity - 45) * 0.4, 10);

  // Pressure stress: deviation from 1013 hPa
  const pressureStress = Math.min(Math.abs(pressure - 1013) * 0.5, 15);

  // Social Tension: Inverted news sentiment (Sentiment 0 = Stress 25, Sentiment 100 = Stress 0)
  const socialStress = Math.round(Math.max(0, (100 - newsSentiment) * 0.25));

  const total = Math.round(
    Math.min(tempStress + windStress + uvStress + humidityStress + pressureStress + socialStress, 100)
  );

  return {
    score: total,
    level: getLevel(total),
    factors: [
      { name: 'Temperature', value: Math.round(tempStress), max: 20, raw: `${temp.toFixed(1)}°C` },
      { name: 'Wind', value: Math.round(windStress), max: 15, raw: `${wind.toFixed(1)} km/h` },
      { name: 'UV Index', value: Math.round(uvStress), max: 15, raw: uv.toFixed(1) },
      { name: 'Social Tension', value: socialStress, max: 25, raw: `${newsSentiment}/100 Sentiment` },
      { name: 'Humidity', value: Math.round(humidityStress), max: 10, raw: `${humidity}%` },
      { name: 'Pressure', value: Math.round(pressureStress), max: 15, raw: `${pressure.toFixed(0)} hPa` },
    ].sort((a, b) => b.value - a.value),
  };
}

function getLevel(score) {
  if (score <= 20) return { label: 'Calm', color: '#06d6a0' };
  if (score <= 40) return { label: 'Mild', color: '#118ab2' };
  if (score <= 60) return { label: 'Active', color: '#ffd166' };
  if (score <= 80) return { label: 'High Pressure', color: '#ff6b35' };
  return { label: 'Extreme', color: '#ef476f' };
}
