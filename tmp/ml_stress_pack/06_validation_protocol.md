# Validation Protocol

## 1) Validation question
Does the index correlate with validated human stress outcomes, and does it generalize across cities?

## 2) Outcome measures
Primary:
- PSS-10 / PSS-14

Secondary:
- EMA stress ratings
- short-form stress or anxiety proxies
- carefully defined self-report app labels

## 3) Statistical evaluation
For continuous labels:
- RMSE
- MAE
- R²
- Spearman correlation
- Pearson correlation

For categorized stress bands:
- Accuracy
- Macro-F1
- AUROC
- calibration curves

## 4) Ablation studies
Run ablations:
- hazards only
- hazards + weather
- hazards + weather + traffic
- all without media
- all without economy
- all features full model

## 5) Transferability tests
- hold-out cities
- hold-out countries
- hold-out climate zones
- hold-out low-data cities

## 6) Sensitivity analysis
Following composite-indicator best practice, test sensitivity to:
- normalization method
- missing-data treatment
- feature grouping
- aggregation method
- calibration choice

## 7) Reliability
Estimate:
- temporal stability under no-shock periods,
- responsiveness during acute events,
- recovery profile after major disruptions.

## 8) Human interpretability tests
For selected examples, generate:
- top-5 contributing factors,
- domain-level contribution bar charts,
- event-decay explanation,
- confidence/coverage note based on available feeds.
