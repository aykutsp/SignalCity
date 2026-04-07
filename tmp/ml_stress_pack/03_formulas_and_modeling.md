# Formulas and Modeling

## 1) Baseline stress index
Let the contextual stress index before calibration be:

\[
Z_t = \sum_{k=1}^{K} w_k \tilde{x}_{k,t}
\]

where:
- \(\tilde{x}_{k,t}\) is the normalized feature \(k\) at time \(t\),
- \(w_k\) is the feature weight.

The bounded baseline score is:

\[
S_{baseline,t} = 100 \cdot \sigma(Z_t)
\quad\text{with}\quad
\sigma(z)=\frac{1}{1+e^{-z}}
\]

## 2) Acute + chronic decomposition
Represent total stress as:

\[
S_t = \beta_1 A_t + \beta_2 C_t + \beta_3 M_t - \beta_4 P_t
\]

where:
- \(A_t\): acute shock stress,
- \(C_t\): chronic background stress,
- \(M_t\): media amplification,
- \(P_t\): protective or dampening factors.

### Acute shock component
\[
A_t = \sum_{e \in \mathcal{E}_t}
\Big[
I_e \cdot g(d_e) \cdot h(v_e) \cdot \exp(-\lambda_e \Delta t_e)
\Big]
\]

where:
- \(I_e\): event severity,
- \(d_e\): distance from city centroid,
- \(g(d_e)\): distance attenuation,
- \(v_e\): vulnerability/exposure modifier,
- \(\Delta t_e\): elapsed time since event,
- \(\lambda_e\): event-specific decay rate.

A common distance attenuation:

\[
g(d_e)=\frac{1}{1+(d_e/d_0)^\eta}
\]

### Chronic component
\[
C_t = \gamma_1 H_t + \gamma_2 T_t + \gamma_3 Q_t + \gamma_4 E_t
\]

where:
- \(H_t\): heat/weather burden,
- \(T_t\): traffic/mobility friction,
- \(Q_t\): environmental quality burden,
- \(E_t\): economic strain.

### Media amplification
\[
M_t = \rho_1 \cdot \text{NewsVolume}_t
      + \rho_2 \cdot \text{NegativeSentiment}_t
      + \rho_3 \cdot \text{RiskTopicIntensity}_t
\]

## 3) City-relative normalization
For global comparability, use city-specific robust normalization:

\[
\tilde{x}_{k,t} =
\frac{x_{k,t} - \text{median}(x_{k,city})}
{\text{IQR}(x_{k,city}) + \epsilon}
\]

and optionally convert to bounded percentile scores.

This avoids unfairly penalizing structurally different cities.

## 4) Missing-data-aware aggregation
Let \(m_{k,t} \in \{0,1\}\) denote feature availability.
Then:

\[
Z_t =
\frac{\sum_k m_{k,t} w_k \tilde{x}_{k,t}}
{\sum_k m_{k,t} |w_k| + \epsilon}
\]

This keeps the score comparable when some feeds are unavailable.

## 5) ML-corrected estimator
Let \(f_{\theta}(\mathbf{x}_t)\) be a learned model:

\[
S_{ML,t} = f_{\theta}(\mathbf{x}_t)
\]

Final hybrid:

\[
S_{final,t} = \alpha S_{baseline,t} + (1-\alpha)S_{ML,t}
\]

## 6) Target learning
If training with PSS:
\[
y_i = \text{PSS score for respondent } i
\]

Map city-context features to the respondent's city and time window:
\[
\mathbf{x}_i = \Phi(city_i, t_i)
\]

Learn:
\[
\hat{y}_i = f_{\theta}(\mathbf{x}_i)
\]

## 7) Explainable learned weights
For non-linear models, a single fixed weight is inadequate.
Use:
- global SHAP importance for average weight-like influence,
- local SHAP values for observation-specific contribution,
- grouped SHAP by domain (hazard, traffic, weather, economy, media).

A practical global domain weight can be estimated as:

\[
W^{global}_{domain_j} =
\frac{\mathbb{E}[|\phi_{domain_j}|]}
{\sum_l \mathbb{E}[|\phi_{domain_l}|]}
\]

where \(\phi\) denotes SHAP attribution.
