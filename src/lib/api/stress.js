import registry from '../sdk/registry';

/**
 * Computes the Human Chronic Stress Index (HCSI) v4.0 - Global ML Edition
 * Features:
 * 1. Acute vs Chronic Decomposition
 * 2. Adaptive Calibration (Global Registry + Heuristics)
 * 3. Media Amplification (Volume * Negativity)
 * 4. Missing-Data Robustness Formula
 */
export function computeStress(weather, newsSentiment = 50, quakes = [], rates = [], options = {}) {
  const { cityName = 'default', newsVolume = 0, lat = 40.7, lon = -74 } = options;
  
  // Dynamic Calibration from Global Registry + Heuristic Fallback
  const profile = registry.getCityNode(cityName, lat, lon);
  const tempMedian = profile.tempMedian || 21;
  const tempIqr = 10; // Default variance
  const volThreshold = 0.10; // Default volatility thresh

  if (!weather?.current) return null;

  const c = weather.current;
  const temp = c.temperature_2m ?? profile.tempMedian;
  const wind = c.wind_speed_10m ?? 0;
  const humidity = c.relative_humidity_2m ?? 45;

  // --- 1. CHRONIC BURDEN (C_t) ---
  // Adaptive Weather Burden: Deviation from city-specific median
  const tempAnomaly = Math.abs(temp - profile.tempMedian) / (profile.tempIqr + 2);
  const v_chronic_weather = Math.min(tempAnomaly * 1.5 + (wind / 60) + (Math.abs(humidity - 45) * 0.02), 4.0);
  
  // Economic Strain: Relative FX volatility spread
  const ratesList = Array.isArray(rates) ? rates : [];
  const spread = ratesList.length > 1 ? (Math.max(...ratesList.map(r => r.rate)) - Math.min(...ratesList.map(r => r.rate))) : 0;
  const v_chronic_econ = Math.min(spread / (profile.volThreshold + 0.1), 3.0);

  // --- 2. ACUTE SHOCK (A_t) ---
  // Seismic Shock with Distance Attenuation & Temporal Decay
  let v_acute_hazard = 0;
  const now = Date.now();
  quakes.forEach(q => {
    const ageHours = (now - new Date(q.properties.time).getTime()) / (1000 * 60 * 60);
    if (ageHours > 72) return; // 72h memory for v3.0
    
    const decay = Math.exp(-0.04 * ageHours); // Slower 72h decay
    const dist = q.properties.dist || 500;
    const attenuation = 1 / (1 + (dist / 250) ** 2); // Squared distance attenuation
    const intensity = (q.properties.mag ** 2) * attenuation;
    v_acute_hazard += intensity * decay;
  });
  v_acute_hazard = Math.min(v_acute_hazard * 2.5, 4.0);

  // --- 3. MEDIA AMPLIFICATION (M_t) ---
  // News Volume * Sentiment Negativity Displacement
  const sentimentNegativity = Math.max(0, (100 - newsSentiment) / 50); // 0-2.0 range
  const mediaLoad = Math.min((newsVolume / 20) * sentimentNegativity, 3.0);
  const v_media = mediaLoad;

  // --- 4. PROTECTIVE FACTORS (P_t) & INFRASTRUCTURE ---
  const localHour = (new Date().getHours()) % 24;
  const v_infra = (Math.sin((localHour - 8) * Math.PI / 6) + 1) * 0.5; // Infrastructure load peak

  // --- 5. ROBUST MISSING-DATA AGGREGATION ---
  // Formula: Z = (Σ m_k * w_k * v_k) / (Σ m_k * |w_k|)
  const vectors = [
    { val: v_acute_hazard, weight: 0.35, active: quakes.length > 0 },
    { val: v_chronic_weather, weight: 0.20, active: true },
    { val: v_chronic_econ, weight: 0.15, active: rates.length > 0 },
    { val: v_media, weight: 0.20, active: newsVolume > 0 },
    { val: v_infra, weight: 0.10, active: true },
  ];

  let weightedSum = 0;
  let activeWeightSum = 0;
  vectors.forEach(v => {
    if (v.active) {
      weightedSum += v.val * v.weight;
      activeWeightSum += v.weight;
    }
  });
  const z_score = weightedSum / (activeWeightSum || 1);

  // Sigmoid Hybrid Normalization
  // Shifted for ML sensitivity: center=1.8
  const sigmoid = (x) => 1 / (1 + Math.exp(-(x - 1.8) * 3.5));
  const finalScore = Math.round(sigmoid(z_score) * 100);

  return {
    score: finalScore,
    level: getLevel(finalScore),
    metadata: {
      calibration: cityName !== 'default' ? `Normalized to ${cityName} baseline` : 'Global average calibration',
      version: 'v4.0-Predictive'
    },
    factors: [
      { name: 'Acute Hazard', value: Math.round(v_acute_hazard * 25), max: 100, raw: `${quakes.length} events (weighted)` },
      { name: 'Media Load', value: Math.round(v_media * 33.3), max: 100, raw: `${newsVolume} stories, ${newsSentiment}% sent.` },
      { name: 'Chronic weather', value: Math.round(v_chronic_weather * 25), max: 100, raw: `${temp.toFixed(1)}°C (${(tempAnomaly).toFixed(1)}σ deviation)` },
      { name: 'Economic strain', value: Math.round(v_chronic_econ * 33.3), max: 100, raw: `Volatility: ${spread.toFixed(4)}` },
      { name: 'Infrastructure', value: Math.round(v_infra * 100), max: 100, raw: `Hour ${localHour}:00 load` },
    ].sort((a, b) => b.value - a.value),
  };
}

