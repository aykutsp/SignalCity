'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import styles from './now.module.css';

export default function NowPage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState({
    weather: null,
    stress: null,
    quakes: null,
    rates: null,
    loading: true
  });

  useEffect(() => {
    if (!isHydrated) return;
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
  }, [activeCity, isHydrated]);

  if (!isHydrated) return null;

  const { weather, stress, quakes, rates, loading } = data;
  const c = weather?.current;
  const topQuakes = quakes?.features?.slice(0, 3) || [];
  
  // Localized Time & Date
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true,
    timeZone: activeCity.timezone 
  });
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    timeZone: activeCity.timezone 
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>⚡ Pulse Now</h1>
            <p className={styles.subtitle}>{activeCity.name} — Real-time Snapshot</p>
          </div>
          <ApiLibraryButton section="evaluation" />
        </div>

        {loading ? (
          <div className={styles.loadingStack}>
             <div className="pulse-skeleton" style={{ height: 180, borderRadius: 24, marginBottom: 24 }} />
             <div className="pulse-skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 16 }} />
             <div className="pulse-skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 16 }} />
             <div className="pulse-skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 16 }} />
             <div className="pulse-skeleton" style={{ height: 80, borderRadius: 12 }} />
          </div>
        ) : (
          <div className={`glass ${styles.summaryCard}`}>
            <div className={styles.timeBlock}>
              <span className={styles.bigTime}>{timeStr}</span>
              <span className={styles.dateLabel}>{dateStr}</span>
            </div>

            {/* Weather summary */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{c ? sdk.utils.getWeatherIcon(c.weather_code) : '☁️'} Weather</h2>
              <p className={styles.sectionText}>
                {c ? (
                  <>{activeCity.name} is currently experiencing <strong>{sdk.utils.getWeatherLabel(c.weather_code).toLowerCase()}</strong> conditions with a temperature of <strong>{c.temperature_2m}°C</strong> (feels like {c.apparent_temperature}°C). Wind is blowing at <strong>{c.wind_speed_10m} km/h</strong> with humidity at <strong>{c.relative_humidity_2m}%</strong>.</>
                ) : 'Weather data unavailable.'}
              </p>
            </div>

            {/* Stress summary */}
            {stress && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💠 Tension</h2>
                <p className={styles.sectionText}>
                  The localized tension index reads <strong style={{ color: stress.level.color }}>{stress.score}/100 ({stress.level.label})</strong>.
                  Drivers: <strong>{stress.factors[0]?.name}</strong> ({stress.factors[0]?.raw}), <strong>{stress.factors[1]?.name}</strong> ({stress.factors[1]?.raw}).
                </p>
              </div>
            )}

            {/* Seismic summary */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🌍 Regional Seismic</h2>
              {topQuakes.length > 0 ? (
                <>
                  <p className={styles.sectionText}>
                    <strong>{quakes.features.length}</strong> earthquakes (M2.0+) recorded within tracking radius in the last 24 hours.
                  </p>
                  <div className={styles.quakeList}>
                    {topQuakes.map(q => (
                      <div key={q.id} className={styles.quakeRow}>
                        <span className={styles.quakeMag} style={{ color: sdk.utils.getMagnitudeColor(q.properties.mag) }}>
                          M{q.properties.mag.toFixed(1)}
                        </span>
                        <span className={styles.quakePlace}>{q.properties.place}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={styles.sectionText}>No significant seismic activity reported near {activeCity.name}.</p>
              )}
            </div>

            {/* FX summary */}
            {rates && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💱 Market Vectors</h2>
                <div className={styles.fxRow}>
                  {Object.entries(rates.rates).slice(0, 4).map(([cur, rate]) => (
                    <div key={cur} className={styles.fxItem}>
                      <span className={styles.fxCur}>{cur}</span>
                      <span className={styles.fxRate}>{rate.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.footer}>
              Pulse SDK Terminal v{sdk.version} • Localized for {activeCity.name} ({activeCity.timezone})
            </div>
          </div>
        )}
      </main>
    </>
  );
}
