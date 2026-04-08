"use client";

import { useState, useEffect } from 'react';
import styles from './sovereign.module.css';

export default function SovereignCommand() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8011/sovereign/state');
        const data = await res.json();
        setState(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to connect to Sovereign Authority:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.core}><div className={styles.coreInner}></div></div>
        <div className={styles.title}>CONTACTING AUTHORITY...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* The Sovereign Core */}
      <div className={styles.coreContainer}>
        <div className={styles.halo}></div>
        <div className={styles.core}>
          <div className={styles.coreInner}></div>
        </div>
      </div>

      <div className={styles.governanceLevel}>
        <span className={styles.statusIndicator}></span>
        STATUS: {state.governance_level}
      </div>
      <h1 className={styles.title}>SOVEREIGN COMMAND</h1>

      <div className={styles.dashboard}>
        {/* Left Panel: Stats */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>EXECUTIVE METRICS</div>
          <div style={{ marginBottom: '30px' }}>
            <div className={styles.statValue}>{state.influence}</div>
            <div className={styles.statLabel}>INFLUENCE RESERVE</div>
          </div>
          <div>
            <div className={styles.statValue}>{state.total_stablilizations}</div>
            <div className={styles.statLabel}>GLOBAL INTERVENTIONS</div>
          </div>
        </div>

        {/* Center Panel: Active Directives */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>PLANETARY DIRECTIVES [MANDATORY]</div>
          {state.active_directives.length === 0 ? (
            <div style={{ color: '#444', textAlign: 'center', marginTop: '50px' }}>
              RESONANCE STABLE. NO ACTIVE DIRECTIVES.
            </div>
          ) : (
            state.active_directives.map((d) => (
              <div key={d.id} className={styles.directiveCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className={styles.directiveTarget}>{d.target}</span>
                  <span style={{ color: '#00f2ff', fontSize: '10px' }}>{d.type}</span>
                </div>
                <div className={styles.directiveProclamation}>"{d.proclamation}"</div>
                <div className={styles.directiveMeta}>
                  <span>IMPACT: -{(d.impact * 100).toFixed(0)}% Tension</span>
                  <span>{d.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Panel: Sovereignty Log */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>AUTH LOG</div>
          <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.8' }}>
            {state.active_directives.map(d => (
              <div key={`log-${d.id}`}>
                <span style={{ color: '#00f2ff' }}>&gt;</span> Intervention initiated in {d.target}... SUCCESS.
              </div>
            ))}
            <div><span style={{ color: '#00f2ff' }}>&gt;</span> Monitoring urban manifold...</div>
            <div><span style={{ color: '#00f2ff' }}>&gt;</span> Protective persona optimized...</div>
            <div><span style={{ color: '#00f2ff' }}>&gt;</span> Authority level set to MANDATORY.</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '60px', color: '#333', fontSize: '9px', letterSpacing: '2px' }}>
        PLANETARY CORTEX SOVEREIGN ENGINE V20.0 // PROTECTION_PROTOCOL_ENABLED
      </div>
    </div>
  );
}
