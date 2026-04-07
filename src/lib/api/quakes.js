export async function fetchQuakes(lat, lon, radius = 1000) {
  // Center centered on active location with specified radius (km)
  // Fallback to global 2.5 summary if no coords provided
  let url = 'https://earthquake.usgov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
  
  if (lat && lon) {
    url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=${radius}&minmagnitude=2.0`;
  }

  const res = await fetch(url, { next: { revalidate: 300 } });
  let data = await res.json();

  // If localized results are empty, fallback to global M2.5+ feed to keep the dashboard 'alive'
  if (lat && lon && (!data.features || data.features.length === 0)) {
    const fallback = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    data = await fallback.json();
    data.isFallback = true; // Flag for UI to indicate global data
  }
  
  return data;
}

export function getMagnitudeColor(mag) {
  if (mag >= 7) return '#ef476f';
  if (mag >= 5) return '#ff6b35';
  if (mag >= 4) return '#ffd166';
  if (mag >= 3) return '#06d6a0';
  return '#118ab2';
}

export function getMagnitudeLabel(mag) {
  if (mag >= 7) return 'Major';
  if (mag >= 5) return 'Strong';
  if (mag >= 4) return 'Moderate';
  if (mag >= 3) return 'Light';
  return 'Minor';
}

export function formatQuakeTime(timestamp, timezone = 'UTC') {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
    timeZone: timezone
  });
}