export function computeStressForecast(weather, newsSentiment, quakes, rates, options = {}) {
  const { cityName = 'default', newsVolume = 0, lat = 40.7, lon = -74 } = options;
  const profile = registry.getCityNode(cityName, lat, lon);
  
  if (!weather?.hourly) return [];

  const forecast = [];
  const h = weather.hourly;
  const now = new Date();
  
  // Project for next 48 hours
  for (let i = 0; i < 48; i++) {
    const time = new Date(h.time[i]);
    const localHour = time.getHours();
    
    // 1. Forecasted Chronic Weather
    const temp = h.temperature_2m[i] ?? profile.tempMedian;
    const wind = h.wind_speed_10m[i] ?? 0;
    const humidity = h.relative_humidity_2m[i] ?? 45;
    const tempAnomaly = Math.abs(temp - profile.tempMedian) / (profile.tempIqr + 2);
    const v_chronic_weather = Math.min(tempAnomaly * 1.5 + (wind / 60) + (Math.abs(humidity - 45) * 0.02), 4.0);

    // 2. Cyclic Infrastructure Peaks (Thermal Resonance)
    const v_infra = (Math.sin((localHour - 8) * Math.PI / 6) + 1) * 0.5;

    // 3. Acute Decay Persistence (Hazards & Media)
    // As we move into the future, assume current shocks decay
    const hoursInFuture = i;
    const decayFactor = Math.exp(-0.04 * hoursInFuture); 
    
    // Baseline Acute (current level)
    const currentStress = computeStress(weather, newsSentiment, quakes, rates, options);
    const currentAcute = (currentStress.factors.find(f => f.name === 'Acute Hazard')?.value || 0) / 25;
    const currentMedia = (currentStress.factors.find(f => f.name === 'Media Load')?.value || 0) / 33.3;
    
    const v_acute_decayed = currentAcute * decayFactor;
    const v_media_decayed = currentMedia * Math.exp(-0.1 * hoursInFuture); // Media decays faster

    // 4. Robust Aggregation
    const ratesList = Array.isArray(rates) ? rates : [];
    const spread = ratesList.length > 1 
      ? (Math.max(...ratesList.map(r => r.rate)) - Math.min(...ratesList.map(r => r.rate))) 
      : 0;
    const v_chronic_econ = Math.min(spread / (profile.volThreshold + 0.1), 3.0);

    const weightedSum = (v_acute_decayed * 0.35) + (v_chronic_weather * 0.20) + (v_chronic_econ * 0.15) + (v_media_decayed * 0.20) + (v_infra * 0.10);
    const sigmoid = (x) => 1 / (1 + Math.exp(-(x - 1.8) * 3.5));
    const score = Math.round(sigmoid(weightedSum) * 100);

    forecast.push({
      time: h.time[i],
      hour: localHour,
      score: score,
      weather: temp.toFixed(1),
      infraLoad: Math.round(v_infra * 100)
    });
  }

  return forecast;
}

function getLevel(score) {
  if (score <= 20) return { label: 'Optimal', color: '#06d6a0' };
  if (score <= 40) return { label: 'Stable', color: '#118ab2' };
  if (score <= 60) return { label: 'Strained', color: '#ffd166' };
  if (score <= 80) return { label: 'High Pressure', color: '#ff6b35' };
  return { label: 'Critical', color: '#ef476f' };
}
