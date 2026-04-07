# Build Prompt for Coding Agents

Build a production-grade project named **global-city-stress-ml**.

## Objective
Create a city-agnostic platform that estimates a **Human Contextual Stress Index (0–100)** for any city in the world using:
- hazard events,
- weather burden,
- traffic friction,
- news/media intensity,
- economic uncertainty,
- environmental burden.

## Functional requirements
1. City search must support global cities.
2. Backend must accept a city + timestamp and compute:
   - baseline score,
   - ML score,
   - final hybrid score,
   - domain contributions,
   - confidence score.
3. The system must support missing data gracefully.
4. Weight learning must use:
   - baseline expert weights,
   - XGBoost or LightGBM trained on survey-aligned labels,
   - SHAP explanations.
5. Output must include:
   - numeric score,
   - stress band,
   - top contributors,
   - explanation text,
   - data coverage note.

## Technical requirements
- Python backend for modeling
- API-first architecture
- clear data contracts
- modular feature-engineering pipeline
- experiment tracking
- notebook for validation
- reproducible training script
- JSON schema for city-time input

## Modeling requirements
- Baseline logistic composite index
- ML regressor
- leave-one-city-out evaluation
- SHAP global and local explanations
- calibration to 0–100

## UI requirements
- global city search
- map-friendly design
- trend chart
- domain contribution chart
- acute-vs-chronic breakdown
- confidence / data coverage indicator

## Non-functional requirements
- explainable
- academically defensible
- scalable
- testable
- deployable

## Deliverables
- source code
- training pipeline
- sample dataset generator
- docs
- architecture diagram
- README
