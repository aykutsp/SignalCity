'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './simulator.module.css';
import { simulateShock, getTemporalProjection } from '@/lib/sdk/sentient';

export default function SimulatorPage() {
  const [logs, setLogs] = useState([
    { id: 1, text: 'Digital Twin initialized. Universal urban registry loaded (10,214 nodes).', type: 'system' },
    { id: 2, text: 'Awaiting macro-shock parameters for temporal projection...', type: 'info' }
  ]);
  const [shockType, setShockType] = useState('seismic');
  const [intensity, setIntensity] = useState(7.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [projection, setProjection] = useState([]);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    setProjection(getTemporalProjection());
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), text, type }]);
  };

  const handleInject = () => {
    setIsSimulating(true);
    addLog(`INITIATING SHOCK: [${shockType.toUpperCase()}] at INTENSITY [${intensity}]`, 'warning');
    
    setTimeout(() => {
      const result = simulateShock(shockType, [0, 0], intensity);
      addLog(result.analysis, 'success');
      
      result.impacted.forEach(impact => {
        addLog(`CASCADE DETECTED: ${impact.hub} - ${impact.state} (Δ${impact.delta})`, 'danger');
      });

      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className={styles.simulatorContainer}>
      <aside className={styles.terminalPanel}>
        <div className={styles.titleGroup}>
          <h1>Temporal Simulator</h1>
          <p style={{ fontSize: '0.6rem', opacity: 0.5 }}>SHOCK INJECTION INTERFACE v10.0</p>
        </div>

        <div className={styles.controlGroup}>
          <label>Shock Vector</label>
          <select 
            className={styles.inputField} 
            value={shockType}
            onChange={(e) => setShockType(e.target.value)}
          >
            <option value="seismic">Seismic Rupture</option>
            <option value="financial">Financial Market Crash</option>
            <option value="atmospheric">Supercell Ingress</option>
            <option value="social">Social Unrest Loop</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>Magnitude / Intensity ({intensity})</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.1" 
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className={styles.inputField}
          />
        </div>

        <button 
          className={styles.injectButton}
          onClick={handleInject}
          disabled={isSimulating}
        >
          {isSimulating ? 'SIMULATING...' : 'Inject Shock'}
        </button>

        <div className={styles.temporalChart}>
          <p style={{ fontSize: '0.7rem', color: '#8899a6', marginBottom: '0.5rem' }}>7-DAY SHADOW PROJECTION</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '60px', gap: '4px' }}>
            {projection.map((p, i) => (
              <div 
                key={i}
                style={{ 
                  flex: 1, 
                  height: `${p.value}%`, 
                  background: '#00f2ff', 
                  opacity: 0.3 + (i * 0.1),
                  borderRadius: '2px 2px 0 0'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', border: '1px solid rgba(0,242,255,0.2)', fontSize: '0.65rem' }}>
          <strong style={{ color: '#00f2ff' }}>[ACADEMIC PEER REVIEW]</strong><br/>
          Inference Path: Heuristic-Causal-Mapping v10.2<br/>
          Confidence Score: 0.942σ<br/>
          Validation: Historical Synthetic Parallel
        </div>
      </aside>

      <main className={styles.visualizationArea}>
        <div className={styles.mapPlaceholder}>
          {isSimulating && <div className={styles.shockPoint} />}
          <div style={{ textAlign: 'center', opacity: 0.4 }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>PLANETARY DIGITAL TWIN</p>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.2rem' }}>AWAITING SPATIAL TRIGGER</p>
          </div>
        </div>

        <div className={styles.logArea}>
          {logs.map(log => (
            <div key={log.id} className={styles.logLine}>
              <span style={{ color: '#8899a6', marginRight: '0.5rem' }}>[{new Date().toLocaleTimeString()}]</span>
              <span style={{ 
                color: log.type === 'warning' ? '#ff9f43' : 
                       log.type === 'danger' ? '#ee5253' : 
                       log.type === 'success' ? '#10ac84' : '#00f2ff' 
              }}>
                {log.text}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </main>
    </div>
  );
}
