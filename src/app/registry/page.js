'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SemanticSearchBar from '@/components/SemanticSearchBar';
import styles from './registry.module.css';

export default function RegistryAtlas() {
  const [nodes, setNodes] = useState([]);
  const [displayNodes, setDisplayNodes] = useState([]);
  const [totalNodes, setTotalNodes] = useState(10214);

  // Initial load
  useEffect(() => {
    // For the initial view, we show a random slice of the elite registry
    const mockNodes = Array.from({ length: 12 }, (_, i) => ({
      name: ["Tokyo", "New York", "London", "Istanbul", "Seoul", "Jakarta", "Lagos", "Paris", "Berlin", "Dubai", "Singapore", "Sydney"][i],
      country: ["JP", "US", "GB", "TR", "KR", "ID", "NG", "FR", "DE", "AE", "SG", "AU"][i],
      lat: 0,
      lon: 0,
      similarity: 1.0
    }));
    setNodes(mockNodes);
    setDisplayNodes(mockNodes);
  }, []);

  const handleSemanticResults = (results) => {
    setDisplayNodes(results);
  };

  return (
    <>
      <Header />
      <div className={styles.registryContainer}>
        <header className={styles.atlasHeader}>
          <div className={styles.atlasTitle}>Neural Node Atlas</div>
          <div className={styles.atlasSubtitle}>
            EXPOSING {totalNodes.toLocaleString()} PEER-INDEXED URBAN NEURONS | LATENT SPACE V2.0
          </div>
        </header>

        <SemanticSearchBar onResults={handleSemanticResults} />

        <div className={styles.nodeGrid}>
          {displayNodes.length > 0 ? (
            displayNodes.map((node, i) => (
              <div key={`${node.name}-${i}`} className={styles.nodeCard}>
                <div className={styles.cardTop}>
                  <span className={styles.countryCode}>{node.country}</span>
                  {node.similarity < 1 && (
                    <span className={styles.similarityScore}>
                      CORRELATION: {(node.similarity * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <h3 className={styles.cityName}>{node.name}</h3>
                <div className={styles.nodeStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{(node.lat || 0).toFixed(4)}</span>
                    <span className={styles.statLabel}>LATITUDE</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{(node.lon || 0).toFixed(4)}</span>
                    <span className={styles.statLabel}>LONGITUDE</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>NEURAL</span>
                    <span className={styles.statLabel}>INDEX TYPE</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>ACTIVE</span>
                    <span className={styles.statLabel}>SIGNAL</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>NO NEURAL CONVERGENCE DETECTED FOR THIS QUERY.</p>
              <p style={{ fontSize: '0.7rem' }}>TRY A DIFFERENT SEMANTIC VIBE (E.G. 'HOT REGIONS')</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
