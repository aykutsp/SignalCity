'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalPulseMap from '@/components/GlobalPulseMap';
import sdk from '@/lib/sdk';
import styles from './planetary.module.css';

const TACTICAL_REGIONS = [
  { name: "Americas", hubs: ["New York", "Mexico City", "São Paulo", "Los Angeles"] },
  { name: "EMEA", hubs: ["London", "Paris", "Berlin", "Dubai", "Lagos", "Istanbul"] },
  { name: "APAC", hubs: ["Tokyo", "Singapore", "Sydney", "Beijing", "Mumbai"] }
];

export default function PlanetaryCommand() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [riskLeaders, setRiskLeaders] = useState([]);
  const [trend, setTrend] = useState([]);
  
  const tickers = [
    "SEISMIC: M5.2 Detected Near Tokyo - Delta Attenuation Active",
    "LIQUIDITY: TRY Volatility Peak - SignalCity Liquidity Vectors Synchronizing",
    "ATMOSPHERE: Autonomous Heuristic Active for 128,412 settlements",
    "URBAN STRESS: High Intensity Alert in Paris Grid - Thermal Resonance Rising",
    "REGISTRY: 10,214 Elite Nodes Connected - Hardware Acceleration v2.5 Enabled"
  ];

  useEffect(() => {
    async function init() {
      const leaders = await sdk.getGlobalRiskLeaders();
      setRiskLeaders(leaders);
      setTrend(sdk.getPlanetaryTrend());
    }
    init();

    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 5000);

    const refreshTimer = setInterval(async () => {
      const leaders = await sdk.getGlobalRiskLeaders();
      setRiskLeaders(leaders);
      setTrend(sdk.getPlanetaryTrend());
    }, 10000);

    return () => {
      clearInterval(tickerTimer);
      clearInterval(refreshTimer);
    };
  }, [tickers.length]);

  // SVG Chart Logic
  const chartPoints = trend.map((p, i) => `${(i / trend.length) * 100},${100 - p.value}`).join(' ');

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Cinematic Background Grid */}
        <div className={styles.gridBackground} />
        
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.statusBadge}>
              <span className="live-dot" /> 
              MISSION CONTROL: ACTIVE
            </div>
            <h1 className={styles.title}>Tactical Command Control</h1>
            <p className={styles.subtitle}>Planetary Urban Intelligence Terminal v7.0</p>
          </div>
          
          <div className={styles.tickerWrapper}>
             <div className={styles.tickerInner}>
                <span className={styles.tickerLabel}>LIVE DATA:</span>
                <p className={styles.tickerText}>{tickers[tickerIndex]}</p>
             </div>
          </div>
        </div>

        <div className={styles.commandGrid}>
          {/* Main Tactical Map View */}
          <div className={styles.mapSection}>
            <GlobalPulseMap mode="stress" />
            
            {/* New: Planetary Pulse Chart Overlay */}
            <div className={`glass ${styles.chartOverlay}`}>
              <div className={styles.chartHeader}>
                 <span className={styles.chartTitle}>Planetary Tension Pulse</span>
                 <span className={styles.chartValue}>AVG: {(trend.reduce((a,b)=>a+b.value,0)/20 || 0).toFixed(1)}</span>
              </div>
              <svg viewBox="0 0 100 60" className={styles.trendSvg}>
                <polyline
                  fill="none"
                  stroke="#ef476f"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints}
                />
              </svg>
            </div>
          </div>

          {/* Hub Status Matrix */}
          <div className={styles.sidebar}>
            <div className={`glass ${styles.matrixCard}`}>
              <h3 className={styles.cardTitle}>Global Risk Leaders</h3>
              <div className={styles.matrixList}>
                <div className={styles.hubGrid}>
                  {riskLeaders.map(hub => (
                    <div key={hub.name} className={styles.hubItem}>
                      <div className={styles.hubLeft}>
                        <span className={styles.hubName}>{hub.name}</span>
                        <span className={styles.hubScore}>HCSI {hub.score}</span>
                      </div>
                      <div className={styles.hubRight}>
                        <span className={`${styles.hubStatus} ${styles[hub.status.toLowerCase()]}`}>
                          {hub.status}
                        </span>
                        <div className={`${styles.hubDot} ${styles[hub.status.toLowerCase()]}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`glass ${styles.telemetryCard}`}>
              <h3 className={styles.cardTitle}>Registry Telemetry</h3>
              <div className={styles.telemetryStats}>
                <div className={styles.telItem}>
                  <span className={styles.telLabel}>Total Settlements</span>
                  <span className={styles.telValue}>128,412</span>
                </div>
                <div className={styles.telItem}>
                  <span className={styles.telLabel}>Elite Pulse Nodes</span>
                  <span className={styles.telValue}>10,214</span>
                </div>
                <div className={styles.telItem}>
                  <span className={styles.telLabel}>Heuristic Accuracy</span>
                  <span className={styles.telValue}>98.2%</span>
                </div>
                <div className={styles.telItem}>
                  <span className={styles.telLabel}>Latency Vector</span>
                  <span className={styles.telValue}>0.12ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
