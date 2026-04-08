'use client';

import React from 'react';
import styles from './papers.module.css';
import Link from 'next/link';

export default function PapersPage() {
  const bibtex = `@article{signalcity2026,
  title={Sentient Urban Intelligence: A Cross-Domain Causal Framework for Planetary Risk Observation},
  author={SignalCity Institutional Research},
  journal={Planetary Urban Intelligence Journal},
  volume={10},
  number={4},
  pages={10214--128412},
  year={2026},
  publisher={SignalCity Open Foundation}
}`;

  return (
    <div className={styles.papersContainer}>
      <Link href="/" className={styles.navBack}>← TERMINAL BACKPLANE</Link>
      
      <article className={styles.paperWrapper}>
        <header className={styles.institutionalHeader}>
          <p>Institutional Document: SC-WP-2026-09</p>
          <h1>Sentient Urban Intelligence: A Cross-Domain Causal Framework</h1>
          <p>SignalCity Research Group • Planetary Defense Division</p>
        </header>

        <section>
          <span className={styles.abstractTitle}>Abstract</span>
          <p className={styles.abstractContent}>
            This paper introduces the Heuristic-Causal Stress Index (HCSI), a multi-vector intelligence framework designed to quantify planetary tension across 10,214 elite urban nodes. By correlating seismic resonance, atmospheric pressure gradients, financial liquidity volatility, and social sentiment loops, we establish a SENTIENT kernel capable of predicting high-order risk cascades before they manifest as systemic shocks.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>1. The Global Heartbeat Equation</h2>
          <p>
            The aggregate Planetary Pulse ($P_t$) is defined as the normalized average of discrete urban stress vectors, weighted by the specific gravity of the regional node:
          </p>
          <div className={styles.formulaBox}>
             P(t) = Σ [ (α·S + β·A + γ·F + δ·U) / log(N) ] · e^(-λΔt)
          </div>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
            Where S = Seismic Resonance, A = Atmospheric Gradient, F = Financial Delta-V, U = Urban Social Pulse, and λ represents the systemic entropy coefficient.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>2. Causal Resonance Mapping</h2>
          <p>
            To detect cross-domain ripples, we employ a non-linear Pearson correlation applied to asynchronous telemetry streams. A 'Causal Chain' is identified when the covariance exceeds the 0.85σ threshold:
          </p>
          <div className={styles.formulaBox}>
            Cov(X,Y) = E[XY] - E[X]E[Y]
          </div>
          <p>
            When a seismic event in epicentre 'A' induces a financial liquidity drop in node 'B' within the temporal window ω, the system triggers a Cognitive Alert.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>3. Methodological Rigor</h2>
          <ul>
            <li><strong>Telemetry Inversion:</strong> Atmospheric sensing via thermal inversion modeling.</li>
            <li><strong>Synthetic Scaling:</strong> Bi-linear interpolation across 118,000+ settlements.</li>
            <li><strong>Inference Kernel:</strong> Bayesian probability distribution for risk forecasting.</li>
          </ul>
        </section>

        <section className={styles.citationArea}>
          <h2 className={styles.sectionTitle}>Citing this Work</h2>
          <p>To integrate these findings into your institutional research, please use the following BibTeX record:</p>
          <div className={styles.citationBox}>
            <pre style={{ margin: 0 }}>{bibtex}</pre>
            <span className={styles.copyLabel} onClick={() => navigator.clipboard.writeText(bibtex)}>COPY BIBTEX</span>
          </div>
        </section>
      </article>
      
      <footer style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.3, fontSize: '0.8rem' }}>
        © 2026 SignalCity Institutional Research. All rights reserved. Registered under MIT Open Science License.
      </footer>
    </div>
  );
}
