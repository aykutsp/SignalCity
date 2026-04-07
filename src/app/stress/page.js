'use client';

import { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import styles from './stress.module.css';

export default function StressPage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState({
    stress: null,
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

  const { stress, loading } = data;
  const factorColors = ['#ef476f', '#ff6b35', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'];

  const gaugeData = stress ? [
    { name: 'Score', value: stress.score, fill: stress.level.color },
  ] : [];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>💠 Pulse Stress</h1>
            <p className={styles.subtitle}>{activeCity.name} — Ambient Social & Environmental Pressure</p>
          </div>
          <ApiLibraryButton section="stress" />
        </div>

        {loading ? (
          <div className="skeleton-line" style={{ height: 400, borderRadius: 20 }} />
        ) : stress ? (
          <>
            {/* Score display */}
            <div className={styles.scoreSection}>
              <div className={`glass ${styles.gaugeCard}`}>
                <div className={styles.gaugeWrapper}>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="70%" outerRadius="90%"
                      startAngle={180} endAngle={0}
                      data={[{ value: 100, fill: 'rgba(255,255,255,0.03)' }, ...gaugeData]}
                      barSize={20}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className={styles.gaugeOverlay}>
                    <span className={styles.gaugeScore} style={{ color: stress.level.color }}>{stress.score}</span>
                    <span className={styles.gaugeLabel} style={{ color: stress.level.color }}>{stress.level.label}</span>
                  </div>
                </div>
                <p className={styles.gaugeDesc}>
                  Synthesized pressure index mapping environmental atmospheric signals and real-time social sentiment data.
                </p>
              </div>

              <div className={`glass ${styles.infoCard}`}>
                <h3 className={styles.infoTitle}>Algorithm Pulse</h3>
                <p className={styles.infoText}>
                  The Stress Score calculates deviations from baseline norms. Environmental signals (75%) are combined with live 
                  social/news sentiment (25%) to provide a holistic view of the urban 'tension'.
                </p>
                <div className={styles.scaleRow}>
                  {[
                    { label: 'Calm', color: '#06d6a0', range: '0-20' },
                    { label: 'Mild', color: '#118ab2', range: '21-40' },
                    { label: 'Active', color: '#ffd166', range: '41-60' },
                    { label: 'High', color: '#ff6b35', range: '61-80' },
                    { label: 'Extreme', color: '#ef476f', range: '81-100' },
                  ].map(s => (
                    <div key={s.label} className={styles.scaleItem}>
                      <div className={styles.scaleBar} style={{ background: s.color }} />
                      <span className={styles.scaleLabel}>{s.label}</span>
                      <span className={styles.scaleRange}>{s.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Factor breakdown */}
            <div className={`glass ${styles.chartCard}`}>
              <h2 className={styles.chartTitle}>Contribution Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stress.factors} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" domain={[0, 25]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 13 }} width={120} />
                  <Tooltip
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value, name, props) => [`${value} pts (${props.payload.raw})`, 'Impact']}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                    {stress.factors.map((f, i) => (
                      <Cell key={i} fill={factorColors[i % factorColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Factor detail grid */}
            <div className={styles.rawGrid}>
              {stress.factors.map((f, i) => (
                <div key={f.name} className={`glass ${styles.rawCard}`}>
                  <span className={styles.rawName}>{f.name}</span>
                  <span className={styles.rawValue} style={{ color: factorColors[i % factorColors.length] }}>{f.raw}</span>
                  <div className={styles.rawBar}>
                    <div className={styles.rawFill} style={{ width: `${(f.value / f.max) * 100}%`, background: factorColors[i % factorColors.length] }} />
                  </div>
                  <span className={styles.rawPts}>{f.value} / {f.max} pts</span>
                </div>
              ))}
            </div>

            <p className={styles.disclaimer}>
              Score computed via Pulse SDK v{sdk.version}. Analysis is algorithmic and strictly academic.
            </p>
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Calculation unavailable for this region.</p>
        )}
      </main>
    </>
  );
}
