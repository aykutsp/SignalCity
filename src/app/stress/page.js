'use client';

import { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import GlobalPulseMap from '@/components/GlobalPulseMap';
import styles from './stress.module.css';

export default function StressPage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState({
    stress: null,
    forecast: [],
    loading: true
  });

  useEffect(() => {
    if (!isHydrated) return;
    async function load() {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const pulse = await sdk.getCityPulse(activeCity);
        setData({
          stress: pulse.stress,
          forecast: pulse.forecast,
          loading: false
        });
      } catch (e) {
        console.error(e);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    load();
  }, [activeCity, isHydrated]);

  if (!isHydrated) return null;

  const { stress, forecast, loading } = data;
  const factorColors = ['#ef476f', '#ff6b35', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'];

  const gaugeData = stress ? [
    { name: 'Score', value: stress.score, fill: stress.level.color },
  ] : [];

  // Find Peak Stress in forecast
  const peakStress = forecast?.length > 0 ? [...forecast].sort((a,b) => b.score - a.score)[0] : null;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>💠 Predictive Stress</h1>
            <p className={styles.subtitle}>{activeCity.name} — Anticipatory Urban Analytics</p>
          </div>
          <ApiLibraryButton section="stress" />
        </div>

        {loading ? (
          <div className="skeleton-line" style={{ height: 400, borderRadius: 20 }} />
        ) : stress ? (
          <>
            <GlobalPulseMap />
            {/* Top Stats */}
            <div className={styles.scoreSection}>
              <div className={`glass ${styles.gaugeCard}`}>
                <div className={styles.gaugeWrapper}>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="70%" outerRadius="90%"
                      data={[{ value: 100, fill: 'rgba(255,255,255,0.03)' }, ...gaugeData]}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className={styles.gaugeOverlay}>
                    <span className={styles.gaugeScore} style={{ color: stress.level.color }}>{stress.score}</span>
                    <span className={styles.gaugeLabel} style={{ color: stress.level.color }}>{stress.level.label}</span>
                  </div>
                </div>
                <div className={styles.calibrationBadge}>
                  <span className={styles.badgePulse} />
                  {stress.metadata.calibration}
                </div>
                <p className={styles.gaugeDesc}>
                  <strong>HCSI v4.0:</strong> Predictive urban analytics utilizing thermal resonance and longitudinal infrastructure cycles.
                </p>
              </div>

              <div className={`glass ${styles.infoCard}`}>
                <h3 className={styles.infoTitle}>Predictive Alert Center</h3>
                {peakStress && (
                  <div className={styles.peakAlert}>
                    <div className={styles.alertIcon} style={{ background: sdk.utils.getMagnitudeColor(peakStress.score / 10) }}>⚡</div>
                    <div className={styles.alertMeta}>
                      <span className={styles.alertLabel}>Anticipated Peak Stress</span>
                      <span className={styles.alertValue}>{peakStress.score} Index @ {new Date(peakStress.time).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                      <span className={styles.alertDesc}>Expected cumulative load from thermal peaks and transit cycles.</span>
                    </div>
                  </div>
                )}
                <div className={styles.scaleRow}>
                  {[
                    { label: 'Optimal', color: '#06d6a0', range: '0-20' },
                    { label: 'Stable', color: '#118ab2', range: '21-40' },
                    { label: 'Strained', color: '#ffd166', range: '41-60' },
                    { label: 'High', color: '#ff6b35', range: '61-80' },
                    { label: 'Critical', color: '#ef476f', range: '81-100' },
                  ].map(s => (
                    <div key={s.label} className={styles.scaleItem}>
                      <div className={styles.scaleBar} style={{ background: s.color }} />
                      <span className={styles.scaleLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 48h Forecast Chart */}
            <div className={`glass ${styles.forecastCard}`}>
              <h2 className={styles.chartTitle}>48h Urban Pressure Trajectory</h2>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={forecast}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stress.level.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={stress.level.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(t) => new Date(t).getHours() + ":00"} 
                      interval={4}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip
                      contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                      labelFormatter={(t) => new Date(t).toLocaleString()}
                      formatter={(val) => [`${val} Index`, 'Predicted Stress']}
                    />
                    <Area type="monotone" dataKey="score" stroke={stress.level.color} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Factor breakdown */}
            <div className={`glass ${styles.chartCard}`}>
              <h2 className={styles.chartTitle}>Current Load Matrix</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stress.factors} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 13 }} width={140} />
                  <Tooltip
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    formatter={(value) => [`${value}/100 Intensity`, 'Signal Load']}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                    {stress.factors.map((f, i) => (
                      <Cell key={i} fill={factorColors[i % factorColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className={styles.disclaimer}>
              SignalCity Predictive analytics Engine. HCSI v4.0 Methodology.
            </p>
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Calculation unavailable for this region.</p>
        )}
      </main>
    </>
  );
}
