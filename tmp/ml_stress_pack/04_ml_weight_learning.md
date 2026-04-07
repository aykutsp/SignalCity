# ML Weight Learning and Explainability

## 1) Why learned weights?
Fixed weights are useful for a baseline, but stress responses are context-dependent and nonlinear.
For example:
- the same temperature anomaly may matter more in a humid city,
- earthquake salience may depend on recency and media coverage,
- traffic stress may rise sharply beyond a threshold instead of linearly.

Therefore, the primary version should learn weights from data.

## 2) Recommended learning pipeline
### Step A — Transparent baseline
Create an expert-guided baseline index.

### Step B — Supervised model
Train a model to predict validated stress labels:
- XGBoost regressor,
- LightGBM regressor,
- Elastic Net as a linear baseline,
- optionally a mixed-effects model for city-level random intercepts.

### Step C — Explainability
Use SHAP:
- global mean absolute SHAP values,
- local explanations,
- grouped domain-level attributions.

## 3) Suggested target hierarchy
Preferred:
1. PSS-10 / PSS-14
2. Ecological momentary assessment (EMA) stress labels
3. Validated app-based stress self-ratings
4. Carefully constructed latent targets if direct labels absent

## 4) Cross-city generalization
Recommended evaluation splits:
- random split,
- time-based split,
- leave-one-city-out validation,
- leave-one-country-out validation for robustness.

## 5) Models
### Linear benchmark
Pros:
- simplest interpretation
- direct coefficients
Cons:
- weak on interactions and thresholds

### XGBoost / LightGBM
Pros:
- handles missingness well
- captures nonlinear relationships
- strong performance on structured tabular data
Cons:
- requires post-hoc interpretability tools

## 6) Weight extraction logic
For a linear model:
- use standardized coefficients as global weights.

For tree models:
- use mean absolute SHAP values as learned influence weights.
- compute both feature-level and domain-level normalized importance.

## 7) Domain-level learned weight computation
Suppose hazard features are indexed by \(H\), traffic by \(T\), etc.
Then:

\[
W_{hazard} = \frac{\sum_{k \in H} E[|\phi_k|]}
{\sum_{j=1}^{K} E[|\phi_j|]}
\]

Repeat for all domains.

## 8) Calibration
The raw model output can be calibrated to a 0–100 score using:
- min-max scaling on training labels,
- percentile calibration,
- isotonic regression if monotonic calibration is preferred.

## 9) Fairness and robustness
Check whether performance differs by:
- continent,
- income group,
- climate zone,
- city population size,
- data richness tier.

## 10) Publishable contribution angle
A strong paper contribution is:
“an explainable, globally portable, machine-learned contextual stress index integrating hazard, mobility,
environmental, media, and macroeconomic signals with cross-city transfer evaluation.”
