'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import GlobalPulseMap from '@/components/GlobalPulseMap';
import styles from './quake.module.css';

export default function QuakePage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    async function load() {
      setLoading(true);
      try {
        const res = await sdk.getQuakes(activeCity.lat, activeCity.lon, 1500); // 1500km radius
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCity, isHydrated]);

  if (!isHydrated) return null;

  const quakes = data?.features || [];
  const chartData = quakes.slice(0, 20).map(q => ({
    place: q.properties.place?.split(', ').pop() || 'Unknown',
    mag: q.properties.mag,
    depth: q.geometry.coordinates[2],
  })).reverse();

  const magDistribution = [
    { range: '2.0-3.0', count: quakes.filter(q => q.properties.mag >= 2.0 && q.properties.mag < 3).length },
    { range: '3.0-4.0', count: quakes.filter(q => q.properties.mag >= 3 && q.properties.mag < 4).length },
    { range: '4.0-5.0', count: quakes.filter(q => q.properties.mag >= 4 && q.properties.mag < 5).length },
    { range: '5.0-6.0', count: quakes.filter(q => q.properties.mag >= 5 && q.properties.mag < 6).length },
    { range: '6.0+', count: quakes.filter(q => q.properties.mag >= 6).length },
  ];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>🌍 Pulse Quake</h1>
            <p className={styles.subtitle}>Regional Seismic Monitor — 1500km radius around {activeCity.name}</p>
          </div>
          <ApiLibraryButton section="quake" />
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.skeletonStats}>
              {[1, 2, 3].map(i => <div key={i} className="pulse-skeleton" style={{ height: 120, borderRadius: 16 }} />)}
            </div>
            <div className={styles.skeletonCharts}>
              {[1, 2].map(i => <div key={i} className="pulse-skeleton" style={{ height: 300, borderRadius: 20 }} />)}
            </div>
            <div className="pulse-skeleton" style={{ height: 400, borderRadius: 24 }} />
          </div>
        ) : (
          <>
            <GlobalPulseMap mode="seismic" />
            {/* Stats row */}
            <div className={styles.statsRow}>
              <div className={`glass ${styles.statCard}`}>
                <span className={styles.statValue}>{quakes.length}</span>
                <span className={styles.statLabel}>Local Events</span>
              </div>
              <div className={`glass ${styles.statCard}`}>
                <span className={styles.statValue} style={{ color: quakes.length > 0 ? sdk.utils.getMagnitudeColor(Math.max(...quakes.map(q => q.properties.mag))) : '#fff' }}>
                  {quakes.length > 0 ? `M${Math.max(...quakes.map(q => q.properties.mag)).toFixed(1)}` : 'N/A'}
                </span>
                <span className={styles.statLabel}>Local High</span>
              </div>
              <div className={`glass ${styles.statCard}`}>
                <span className={styles.statValue}>
                  {quakes.length > 0 ? (quakes.reduce((s, q) => s + q.properties.mag, 0) / quakes.length).toFixed(1) : '0'}
                </span>
                <span className={styles.statLabel}>Avg Magnitude</span>
              </div>
            </div>

            {quakes.length === 0 ? (
              <div className={`glass ${styles.emptyState}`}>
                <h3>All Clear</h3>
                <p>No seismic activity found within 1500km of {activeCity.name} in the last 24 hours.</p>
              </div>
            ) : (
              <>
                <div className={styles.chartsRow}>
                  {/* Magnitude Distribution Chart */}
                  <div className={`glass ${styles.chartCard}`}>
                    <h2 className={styles.chartTitle}>Magnitude Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={magDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {magDistribution.map((entry, i) => (
                            <Cell key={i} fill={['#118ab2', '#06d6a0', '#ffd166', '#ff6b35', '#ef476f'][i]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Depth Chart */}
                  <div className={`glass ${styles.chartCard}`}>
                    <h2 className={styles.chartTitle}>Recent Event Depth (km)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="place" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                              <Tooltip 
                          contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} 
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="depth" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Event list */}
                <div className={`glass ${styles.eventList}`}>
                  <h2 className={styles.chartTitle}>Activity Feed</h2>
                  {quakes.slice(0, 30).map(q => (
                    <div key={q.id} className={styles.eventRow}>
                      <span className={styles.eventMag} style={{ color: sdk.utils.getMagnitudeColor(q.properties.mag), background: `${sdk.utils.getMagnitudeColor(q.properties.mag)}15` }}>
                        M{q.properties.mag.toFixed(1)}
                      </span>
                      <span className={styles.eventBadge} style={{ color: sdk.utils.getMagnitudeColor(q.properties.mag) }}>{sdk.utils.getMagnitudeLabel(q.properties.mag)}</span>
                      <span className={styles.eventPlace}>{q.properties.place}</span>
                      <span className={styles.eventTime}>{sdk.utils.formatQuakeTime(q.properties.time, activeCity.timezone)}</span>
                      <span className={styles.eventDepth}>{q.geometry.coordinates[2].toFixed(1)} km deep</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
