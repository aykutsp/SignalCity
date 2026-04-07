'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import sdk from '@/lib/sdk';
import styles from './intelligence.module.css';

export default function IntelligencePage() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    setSources(sdk.getSources());
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.statusBadge}>
              <span className="live-dot" /> 
              TRUST PROTOCOL: ACTIVE
            </div>
            <h1 className={styles.title}>Intelligence Transparency</h1>
            <p className={styles.subtitle}>Formal Reading Methodologies & Institutional Telemetry v8.0</p>
          </div>
        </div>

        <div className={styles.sourceGrid}>
          {sources.map((source) => (
            <div key={source.id} className={`glass ${styles.sourceCard}`}>
              <div className={styles.cardTop}>
                <span className={styles.category}>{source.category}</span>
                <span className={`${styles.priority} ${styles[source.priority.toLowerCase()]}`}>
                  {source.priority}
                </span>
              </div>
              
              <h3 className={styles.sourceName}>{source.name}</h3>
              <p className={styles.description}>{source.description}</p>
              
              <div className={styles.methodologyBlock}>
                <span className={styles.methodLabel}>Reading Methodology:</span>
                <p className={styles.methodText}>{source.methodology}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.endpoint}>{source.endpoint}</span>
                {source.polling_ms && (
                  <span className={styles.refresh}>
                    ↻ {source.polling_ms / 1000}s
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <section className={`glass ${styles.registryDisclosure}`}>
          <div className={styles.disclosureContent}>
            <h2 className={styles.disclosureTitle}>Planetary Node Registry Disclosure</h2>
            <p className={styles.disclosureText}>
              SignalCity utilizes a stratified <strong>10,214-node registry</strong> for primary urban monitoring. 
              Settlements outside this elite registry (118,198 locations) are monitored via the <strong>Autonomous Heuristic v4.2</strong> kernel, 
              which interpolates atmospheric and seismic baselines using <strong>Coordinate-Aware Baseline Interpolation</strong>.
            </p>
          </div>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>10,214</span>
              <span className={styles.statLab}>Elite Hubs</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>128,412</span>
              <span className={styles.statLab}>Total Settlements</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
