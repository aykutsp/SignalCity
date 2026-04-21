'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getShadowForecasts } from '@/lib/sdk/sentient';
import styles from './oracle.module.css';

export default function OraclePage() {
  const [forecasts, setForecasts] = useState([]);
  const [convergence, setConvergence] = useState(0.84);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());

  useEffect(() => {
    setForecasts(getShadowForecasts(6));

    const interval = setInterval(() => {
      setForecasts(getShadowForecasts(6));
      setConvergence(0.8 + Math.random() * 0.15);
      setLastUpdate(new Date().toISOString());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <div className={styles.oracleContainer}>
        <header className={styles.oracleHeader}>
          <div className={styles.oracleTitle}>
            <p style={{ fontSize: '0.6rem', color: '#00f2ff', opacity: 0.6 }}>AUTONOMOUS FUTURE PROJECTION</p>
            <h1>Oracle Terminal</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#8899a6' }}>CONVERGENCE PROBABILITY:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00f2ff', marginLeft: '0.5rem' }}>
              {(convergence * 100).toFixed(1)}%
            </span>
          </div>
        </header>

        <div className={styles.mainGrid}>
          <section className={styles.forecastZone}>
            {forecasts.map(f => (
              <div key={f.id} className={styles.predictionCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.typeLabel}>{f.type}</span>
                  <span className={styles.probBadge}>{f.probability}% CONFIDENCE</span>
                </div>
                <h3 className={styles.cityTitle}>{f.location}</h3>
                <p className={styles.predictionText}>{f.prediction}</p>
                <div className={styles.horizonTag}>
                  TEMPORAL HORIZON: T+{f.horizon} HOURS
                </div>
                {/* Visual ripple effect for critical predictions */}
                {f.probability > 85 && (
                  <div style={{
                    position: 'absolute', right: '-20px', top: '-20px', 
                    width: '100px', height: '100px', 
                    background: 'rgba(0, 242, 255, 0.05)', 
                    borderRadius: '50%',
                    border: '1px solid rgba(0, 242, 255, 0.2)',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </div>
            ))}
          </section>

          <aside className={styles.statsPane}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>V3.9.2</div>
              <div className={styles.statLabel}>PREDICTIVE KERNEL</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>12,412</div>
              <div className={styles.statLabel}>SENSORY DIMENSIONS</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>2.4 ms</div>
              <div className={styles.statLabel}>INFERENCE LATENCY</div>
            </div>

            <div className={styles.timelineVisual}>
              <p style={{ fontSize: '0.6rem', color: '#8899a6', textTransform: 'uppercase' }}>Latent Space Convergence</p>
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.orbitingDot} style={{ animationDuration: '3s' }} />
                <div className={styles.orbitingDot} style={{ animationDuration: '5s', width: '6px', height: '6px' }} />
                <div style={{ width: '20px', height: '20px', border: '1px solid #00f2ff', borderRadius: '50%', opacity: 0.5 }} />
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.6rem', color: '#8899a6' }}>LAST ORACLE SYNC:</p>
              <p style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono', color: '#00f2ff' }}>{lastUpdate}</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
