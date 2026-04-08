'use client';

import { useLocation } from '@/context/LocationContext';
import styles from './GlobalPulseMap.module.css';

// Elite Nodes Coordinates for Planetary Pinning
const ELITE_NODES = [
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.0060, tz: "America/New_York" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris" },
  { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, tz: "Europe/Berlin" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney" },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, tz: "Africa/Lagos" },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore" },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
];

const MODE_CONFIG = {
  stress: { title: "Planetary Stress Pulse", subtitle: "Monitoring 10,214 Distributed Elite Nodes", color: "#06d6a0", label: "HCSI v4.0 Index" },
  seismic: { title: "Global Seismic Watch", subtitle: "Real-time Planetary Tectonic Sensors", color: "#ff6b35", label: "Seismic Intensity" },
  fx: { title: "Currency Liquidity Map", subtitle: "Planetary Fiscal Settlement Intelligence", color: "#ffd166", label: "Liquidity Pulse" },
  weather: { title: "Atmospheric Load Matrix", subtitle: "Autonomous Environmental Heuristics", color: "#118ab2", label: "Climatic Load" },
};

export default function GlobalPulseMap({ mode = 'stress' }) {
  const { changeCity, activeCity } = useLocation();
  const config = MODE_CONFIG[mode] || MODE_CONFIG.stress;

  // Project lat/lon to SVG 800x400 space
  const project = (lat, lon) => {
    const x = (lon + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  return (
    <div className={`glass ${styles.mapContainer} ${styles[mode]}`}>
      <div className={styles.mapHeader}>
        <div className={styles.headerLeft}>
          <h3 className={styles.mapTitle}>{config.title}</h3>
          <p className={styles.mapSubtitle}>{config.subtitle}</p>
        </div>
        <div className={styles.stats}>
          <span className={styles.statLabel}>{config.label}:</span>
          <span className={styles.statValue} style={{ color: config.color }}>Active</span>
        </div>
      </div>

      <div className={styles.svgWrapper}>
        <svg viewBox="0 0 800 400" className={styles.mapSvg}>
          <rect width="800" height="400" fill="rgba(255,255,255,0.02)" rx="10" />
          
          {/* Decorative Grid Lines */}
          {[...Array(8)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" stroke="rgba(255,255,255,0.03)" />
          ))}

          {/* Elite Node Pins */}
          {ELITE_NODES.map(node => {
            const { x, y } = project(node.lat, node.lon);
            const isActive = activeCity.name === node.name;
            
            return (
              <g 
                key={node.name} 
                className={styles.pin} 
                onClick={() => changeCity({ ...node, timezone: node.tz })}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={x} cy={y} r="6" className={styles.pulseRing} style={{ stroke: config.color }} />
                <circle 
                  cx={x} cy={y} 
                  r={isActive ? "5" : "3"} 
                  fill={isActive ? config.color : "rgba(255,255,255,0.4)"} 
                  className={styles.pinPoint}
                />
                
                <text 
                  x={x} y={y - 12} 
                  textAnchor="middle" 
                  className={styles.pinLabel}
                  fill={isActive ? "#f8fafc" : "#94a3b8"}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.mapFooter}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: config.color, boxShadow: `0 0 10px ${config.color}` }} /> {mode.toUpperCase()} High-Priority
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.gray}`} /> Registry Sensor Node
          </div>
        </div>
      </div>
    </div>
  );
}
