/**
 * Pulse SDK - City Evaluation Engine
 * Logic for generating qualitative assessments based on quantitative signals.
 */

export function evaluateCity(data) {
  if (!data || !data.weather || !data.stress) return null;

  const { weather, stress, quakes, newsScore } = data;
  const c = weather.current;
  
  const assessments = [];

  // 1. Environmental Assessment
  const temp = c.temperature_2m;
  const uv = c.uv_index;
  if (uv > 8) assessments.push({ type: 'danger', category: 'Environmental', message: 'Extreme UV radiation detected. Outdoor activity risk: High.' });
  else if (temp > 35) assessments.push({ type: 'warning', category: 'Environmental', message: 'Heat stress localized. Energy grid pressure escalating.' });
  else if (temp < 0) assessments.push({ type: 'warning', category: 'Environmental', message: 'Freezing conditions. Infrastructure thermal stress active.' });
  else assessments.push({ type: 'info', category: 'Environmental', message: 'Atmospheric parameters within nominal human comfort range.' });

  // 2. Seismic Assessment
  const quakeCount = quakes?.features?.length || 0;
  const maxMag = quakeCount > 0 ? Math.max(...quakes.features.map(f => f.properties.mag)) : 0;
  if (maxMag > 5) assessments.push({ type: 'danger', category: 'Seismic', message: `Significant regional event (M${maxMag.toFixed(1)}) detected within tracking radius.` });
  else if (quakeCount > 5) assessments.push({ type: 'warning', category: 'Seismic', message: 'Elevated regional micro-seismic activity. Monitoring for swarms.' });
  else assessments.push({ type: 'info', category: 'Seismic', message: 'Plate boundaries stable. Micro-seismic noise at baseline levels.' });

  // 3. Social & Sentiment Assessment
  if (newsScore < 30) assessments.push({ type: 'danger', category: 'Social', message: 'Negative sentiment saturation in local news signals. High social tension probability.' });
  else if (newsScore < 50) assessments.push({ type: 'warning', category: 'Social', message: 'Uncertain social signals detected. Ambiguous news sentiment.' });
  else assessments.push({ type: 'info', category: 'Social', message: 'Positive social momentum. Community sentiment trending upwards.' });

  // 4. Composite Stability
  const stability = 100 - stress.score;
  let rating = 'S';
  if (stability < 80) rating = 'A';
  if (stability < 60) rating = 'B';
  if (stability < 40) rating = 'C';
  if (stability < 20) rating = 'D';

  return {
    rating,
    stability: `${stability}%`,
    assessments
  };
}
