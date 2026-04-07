# Global City Stress ML Prompt Pack

This pack is designed for building a **global, city-agnostic Human Contextual Stress Index (HCSI)** with
**machine-learned weights** instead of fixed expert weights.

## What is inside
- `01_master_professor_prompt.md` — professor-level research prompt
- `02_system_design.md` — end-to-end system architecture
- `03_formulas_and_modeling.md` — mathematical formulations
- `04_ml_weight_learning.md` — ML-based weight learning and explainability
- `05_data_sources_global.md` — global data-source plan for any city
- `06_validation_protocol.md` — academic validation framework
- `07_feature_catalog.md` — city stress feature library
- `08_reference_archive.md` — source archive and APA-style citations
- `09_build_prompt_for_coding_agents.md` — implementation prompt for coding agents
- `data_schema.json` — normalized input schema

## Core idea
The system estimates **contextual urban stress exposure**, not a clinical diagnosis.
The recommended supervised target is **PSS-10 / PSS-14** or a validated stress proxy collected from users.

## Suggested modeling stack
- Baseline: weighted composite index
- ML model: XGBoost / LightGBM
- Explainability: SHAP
- Calibration: isotonic regression or Platt-style calibration where appropriate
