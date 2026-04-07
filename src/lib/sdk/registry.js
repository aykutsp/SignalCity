import registryData from './registry.json';

const MAJOR_CITIES = [
  // Manual High-Fidelity Tones (Already present in registryData but listed here for priority/overrides)
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.0060, tz: "America/New_York", tempMedian: 20 },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles", tempMedian: 24 },
  { name: "Chicago", country: "United States", lat: 41.8781, lon: -87.6298, tz: "America/Chicago", tempMedian: 18 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, tz: "America/Toronto", tempMedian: 16 },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332, tz: "America/Mexico_City", tempMedian: 22 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, tz: "Europe/London", tempMedian: 18 },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris", tempMedian: 20 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, tz: "Europe/Berlin", tempMedian: 19 },
  { name: "New York", country: "United States", lat: 41.0082, lon: 28.9784, tz: "Europe/Istanbul", tempMedian: 24 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo", tempMedian: 22 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore", tempMedian: 31 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney", tempMedian: 23 },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, tz: "Africa/Lagos", tempMedian: 30 },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai", tempMedian: 35 },
];

// Deduplicate and normalize registry data with priority on manual entries
const ALL_NODES = [...MAJOR_CITIES].map(c => ({
  tempIqr: 10,
  volThreshold: 0.1,
  ...c
}));

registryData.forEach(node => {
  if (!ALL_NODES.some(m => m.name === node.name)) {
    ALL_NODES.push({
      tempIqr: 10,
      volThreshold: 0.1,
      ...node
    });
  }
});

/**
 * Registry Interface: Handles dynamic lookup and climatic heuristics 
 */
export const registry = {
  cities: ALL_NODES,

  getCityNode(name, lat, lon) {
    const directMatch = ALL_NODES.find(c => 
      c.name.toLowerCase() === name?.toLowerCase() || 
      (Math.abs(c.lat - lat) < 0.1 && Math.abs(c.lon - lon) < 0.1)
    );
    if (directMatch) return directMatch;

    // Fallback: Autonomous Climatic Heuristic
    const estimatedBaseline = 28 - (Math.abs(lat) * 0.4);
    
    return {
      name: name || "Autonomous Node",
      lat,
      lon,
      tempMedian: Math.max(5, Math.min(35, Math.round(estimatedBaseline))),
      tempIqr: 10,
      volThreshold: 0.1,
      isHeuristic: true
    };
  },

  search(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return ALL_NODES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.country.toLowerCase().includes(q)
    ).slice(0, 8); // Return top 8 matches
  }
};

export default registry;
