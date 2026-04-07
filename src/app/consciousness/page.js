'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import { computeHeartbeat, detectCausalChains, generateNeuralLog, getHeartbeatHistory } from '@/lib/sdk/sentient';
import styles from './consciousness.module.css';

const MAX_LOGS = 30;
const MAX_CHAINS = 8;

export default function ConsciousnessPage() {
  const [heartbeat, setHeartbeat] = useState(null);
  const [logs, setLogs] = useState([]);
  const [chains, setChains] = useState([]);
  const [history, setHistory] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    // Initial state
    setHeartbeat(computeHeartbeat());
    setHistory(getHeartbeatHistory(60));
    setLogs([generateNeuralLog(), generateNeuralLog(), generateNeuralLog()]);

    // Heartbeat pulse: every 2 seconds
    const heartbeatTimer = setInterval(() => {
      setHeartbeat(computeHeartbeat());
      setHistory(prev => {
        const next = [...prev.slice(1), { time: 0, value: computeHeartbeat().score }];
        return next.map((p, i) => ({ ...p, time: i }));
      });
    }, 2000);

    // Neural log: every 4 seconds
    const logTimer = setInterval(() => {
      setLogs(prev => [generateNeuralLog(), ...prev].slice(0, MAX_LOGS));
    }, 4000);

    // Causal chain scan: every 8 seconds
    const chainTimer = setInterval(() => {
      const detected = detectCausalChains();
      if (detected.length > 0) {
        setChains(prev => [...detected, ...prev].slice(0, MAX_CHAINS));
      }
    }, 8000);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(logTimer);
      clearInterval(chainTimer);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [logs]);

  const hb = heartbeat || { score: 0, phase: 'DORMANT', domains: [] };
  const pulseScale = 0.8 + (hb.score / 100) * 0.6;
  const pulseColor = hb.score > 65 ? '#ef476f' : hb.score > 45 ? '#ffd166' : '#06d6a0';
  const pulseSpeed = Math.max(0.5, 2.5 - (hb.score / 50));

  // SVG heartbeat history
  const historyPoints = history.map((p, i) =>
    `${(i / Math.max(history.length - 1, 1)) * 100},${100 - p.value}`
  ).join(' ');

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.gridBg} />

        {/* Heartbeat Core */}
        <div className={styles.heartbeatSection}>
          <div className={styles.heartbeatOrb}
            style={{
              '--pulse-color': pulseColor,
              '--pulse-speed': `${pulseSpeed}s`,
              '--pulse-scale': pulseScale,
            }}
          >
            <div className={styles.orbInner}>
              <span className={styles.orbScore}>{hb.score}</span>
              <span className={styles.orbLabel}>PLANETARY PULSE</span>
            </div>
            <div className={styles.orbRing} />
            <div className={styles.orbRing2} />
          </div>

          <div className={styles.phaseInfo}>
            <span className={styles.phaseBadge} style={{ borderColor: pulseColor, color: pulseColor }}>
              {hb.phase}
            </span>
            <p className={styles.phaseDesc}>
              {hb.phase === 'ELEVATED' && 'Multiple cross-domain correlations active. Causal chains propagating.'}
              {hb.phase === 'ACTIVE' && 'Standard planetary monitoring cycle. All cognitive vectors aligned.'}
              {hb.phase === 'DORMANT' && 'Minimal global activity. Heuristic kernel in low-power mode.'}
            </p>
          </div>
        </div>

        {/* Domain Breakdown & History */}
        <div className={styles.midGrid}>
          <div className={`glass ${styles.domainCard}`}>
            <h3 className={styles.cardTitle}>Domain Vectors</h3>
            <div className={styles.domainBars}>
              {hb.domains.map(d => (
                <div key={d.domain} className={styles.domainRow}>
                  <span className={styles.domainName}>{d.domain}</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{
                      width: `${d.reading}%`,
                      background: d.reading > 65 ? '#ef476f' : d.reading > 45 ? '#ffd166' : '#06d6a0'
                    }} />
                  </div>
                  <span className={styles.domainVal}>{d.reading}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`glass ${styles.historyCard}`}>
            <h3 className={styles.cardTitle}>Heartbeat Trajectory</h3>
            <svg viewBox="0 0 100 100" className={styles.historySvg} preserveAspectRatio="none">
              <defs>
                <linearGradient id="hbGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={pulseColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={pulseColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#hbGrad)"
                points={`0,100 ${historyPoints} 100,100`}
              />
              <polyline
                fill="none"
                stroke={pulseColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={historyPoints}
              />
            </svg>
          </div>
        </div>

        {/* Bottom: Neural Log + Causal Chains */}
        <div className={styles.bottomGrid}>
          <div className={`glass ${styles.neuralCard}`}>
            <h3 className={styles.cardTitle}>
              <span className="live-dot" /> Neural Log Stream
            </h3>
            <div className={styles.logScroll} ref={logRef}>
              {logs.map(log => (
                <div key={log.id} className={styles.logEntry}>
                  <span className={styles.logTime}>
                    {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={styles.logMsg}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`glass ${styles.chainsCard}`}>
            <h3 className={styles.cardTitle}>Causal Chain Alerts</h3>
            <div className={styles.chainScroll}>
              {chains.length === 0 ? (
                <p className={styles.noChains}>No active causal chains. Scanning...</p>
              ) : (
                chains.map(chain => (
                  <div key={chain.id} className={`${styles.chainItem} ${styles[chain.severity.toLowerCase()]}`}>
                    <div className={styles.chainTop}>
                      <span className={styles.chainType}>{chain.type}</span>
                      <span className={`${styles.chainSev} ${styles[chain.severity.toLowerCase()]}`}>
                        {chain.severity}
                      </span>
                    </div>
                    <p className={styles.chainMsg}>{chain.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
