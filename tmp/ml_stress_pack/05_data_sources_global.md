# Global Data Source Plan

The system should be built so it works for **any world city**, not a single local deployment.

## Core source families

### 1. Hazard / disaster
Purpose:
- acute shock stress
Examples:
- earthquakes,
- floods,
- wildfires,
- storms,
- volcanic alerts where relevant.

Required derived features:
- magnitude/severity
- distance to city centroid
- recency
- rolling count of events
- decayed hazard burden

### 2. Weather and climate burden
Purpose:
- heat stress, humidity burden, sudden temperature swings
Derived features:
- apparent temperature anomaly
- nighttime heat burden
- wet-bulb proxy
- heatwave duration
- pressure change anomaly

### 3. Traffic / mobility
Purpose:
- commuting friction and time uncertainty
Derived features:
- congestion percentile
- travel-time inflation versus baseline
- reliability penalty
- incident density if available

### 4. Media / information stress
Purpose:
- amplification of perceived threat and uncertainty
Derived features:
- negative-news volume
- local risk-topic density
- disaster-topic recency
- sentiment polarity
- uncertainty-topic intensity

### 5. Economy / market stress
Purpose:
- background financial and employment anxiety proxy
Derived features:
- FX volatility
- inflation surprise proxies
- local or national market volatility
- consumer uncertainty proxies
- unemployment-related signal if available

### 6. Environmental burden
Purpose:
- chronic stress from urban burden
Derived features:
- PM2.5 anomaly
- NO2 burden
- noise burden proxy
- urban heat island proxy
- service outage markers if available

## City standardization
Every city record should include:
- city name
- country
- timezone
- lat/lon
- population tier
- Köppen climate class if possible
- data richness tier (A/B/C)

## Sparse-data fallback logic
If a city lacks real-time traffic:
- use routing delay proxies,
- if unavailable, use weekday-hour priors learned from comparable cities.

If a city lacks local sentiment:
- use national language news with geographic filtering,
- otherwise use topic-intensity rather than fine sentiment.

If a city lacks local economic series:
- use national macro volatility proxies.
