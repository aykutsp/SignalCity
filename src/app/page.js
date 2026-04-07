'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PulseCard from '@/components/PulseCard';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import styles from './page.module.css';

export default function DashboardPage() {
  const { activeCity } = useLocation();
  const [data, setData] = useState({
    weather: null,
    quakes: null,
    rates: null,
    stress: null,
    loading: true
  });

  useEffect(() => {
    async function load() {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const pulse = await sdk.getCityPulse(activeCity);
        setData({
          ...pulse,
          loading: false
        });
      } catch (e) {
        console.error(e);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    load();
  }, [activeCity]);

  const { weather, quakes, rates, stress, loading } = data;
  const current = weather?.current;
  const recentQuakes = quakes?.features?.slice(0, 5) || [];
  const topRates = rates
    ? Object.entries(rates.rates).slice(0, 6).map(([k, v]) => ({ currency: k, rate: v }))
    : [];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className={styles.heroTitle}>
                  Live City Intelligence
                  <span className={styles.heroSub}>{activeCity.name}</span>
                </h1>
                <p className={styles.heroDesc}>
                  Real-time environmental, seismic, financial, and urban stress monitoring for the modern world.
                </p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <ApiLibraryButton section="overview" />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.grid}>
          {/* Weather Card */}
          <PulseCard title="Weather" icon={current ? sdk.utils.getWeatherIcon(current.weather_code) : '☀️'} href="/weather" accent="var(--accent-blue)" delay={100} loading={loading}>
            {current && (
              <div className={styles.metric}>
                <span className={styles.metricValue}>{current.temperature_2m}°C</span>
                <span className={styles.metricLabel}>{sdk.utils.getWeatherLabel(current.weather_code)}</span>
                <span className={styles.metricDetail}>Feels like {current.apparent_temperature}°C • Wind {current.wind_speed_10m} km/h</span>
              </div>
            )}
          </PulseCard>

          {/* Quake Card */}
          <PulseCard title="Quake" icon="🌍" href="/quake" accent="var(--accent-orange)" delay={200} loading={loading}>
            {recentQuakes.length > 0 ? (
                <div className={styles.quakeList}>
                  {recentQuakes.slice(0, 3).map((q) => (
                    <div key={q.id} className={styles.quakeItem}>
                      <span className={styles.quakeMag} style={{ color: sdk.utils.getMagnitudeColor(q.properties.mag) }}>
                        M{q.properties.mag.toFixed(1)}
                      </span>
                      <span className={styles.quakePlace}>{q.properties.place}</span>
                    </div>
                  ))}
                </div>
              ) : <div className={styles.emptyMetric}>No regional seismic activity detected.</div>
            }
          </PulseCard>

          {/* Stress Card */}
          <PulseCard title="Stress" icon="💠" href="/stress" accent={stress?.level?.color || 'var(--accent-purple)'} delay={300} loading={loading}>
            {stress && (
              <div className={styles.metric}>
                <span className={styles.metricValue} style={{ color: stress.level.color }}>{stress.score}</span>
                <span className={styles.metricLabel} style={{ color: stress.level.color }}>{stress.level.label}</span>
                <span className={styles.metricDetail}>Factors: Weather, News, Market Stability</span>
              </div>
            )}
          </PulseCard>

          {/* FX Card */}
          <PulseCard title="FX" icon="💱" href="/fx" accent="var(--accent-yellow)" delay={400} loading={loading}>
            {topRates.length > 0 ? (
              <div className={styles.rateList}>
                {topRates.map((r) => (
                  <div key={r.currency} className={styles.rateItem}>
                    <span className={styles.rateCurrency}>{r.currency}</span>
                    <span className={styles.rateValue}>{r.rate.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            ) : <div className={styles.emptyMetric}>Regional liquidity data unavailable.</div>}
          </PulseCard>

          {/* Intelligence Card */}
          <PulseCard title="Intelligence" icon="📜" href="/intelligence" accent="var(--accent-cyan)" delay={450} loading={loading}>
             <div className={styles.metric}>
               {stress ? (
                   <>
                     <span className={styles.metricLabel}>Urban Grade: {100 - stress.score} — {stress.score < 20 ? 'S' : 'A'}</span>
                     <span className={styles.metricDetail}>Stability Factor: {(100 - stress.score * 0.8).toFixed(1)}%</span>
                     <span className={styles.metricDetail}>{data.news?.length || 0} active signals analyzed</span>
                   </>
                 ) : <div className={styles.emptyMetric}>Strategic intelligence feed offline.</div>
               }
             </div>
          </PulseCard>

          {/* City Card */}
          <PulseCard title="City" icon="🏙️" href="/city" accent="var(--accent-teal)" delay={500} loading={loading}>
            <div className={styles.metric}>
              {current && (
                <>
                  <span className={styles.metricLabel}>{activeCity.name} Current State</span>
                  <span className={styles.metricDetail}>
                    {sdk.utils.getWeatherLabel(current.weather_code)} • {current.temperature_2m}°C • UV {current.uv_index}
                  </span>
                  <span className={styles.metricDetail}>
                    Humidity {current.relative_humidity_2m}% • Pressure {current.surface_pressure?.toFixed(0)} hPa  
                  </span>
                </>
              )}
            </div>
          </PulseCard>

          {/* Now Card */}
          <PulseCard title="Now" icon="⚡" href="/now" accent="var(--accent-purple)" delay={600} loading={loading}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Real-time Terminal</span>
              {current && (
                <span className={styles.metricDetail}>
                  {sdk.utils.getWeatherLabel(current.weather_code)}, {current.temperature_2m}°C 
                  {stress ? ` • Stress: ${stress.level.label}` : ''}
                </span>
              )}
            </div>
          </PulseCard>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerInfo}>
            <span>Pulse SDK v{sdk.version}</span>
            <span>•</span>
            <span>{activeCity.name} Portal Active</span>
          </div>
          <div className={styles.footerLinks}>
            <span>Data: Open-Meteo, USGS, Frankfurter</span>
          </div>
        </footer>
      </main>
    </>
  );
}
