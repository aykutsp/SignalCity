'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import styles from './city.module.css';

export default function CityPage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState({
    weather: null,
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
          weather: pulse.weather,
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

  const { weather, stress, loading } = data;
  const current = weather?.current;
  const hourly = weather?.hourly;

  const pressureData = hourly
    ? hourly.time.slice(0, 48).map((t, i) => ({
        time: new Date(t).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          hour12: true, 
          timeZone: activeCity.timezone 
        }),
        pressure: hourly.surface_pressure?.[i],
        humidity: hourly.relative_humidity_2m?.[i],
      }))
    : [];

  const conditions = current ? [
    { label: 'Temperature', value: `${current.temperature_2m}°C`, icon: '🌡️', color: 'var(--accent-blue)' },
    { label: 'Feels Like', value: `${current.apparent_temperature}°C`, icon: '🤒', color: 'var(--accent-teal)' },
    { label: 'Humidity', value: `${current.relative_humidity_2m}%`, icon: '💧', color: 'var(--accent-blue)' },
    { label: 'Wind Speed', value: `${current.wind_speed_10m} km/h`, icon: '💨', color: 'var(--accent-cyan)' },
    { label: 'UV Index', value: current.uv_index, icon: '☀️', color: 'var(--accent-orange)' },
    { label: 'Barometric', value: `${current.surface_pressure?.toFixed(0)} hPa`, icon: '🌡️', color: 'var(--accent-yellow)' },
    { label: 'Condition', value: sdk.utils.getWeatherLabel(current.weather_code), icon: sdk.utils.getWeatherIcon(current.weather_code), color: 'var(--accent-teal)' },
    { label: 'Wind Angle', value: `${current.wind_direction_10m}°`, icon: '🧭', color: 'var(--accent-purple)' },
  ] : [];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>🏙️ Pulse City</h1>
            <p className={styles.subtitle}>{activeCity.name} — Live Infrastructure & Condition Hub</p>
          </div>
          <ApiLibraryButton section="weather" />
        </div>

        {loading ? (
          <div className="skeleton-line" style={{ height: 400, borderRadius: 20 }} />
        ) : (
          <>
            {/* Status banner */}
            <div className={`glass ${styles.statusBanner}`}>
              <div className={styles.statusLeft}>
                <span className={styles.statusIcon}>{current ? sdk.utils.getWeatherIcon(current.weather_code) : '🏙️'}</span>
                <div>
                  <h2 className={styles.statusTitle}>{activeCity.name}</h2>
                  <p className={styles.statusSub}>
                    {current ? `${sdk.utils.getWeatherLabel(current.weather_code)} • ${current.temperature_2m}°C` : 'Loading...'}
                    {stress ? ` • Local Tension: ${stress.level.label}` : ''}
                  </p>
                </div>
              </div>
              {stress && (
                <div className={styles.statusScore} style={{ color: stress.level.color }}>
                  <span className={styles.scoreNum}>{stress.score}</span>
                  <span className={styles.scoreLabel}>Tension</span>
                </div>
              )}
            </div>

            {/* Conditions grid */}
            <div className={styles.condGrid}>
              {conditions.map(c => (
                <div key={c.label} className={`glass ${styles.condCard}`}>
                  <span className={styles.condIcon}>{c.icon}</span>
                  <span className={styles.condValue}>{c.value}</span>
                  <span className={styles.condLabel}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Pressure + humidity chart */}
            <div className={`glass ${styles.chartCard}`}>
              <h2 className={styles.chartTitle}>Localized Barometrics & Moisture (%)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pressureData}>
                  <defs>
                    <linearGradient id="pressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} domain={['auto', 'auto']} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} 
                          itemStyle={{ color: '#fff' }}
                        />
                  <Area yAxisId="left" type="monotone" dataKey="pressure" stroke="var(--accent-cyan)" fill="url(#pressGrad)" strokeWidth={2} dot={false} name="Pressure (hPa)" />
                  <Area yAxisId="right" type="monotone" dataKey="humidity" stroke="var(--accent-purple)" fill="url(#humGrad)" strokeWidth={2} dot={false} name="Humidity (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </>
  );
}
