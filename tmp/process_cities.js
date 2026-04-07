const fs = require('fs');
const path = require('path');

const INPUT_PATH = path.join(__dirname, '../src/lib/sdk/cities_full.json');
const OUTPUT_PATH = path.join(__dirname, '../src/lib/sdk/registry.json');

try {
  console.log('Reading cities_full.json (21MB)...');
  const rawData = fs.readFileSync(INPUT_PATH, 'utf8');
  const cities = JSON.parse(rawData);
  console.log(`Total cities found: ${cities.length}`);

  // Stratify sampling to ensure global coverage (Top 10,000)
  // Since we don't have population, we'll pick cities across all countries
  const countryBuckets = {};
  cities.forEach(c => {
    if (!countryBuckets[c.country]) countryBuckets[c.country] = [];
    countryBuckets[c.country].push({
      name: c.name,
      country: c.country,
      lat: parseFloat(c.lat),
      lon: parseFloat(c.lng),
      // Estimate timezone based on longitude (very rough)
      tz: `UTC${Math.round(parseFloat(c.lng) / 15) >= 0 ? '+' : ''}${Math.round(parseFloat(c.lng) / 15)}`,
      // Autonomous Temperature Baseline calculated by latitude
      tempMedian: Math.max(5, Math.min(35, Math.round(28 - (Math.abs(parseFloat(c.lat)) * 0.4))))
    });
  });

  const eliteRegistry = [];
  const maxPerCountry = 150; // Ensure diversity

  Object.keys(countryBuckets).forEach(country => {
    const list = countryBuckets[country];
    // Take up to 150 from each country to prevent single-country dominance
    eliteRegistry.push(...list.slice(0, maxPerCountry));
  });

  // Final trim to ~10,000 for perfect performance
  const finalRegistry = eliteRegistry.slice(0, 10000);
  
  console.log(`Final Elite Registry size: ${finalRegistry.length} nodes.`);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalRegistry, null, 2));
  console.log('Successfully generated src/lib/sdk/registry.json');
} catch (err) {
  console.error('Processing failed:', err);
}
