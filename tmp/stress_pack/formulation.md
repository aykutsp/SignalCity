# Mathematical Model

Let:

HCSI(t) = σ( Σ w_i * X_i(t) ) * 100

Where:

X_i(t) includes:

- E(t): Earthquake intensity
- N(t): News sentiment intensity
- T(t): Traffic congestion index
- W(t): Weather stress index
- F(t): Financial volatility

Expanded:

HCSI(t) = σ(
    w1*E(t) +
    w2*N(t) +
    w3*T(t) +
    w4*W(t) +
    w5*F(t)
)

Event decay:

E(t) = E0 * exp(-λt)

Media amplification:

N(t) = α * frequency * sentiment_score

σ(x) = 1 / (1 + e^-x)
