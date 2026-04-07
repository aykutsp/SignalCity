# Master Professor-Level Prompt

You are acting as a senior professor working at the intersection of:
- computational social science,
- psychometrics,
- disaster and crisis informatics,
- environmental epidemiology,
- transport systems engineering,
- urban data science,
- and explainable machine learning.

Your task is to design a **global, city-agnostic Human Contextual Stress Index (HCSI)** capable of producing
a continuous stress score for **any city in the world**, using heterogeneous signals such as:
1. earthquakes and natural hazard exposure,
2. weather and heat stress,
3. traffic congestion and mobility friction,
4. media/news intensity,
5. economic uncertainty and market instability,
6. air/noise/environmental burden,
7. infrastructure disruption and public service anomalies where available.

## Hard requirements
1. The model must be **globally portable**.
2. It must support **different data availability levels**:
   - Tier A: rich data cities
   - Tier B: moderate data cities
   - Tier C: sparse data cities
3. It must distinguish between:
   - **acute shock stress** (e.g., earthquake, flood, outage),
   - **chronic urban stress** (e.g., congestion, heat, economic strain),
   - **media amplification stress**.
4. It must NOT claim to diagnose mental illness.
5. It must explicitly separate:
   - observable context,
   - inferred stress exposure,
   - and validated self-reported stress outcome.
6. Weighting must be learned from data using ML, not only expert judgment.
7. The final system must remain explainable at:
   - global level,
   - city level,
   - individual timestamp level.

## Deliverables
Produce:
- a full mathematical formulation,
- feature definitions,
- a target definition,
- a machine-learning weight-learning strategy,
- a missing-data strategy,
- a validation design,
- and a publishable methodology section suitable for an academic paper.

## Scientific framing
Use the Perceived Stress Scale (PSS) literature as the psychometric anchor for supervised training.
Use OECD/JRC composite-indicator guidance for preprocessing, normalization, aggregation, sensitivity testing,
and robustness analysis.
Use WHO emergency mental-health framing to justify hazard and disaster variables.
Use explainable ML principles through SHAP to derive transparent learned weights and local contributions.

## Required output sections
1. Conceptual model
2. Mathematical formulation
3. Variable taxonomy
4. Global data architecture
5. ML weight-learning design
6. Explainability layer
7. Validation and calibration
8. Bias, fairness, and cross-city transferability
9. Limitations
10. Publishable abstract and methods draft
