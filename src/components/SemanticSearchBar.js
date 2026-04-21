'use client';

import React, { useState } from 'react';
import sdk from '@/lib/sdk';
import styles from './SemanticSearchBar.module.css';

export default function SemanticSearchBar({ onResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await sdk.searchNeuralLattice(query, 15);
      onResults(results);
    } catch (err) {
      console.error("Semantic search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <div className={styles.aiIcon}>◈</div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Neural Lattice by vibe (e.g., 'Cold risk hubs in EMEA')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton} disabled={loading}>
            {loading ? 'ANALYZING...' : 'QUERY LATTICE'}
          </button>
        </div>
      </form>
    </div>
  );
}
