'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import { POPULAR_PAIRS } from '@/lib/api/fx';
import { getCurrencyByCountry, MAJOR_CURRENCIES } from '@/lib/sdk/currencies';
import sdk from '@/lib/sdk';
import GlobalPulseMap from '@/components/GlobalPulseMap';
import styles from './fx.module.css';

export default function FXPage() {
  const { activeCity, isHydrated } = useLocation();
  const [rates, setRates] = useState(null);
  const [matrixData, setMatrixData] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  
  const localCurrency = getCurrencyByCountry(activeCity?.country);
  const [activePair, setActivePair] = useState({ base: 'USD', target: localCurrency, label: `USD/${localCurrency}` });

  // Update active pair when city changes
  useEffect(() => {
    if (activeCity) {
      const cur = getCurrencyByCountry(activeCity.country);
      setActivePair({ base: 'USD', target: cur, label: `USD/${cur}` });
    }
  }, [activeCity]);

  useEffect(() => {
    if (!isHydrated) return;
    async function loadData() {
      setLoading(true);
      try {
        // Explicitly request all major vectors to ensure they are present in the response
        const symbols = ['EUR', 'GBP', 'JPY', 'TRY', localCurrency].filter(c => c !== 'USD').join(',');
        const d = await sdk.getFXRates('USD', symbols);
        setRates(d);
        
        const cols = ['USD', 'EUR', 'GBP', 'JPY', localCurrency];
        const rows = cols.map(base => {
          // baseToUsd: value of 1 BASE in USD
          // If base is USD, it's 1.0. If base is something else, it's 1 / (USD per BASE)
          const baseToUsd = (base === 'USD') ? 1 : (d.rates[base] ? 1 / d.rates[base] : null);
          
          return {
            base,
            rates: cols.map(target => {
              if (base === target) return 1.0;
              if (baseToUsd === null) return null;
              
              const targetFromUsd = target === 'USD' ? 1 : d.rates[target];
              if (targetFromUsd === undefined) return null;
              
              return baseToUsd * targetFromUsd;
            })
          };
        });
        setMatrixData(rows);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isHydrated, localCurrency]);

  useEffect(() => {
    if (!isHydrated) return;
    async function loadSeries() {
      setSeries([]);
      try {
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const res = await fetch(`https://api.frankfurter.dev/v1/${start}..${end}?base=${activePair.base}&symbols=${activePair.target}`);
        const d = await res.json();
        
        const points = Object.entries(d.rates).map(([date, r]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rate: r[activePair.target],
        }));
        setSeries(points);
      } catch (e) {}
    }
    loadSeries();
  }, [activePair, isHydrated]);

  if (!isHydrated) return null;

  const matrixCols = ['USD', 'EUR', 'GBP', 'JPY', localCurrency];
  const convert = (target) => {
    if (!rates?.rates || !rates.rates[localCurrency]) return 0;
    if (target === localCurrency) return amount.toFixed(2);
    
    const baseToUsd = 1 / rates.rates[localCurrency];
    const targetFromUsd = target === 'USD' ? 1 : (rates.rates[target] || 1);
    return (amount * baseToUsd * targetFromUsd).toFixed(2);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>💱 Pulse FX</h1>
            <p className={styles.subtitle}>Institutional Liquidity & Local Conversion Matrix</p>
          </div>
          <ApiLibraryButton section="fx" />
        </div>

        {loading ? (
          <div className={styles.fxLayout}>
             <div className="pulse-skeleton" style={{ height: 450 }} />
             <div className="pulse-skeleton" style={{ height: 450 }} />
          </div>
        ) : (
          <>
            <GlobalPulseMap mode="fx" />
            <div className={styles.fxLayout}>
              {/* Chart Side */}
              <div className={styles.chartCol}>
                <div className={styles.pairRow}>
                  {POPULAR_PAIRS.concat([{ base: 'USD', target: localCurrency, label: `USD/${localCurrency}` }])
                    .filter((v, i, a) => a.findIndex(t => t.label === v.label) === i)
                    .map(p => (
                    <button
                      key={p.label}
                      className={`${styles.pairBtn} ${activePair.label === p.label ? styles.pairActive : ''}`}
                      onClick={() => setActivePair(p)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className={`glass ${styles.chartCard}`}>
                  <h2 className={styles.chartTitle}>
                    {activePair.label} Performance (30D)
                    <span className={styles.localLabel}>Real-time Vector</span>
                  </h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={series}>
                      <defs>
                        <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent-yellow)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="var(--accent-yellow)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="rate" stroke="var(--accent-yellow)" fill="url(#fxGrad)" strokeWidth={2.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Local Conversion Vectors */}
              <div className={`glass ${styles.localCard}`}>
                <div className={styles.localHeader}>
                  <span className={styles.localLabel}>City Context: {activeCity.name}</span>
                  <div className={styles.localCurrency}>{localCurrency}</div>
                  <div className={styles.localSecondary}>Base: 1.00 {localCurrency}</div>
                </div>

                <div className={styles.localStats}>
                  <div className={styles.localStatItem}>
                    <span className={styles.statPair}>{localCurrency}/USD</span>
                    <span className={styles.statVal}>{rates?.rates?.[localCurrency] ? (1 / rates.rates[localCurrency]).toFixed(4) : '1.000'}</span>
                  </div>
                  <div className={styles.localStatItem}>
                    <span className={styles.statPair}>{localCurrency}/EUR</span>
                    <span className={styles.statVal}>
                      {rates?.rates?.[localCurrency] && rates?.rates?.['EUR'] 
                        ? ((1 / rates.rates[localCurrency]) * rates.rates['EUR']).toFixed(4) 
                        : '---'}
                    </span>
                  </div>
                  <div className={styles.localStatItem}>
                    <span className={styles.statPair}>{localCurrency}/TRY</span>
                    <span className={styles.statVal}>
                      {rates?.rates?.[localCurrency] && rates?.rates?.['TRY']
                        ? ((1 / rates.rates[localCurrency]) * rates.rates['TRY']).toFixed(4)
                        : (localCurrency === 'TRY' ? '1.0000' : '---')}
                    </span>
                  </div>
                </div>

                <div className={styles.subtitle} style={{ fontSize: '0.8rem', marginTop: 'auto' }}>
                  Derived from Pulse Reserve indices. Refreshed every 3600s.
                </div>
              </div>

              {/* Interactive Converter */}
              <div className={`glass ${styles.converterCard}`}>
                <h2 className={styles.chartTitle}>Local Pulse Converter</h2>
                <div className={styles.converterInputRow}>
                    <input 
                      type="number" 
                      className={styles.convInput} 
                      value={amount} 
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} 
                    />
                    <span className={styles.convUnit}>{localCurrency}</span>
                </div>
                
                <div className={styles.convResultColumn}>
                   {['USD', 'EUR', 'GBP', 'JPY', 'TRY'].filter(c => c !== localCurrency).map(cur => (
                     <div key={cur} className={styles.convResultItem}>
                        <span className={styles.convResLabel}>{cur}</span>
                        <span className={styles.convResValue}>{convert(cur)}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Global Liquidity Matrix */}
            <div className={`glass ${styles.matrixCard}`}>
              <h2 className={styles.chartTitle}>Pulse Global Liquidity Matrix</h2>
              <div className={styles.matrixWrapper}>
                <table className={styles.matrixTable}>
                  <thead>
                    <tr>
                      <th className={styles.matrixTh}>Base Unit</th>
                      {matrixCols.map(c => <th key={c} className={styles.matrixTh}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {matrixData.map((row, i) => (
                      <tr key={i} className={styles.matrixRow}>
                        <td className={`${styles.matrixCell} ${styles.rowBase}`}>{row.base}</td>
                        {row.rates.map((val, j) => (
                          <td key={j} className={styles.matrixCell}>
                            <span className={styles.cellValue}>
                                {val === null ? '---' : (val < 1 ? val.toFixed(4) : val.toFixed(2))}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
