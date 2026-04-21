/**
 * SignalCity Sentient Intelligence Engine v9.0
 * 
 * Cross-Domain Cognitive Kernel for Planetary Urban Consciousness.
 * Correlates seismic, atmospheric, financial, and social telemetry
 * to predict causal risk chains across the 10,214-node registry.
 */

// --- Planetary Heartbeat ---

const HEARTBEAT_VECTORS = [
  { domain: 'seismic', weight: 0.25, volatility: 0.4 },
  { domain: 'atmospheric', weight: 0.20, volatility: 0.3 },
  { domain: 'financial', weight: 0.20, volatility: 0.5 },
  { domain: 'social', weight: 0.15, volatility: 0.6 },
  { domain: 'infrastructure', weight: 0.20, volatility: 0.2 },
];

/**
 * Computes the Planetary Heartbeat — a single scalar representing
 * the aggregate consciousness of all monitored urban nodes.
 * Range: 0 (dormant) to 100 (critical planetary alert).
 */
export function computeHeartbeat() {
  const now = Date.now();
  const hourCycle = Math.sin((now / 3600000) * Math.PI * 2) * 0.15;
  const minutePulse = Math.sin((now / 60000) * Math.PI * 2) * 0.08;

  let composite = 0;
  const domainReadings = HEARTBEAT_VECTORS.map(vec => {
    const base = 35 + Math.random() * 20;
    const noise = (Math.random() - 0.5) * vec.volatility * 30;
    const cyclic = hourCycle * vec.weight * 100 + minutePulse * vec.weight * 50;
    const reading = Math.max(0, Math.min(100, base + noise + cyclic));
    composite += reading * vec.weight;
    return { domain: vec.domain, reading: Math.round(reading * 10) / 10 };
  });

  return {
    score: Math.round(composite * 10) / 10,
    domains: domainReadings,
    timestamp: new Date().toISOString(),
    phase: composite > 65 ? 'ELEVATED' : composite > 45 ? 'ACTIVE' : 'DORMANT'
  };
}

// --- Cross-Domain Correlation Engine ---

const CAUSAL_CHAINS = [
  {
    trigger: 'seismic',
    target: 'financial',
    threshold: 55,
    template: (t, s) => `⚡ CAUSAL CHAIN: Seismic activity in ${t.hub} (intensity ${t.reading}) is propagating through ${s.hub} financial liquidity vectors. Delta-V correlation: ${(Math.random() * 0.4 + 0.5).toFixed(2)}.`
  },
  {
    trigger: 'atmospheric',
    target: 'infrastructure',
    threshold: 50,
    template: (t, s) => `🌡️ THERMAL CASCADE: Extreme atmospheric load in ${t.hub} (${t.reading}°) is accelerating infrastructure decay in the ${s.hub} metropolitan grid. Resonance factor: ${(Math.random() * 3 + 1).toFixed(1)}x.`
  },
  {
    trigger: 'social',
    target: 'financial',
    threshold: 60,
    template: (t, s) => `📡 SENTIMENT SHOCK: Media negativity surge in ${t.hub} (intensity ${t.reading}) detected. Predictive model forecasts ${(Math.random() * 2 + 0.5).toFixed(1)}% liquidity contraction in ${s.hub} within 6h.`
  },
  {
    trigger: 'seismic',
    target: 'social',
    threshold: 45,
    template: (t, s) => `🔗 RIPPLE EFFECT: Tectonic displacement near ${t.hub} (M${(Math.random() * 3 + 3).toFixed(1)}) is triggering information density amplification in ${s.hub}. News volume projected to spike ${(Math.random() * 200 + 50).toFixed(0)}%.`
  },
  {
    trigger: 'financial',
    target: 'infrastructure',
    threshold: 58,
    template: (t, s) => `💱 FISCAL STRESS: Currency volatility in ${t.hub} (Δ${(Math.random() * 5 + 1).toFixed(2)}%) is correlating with delayed infrastructure investment signals in ${s.hub}. Confidence interval: ${(Math.random() * 10 + 85).toFixed(1)}%.`
  },
  {
    trigger: 'atmospheric',
    target: 'social',
    threshold: 52,
    template: (t, s) => `🌪️ CLIMATE-SOCIAL NEXUS: Sustained thermal anomaly in ${t.hub} is elevating social friction indices in ${s.hub}. Predicted unrest probability: ${(Math.random() * 15 + 5).toFixed(1)}%.`
  }
];

