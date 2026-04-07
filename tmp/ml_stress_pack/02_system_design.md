# System Design for a Global City-Agnostic Stress Engine

## 1) Problem framing
The system predicts **contextual stress exposure** for a city-time pair:
\[
(city, t) \rightarrow \hat{S}_{city,t} \in [0,100]
\]

Recommended use:
- urban observability,
- civic risk dashboards,
- public health early warning support,
- travel/user-facing context dashboards.

Not recommended:
- clinical diagnosis,
- treatment decisions,
- emergency triage without human oversight.

## 2) Three-layer architecture

### Layer 1 — Data ingestion
Global inputs may include:
- seismic/hazard feeds,
- weather and heat indices,
- news volume and sentiment,
- traffic/mobility indicators,
- market volatility and macro stress signals,
- air/noise/environmental proxies,
- utility/service disruption proxies.

### Layer 2 — Feature engineering
Transform raw inputs into:
- acute event features,
- chronic exposure features,
- event-decay features,
- anomaly scores,
- lagged and rolling-window features,
- city-normalized percentile features.

### Layer 3 — Stress modeling
Two-stage approach:
1. **Transparent baseline index**
2. **ML-corrected stress estimator**

Recommended structure:
\[
\hat{S}_{final} = \alpha \cdot S_{baseline} + (1-\alpha) \cdot S_{ML}
\]

This hybrid design preserves interpretability while improving predictive performance.

## 3) Portability strategy across world cities
For every feature, define:
- preferred source,
- fallback source,
- synthetic proxy if source unavailable.

Example:
- traffic:
  - preferred: live congestion feed
  - fallback: routing ETA inflation
  - sparse proxy: road-density × commuter population × weekday/time prior

## 4) Tiered deployment
- **Tier A**: real-time city APIs + local sensors
- **Tier B**: global public APIs + news + weather + hazard
- **Tier C**: hazard + weather + macro + remotely sensed / open proxies

## 5) Ground-truth strategy
Train against one of the following:
- PSS-10 / PSS-14 survey labels,
- validated short-form stress scales,
- repeated EMA stress ratings,
- cautiously, a multi-proxy latent target if self-report is unavailable.

Gold standard recommendation:
Repeated self-report stress labels with city/time alignment.
