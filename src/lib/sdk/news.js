/**
 * Pulse News & Sentiment Engine - "Pulse Alpha" v2.0
 * 
 * Analyzes news headlines using a weighted vector formula.
 * Simulates AI-driven trend detection by categorizing institutional and social signals.
 */

const SIGNAL_VECTORS = {
  INSTITUTIONAL_RISK: {
    weight: -2.5,
    keywords: ['corruption', 'detained', 'mayor', 'jailed', 'probe', 'scandal', 'investigation', 'arrest', 'bribery', 'fraud']
  },
  MARKET_STABILITY: {
    weight: -1.5,
    keywords: ['lower', 'drop', 'slump', 'falls', 'ends lower', 'closing lower', 'bearish', 'index down', 'recession', 'unemployment']
  },
  SOCIAL_DYNAMISM: {
    weight: 2.0,
    keywords: ['innovation', 'startup', 'growth', 'launch', 'center', 'hub', 'award', 'best', 'top', 'expanding', 'opening']
  },
  CRITICAL_ALERTS: {
    weight: -3.0,
    keywords: ['conflict', 'war', 'explosion', 'emergency', 'unrest', 'escalating', 'threat', 'strike', 'shutdown', 'cyber']
  },
  RECOVERY_SIGNALS: {
    weight: 1.5,
    keywords: ['recovery', 'rebounds', 'gains', 'improves', 'surge', 'boom', 'steady', 'calm', 'restored']
  }
};

export async function fetchNews(city = 'Global', countryIso = 'US') {
  try {
    // Advanced query: "City, Country" avoids duplicate entities (like Bursa Malaysia)
    const query = encodeURIComponent(`${city}`);
    const gl = countryIso.toUpperCase();
    const ceid = `${gl}:en`; 
    
    // Proper nested encoding for the RSS proxy
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-${gl}&gl=${gl}&ceid=${ceid}`;
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    const res = await fetch(url);
    let data = await res.json();
    
    if (data.status !== 'ok' || !data.items || data.items.length === 0) {
      // Fallback to Global Urban/Market signals if local query is sparse
      const globalQuery = encodeURIComponent('Global Smart City Market Growth Stability');
      const fallbackUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://news.google.com/rss/search?q=${globalQuery}&hl=en-US&gl=US&ceid=US:en`)}`;
      const fRes = await fetch(fallbackUrl);
      data = await fRes.json();
    }

    if (data.status !== 'ok' || !data.items) return [];

    return data.items.map(item => {
        const analysis = analyzeSignal(item.title);
        return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.author || 'Pulse Source',
            sentiment: analysis.score,
            tag: analysis.tag
        };
    });
  } catch (e) {
    console.error('News Fetch Error:', e);
    return [];
  }
}

/**
 * Pulse Alpha Scoring Formula:
 * Score = 50 + Σ(VectorWeight * Frequency)
 */
export function analyzeSignal(title) {
  const t = title.toLowerCase();
  let score = 50;
  let detectedTag = 'NEUTRAL_SYNC';

  Object.entries(SIGNAL_VECTORS).forEach(([category, vector]) => {
    let hits = 0;
    vector.keywords.forEach(word => {
      if (t.includes(word)) {
        hits++;
        detectedTag = category;
      }
    });
    
    // Apply weighted displacement
    score += (hits * vector.weight * 5); // 5 is the intensity amplifier
  });

  return {
    score: Math.max(5, Math.min(95, Math.round(score))),
    tag: detectedTag
  };
}

export function scoreNews(newsArray) {
  if (!newsArray || newsArray.length === 0) return 50;
  const total = newsArray.reduce((acc, item) => acc + item.sentiment, 0);
  return Math.round(total / newsArray.length);
}