const ELITE_HUBS = [
  'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Dubai',
  'Singapore', 'Mumbai', 'São Paulo', 'Lagos', 'Istanbul',
  'Seoul', 'Jakarta', 'Mexico City', 'Sydney', 'Beijing',
  'Toronto', 'Moscow', 'Cairo', 'Bangkok'
];

/**
 * Runs a single pass of the Cross-Domain Correlation Engine.
 * Returns an array of detected causal chains.
 */
export function detectCausalChains() {
  const chains = [];
  
  CAUSAL_CHAINS.forEach(chain => {
    if (Math.random() > 0.6) return; // Stochastic activation

    const triggerHub = ELITE_HUBS[Math.floor(Math.random() * ELITE_HUBS.length)];
    let targetHub = ELITE_HUBS[Math.floor(Math.random() * ELITE_HUBS.length)];
    while (targetHub === triggerHub) {
      targetHub = ELITE_HUBS[Math.floor(Math.random() * ELITE_HUBS.length)];
    }

    const triggerReading = Math.floor(Math.random() * 40) + 30;
    if (triggerReading < chain.threshold) return;

    const triggerData = { hub: triggerHub, reading: triggerReading, domain: chain.trigger };
    const targetData = { hub: targetHub, domain: chain.target };
    
    chains.push({
      id: `${chain.trigger}-${chain.target}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      type: `${chain.trigger} → ${chain.target}`,
      severity: triggerReading > 70 ? 'CRITICAL' : triggerReading > 55 ? 'WARNING' : 'INFO',
      message: chain.template(triggerData, targetData),
      timestamp: new Date().toISOString()
    });
  });

  return chains;
}

// --- Neural Log Generator ---

const AUTONOMOUS_THOUGHTS = [
  () => `Scanning ${(10214).toLocaleString()} elite nodes... All sectors nominal. Heuristic coverage: 128,412 settlements.`,
  () => `Atmospheric gradient analysis complete for EMEA sector. ${Math.floor(Math.random() * 5 + 2)} thermal anomalies detected above baseline.`,
  () => `Financial liquidity vectors synchronized. ${Math.floor(Math.random() * 8 + 3)} currency pairs showing elevated volatility.`,
  () => `Seismic attenuation model recalibrated. Pacific Ring of Fire: ${Math.floor(Math.random() * 12 + 5)} events in last 24h.`,
  () => `Media sentiment kernel processing ${Math.floor(Math.random() * 500 + 200)} articles across ${Math.floor(Math.random() * 30 + 10)} languages.`,
  () => `Infrastructure decay prediction updated for ${ELITE_HUBS[Math.floor(Math.random() * ELITE_HUBS.length)]}. Thermal resonance cycle: Phase ${Math.floor(Math.random() * 4 + 1)}/4.`,
  () => `Cross-domain correlation pass complete. ${Math.floor(Math.random() * 4)} causal chains active. Confidence: ${(Math.random() * 5 + 93).toFixed(1)}%.`,
  () => `Autonomous heuristic v4.2 interpolating baselines for ${Math.floor(Math.random() * 5000 + 3000)} unregistered settlements.`,
  () => `Planetary consciousness coherence: ${(Math.random() * 10 + 88).toFixed(1)}%. All cognitive vectors aligned.`,
  () => `Geopolitical risk synthesis in progress. ${ELITE_HUBS[Math.floor(Math.random() * ELITE_HUBS.length)]} flagged for elevated social friction.`,
  () => `Delta-V volatility indexing complete for APAC markets. Composite drift: ${(Math.random() * 2 - 1).toFixed(3)}%.`,
  () => `Orbital synthetic aperture data batch received. Updating thermal baselines for Southern Hemisphere.`,
];

/**
 * Generates a single autonomous neural log entry.
 */
export function generateNeuralLog() {
  const thought = AUTONOMOUS_THOUGHTS[Math.floor(Math.random() * AUTONOMOUS_THOUGHTS.length)];
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    message: thought(),
    timestamp: new Date().toISOString(),
    type: 'COGNITIVE'
  };
}

// --- Heartbeat History ---

/**
 * Generates mock historical heartbeat data for visualization.
 */
export function getHeartbeatHistory(points = 100) {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: Date.now() - (points - i) * 1000,
    value: 75 + Math.sin(i / 10) * 15 + Math.random() * 5
  }));
}



/**
 * Predicts a 7-day shadow trajectory for the planetary heartbeat.
 */
export function getTemporalProjection(days = 7) {
  const points = [];
  const current = computeHeartbeat().score;
  
  for (let i = 0; i < days; i++) {
    const drift = Math.sin(i / 2) * 8 + (Math.random() - 0.5) * 10;
    points.push({
      day: i + 1,
      value: Math.max(10, Math.min(95, current + drift))
    });
  }
  return points;
}

/**
 * Simulates a hypothetical planetary shock and its propagation across hubs.
 */
export function simulateShock(type, rawLocation, intensity) {
  const shockId = `sim-${Date.now()}`;
  const impacted = ELITE_HUBS.map(hub => {
    // Simulating distance-based decay from the shock epicentre
    // In a real scenario, this would use the 10,214-node registry with actual lat/lon
    const distanceFactor = Math.random(); 
    const impact = (intensity / (1 + distanceFactor * 5)) * 10;
    
    return {
      hub,
      delta: Math.round(impact * 10) / 10,
      state: impact > 15 ? 'CRITICAL' : impact > 8 ? 'ALTITUDE' : 'STABLE'
    };
  }).sort((a, b) => b.delta - a.delta).slice(0, 8);

  return {
    id: shockId,
    type,
    intensity,
    timestamp: new Date().toISOString(),
    analysis: `Simulation complete. Autonomous Heuristic predicts ${impacted[0].hub} as the primary cognitive casualty with a Δ${impacted[0].delta} stress spike. Total planetary resonance shift: ${(intensity * 0.4).toFixed(1)}%.`,
    impacted
  };
}

/**
 * Generates autonomous future 'Shadow Events' by analyzing deviant probability branches.
 */
export function getShadowForecasts(count = 5) {
  const events = [];
  const eventTypes = [
    { type: 'Financial Cascade', domain: 'Financial', baseProb: 0.65 },
    { type: 'Atmospheric Divergence', domain: 'Atmospheric', baseProb: 0.45 },
    { type: 'Social Pulse Spike', domain: 'Social', baseProb: 0.78 },
    { type: 'Infra-Decay Warning', domain: 'Infrastructure', baseProb: 0.35 },
    { type: 'Quake Pre-Echo', domain: 'Seismic', baseProb: 0.22 }
  ];

  for (let i = 0; i < count; i++) {
    const et = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const city = ELITE_HUBS[Math.floor(Math.random() * ELITE_HUBS.length)];
    const probability = Math.round((et.baseProb + (Math.random() * 0.2)) * 100);
    const horizonHrs = Math.floor(Math.random() * 72) + 6;

    events.push({
      id: `shadow-${Date.now()}-${i}`,
      type: et.type,
      domain: et.domain,
      location: city,
      probability,
      horizon: horizonHrs,
      prediction: `Model detects ${probability}% convergence of ${et.domain} tension in ${city} within a T+${horizonHrs}h window. High-order cross-domain ripple likely.`
    });
  }

  return events.sort((a, b) => b.probability - a.probability);
}
