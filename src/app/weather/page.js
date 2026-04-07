'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import GlobalPulseMap from '@/components/GlobalPulseMap';
import styles from './weather.module.css';

export default function WeatherPage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    async function load() {
      setLoading(true);
      try {
        const res = await sdk.getWeather(activeCity);
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

  const hourlyData = data?.hourly
    ? data.hourly.time.slice(0, 48).map((t, i) => ({
        time: new Date(t).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          hour12: true, 
          timeZone: activeCity.timezone 
        }),
        temp: data.hourly.temperature_2m[i],
        wind: data.hourly.wind_speed_10m[i],
        uv: data.hourly.uv_index[i],
      }))
    : [];

  const current = data?.current;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>☀️ Pulse Weather</h1>
            <p className={styles.subtitle}>{activeCity.name} — 48-Hour Atmospheric Snapshot</p>
          </div>
          <ApiLibraryButton section="weather" />
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            <div className={`pulse-skeleton ${styles.skeletonMain}`} />
            <div className={styles.skeletonStats}>
              {[1, 2, 3, 4].map(i => <div key={i} className="pulse-skeleton" style={{ height: 100 }} />)}
            </div>
          </div>
        ) : (
          <>
            <GlobalPulseMap mode="weather" />
            {/* Current Conditions */}
            <div className={styles.currentGrid}>
              <div className={`glass ${styles.currentMain}`}>
                <div className={styles.bigTemp}>{current?.temperature_2m}°C</div>
                <div className={styles.feelsLike}>Feels like {current?.apparent_temperature}°C</div>
                <div className={styles.conditionLabel}>{sdk.utils.getWeatherLabel(current?.weather_code)}</div>
              </div>
              {[
                { label: 'Humidity', value: `${current?.relative_humidity_2m}%`, icon: '💧' },
                { label: 'Wind', value: `${current?.wind_speed_10m} km/h`, icon: '💨' },
                { label: 'UV Index', value: current?.uv_index, icon: '☀️' },
                { label: 'Pressure', value: `${current?.surface_pressure?.toFixed(0)} hPa`, icon: '🌡️' },
              ].map(m => (
                <div key={m.label} className={`glass ${styles.statCard}`}>
                  <span className={styles.statIcon}>{m.icon}</span>
                  <span className={styles.statValue}>{m.value}</span>
                  <span className={styles.statLabel}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
              <div className={`glass ${styles.chartCard}`}>
                <h2 className={styles.chartTitle}>Temperature Forecast (°C)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} interval={5} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="temp" stroke="var(--accent-blue)" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={`glass ${styles.chartCard}`}>
                <h2 className={styles.chartTitle}>Wind Speed (km/h)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} interval={5} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="wind" stroke="var(--accent-teal)" fill="url(#windGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
