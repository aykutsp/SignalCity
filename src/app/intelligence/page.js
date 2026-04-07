'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import styles from './intelligence.module.css';

const ARTICLES = [
  {
    id: 'urban-resilience-2026',
    title: 'Urban Resilience in the Age of Permacrisis',
    summary: 'A deep dive into how modern metropolitan centers are adapting to environmental and social volatility through real-time telemetry.',
    content: `
      # Urban Resilience in 2026
      
      As we navigate the mid-2020s, the concept of the 'Smart City' has evolved into the 'Resilient City'. Infrastructure is no longer just about efficiency; it is about survival under volatility.
      
      ## The Data Inversion
      Traditionally, city management relied on retrospective data. Today, the Pulse Methodology utilizes proactive telemetry—seismic micro-oscillations, atmospheric pressure drops, and social sentiment scoring—to predict urban tension before it manifests.
      
      ## Case Study: The 1500km Radius
      By localized regional monitoring, we can isolate macro-economic shocks from local infrastructure strains. A tremor in a neighboring province may have more economic impact on a city's logistics than a direct minor event.
      
      ## Conclusion
      Calculated urbanism is the only pathway to long-term stability in high-stress geographic hubs.
    `,
    author: 'Pulse Intelligence Unit',
    date: 'April 2026',
    category: 'Analysis',
    readTime: '8 min'
  },
  {
    id: 'algorithmic-urbanism',
    title: 'Algorithmic Urbanism: The Pulse Methodology',
    summary: 'Explaining the mathematics behind the Pulse Stress Index and how sentiment data complements atmospheric signals.',
    content: `
      # Algorithmic Urbanism
      
      The Pulse Stress Index (PSI) is a multi-variant equation designed to quantify the 'ambient pressure' of a city.
      
      ## The Equation
      PSI = (W_env * E) + (W_soc * S) + (W_fin * F)
      
      Where:
      - **E (Environmental)**: UV Index + (Δ Temp) + (Δ Pressure)
      - **S (Social)**: News Sentiment Scalar (0-100)
      - **F (Financial)**: Currency Volatility Index
      
      ## Sentiment as a Lead Indicator
      Social tension often precedes physical infrastructure strain. By scraping localized RSS feeds and performing real-time scoring, we provide a 24-hour lead on potential urban instability.
    `,
    author: 'Chief Data Scientist',
    date: 'March 2026',
    category: 'Methodology',
    readTime: '12 min'
  }
];

export default function IntelligencePage() {
  const { activeCity, isHydrated } = useLocation();
  const [pulse, setPulse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [visibleSignals, setVisibleSignals] = useState(6);

  useEffect(() => {
    if (!isHydrated) return;
    
    async function load(showLoading = true) {
      if (showLoading) setLoading(true);
      try {
        const data = await sdk.getCityPulse(activeCity);
        setPulse(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (showLoading) setLoading(false);
      }
    }

    load();

    // Background Intelligent Syncing (every 30 seconds)
    const interval = setInterval(() => {
      load(false); 
    }, 30000);

    return () => clearInterval(interval);
  }, [activeCity, isHydrated]);

  if (!isHydrated) return null;

  const newsSignals = pulse?.news || [];
  const factors = pulse?.stress?.factors || [];

  return (
    <>
      <Header />
      <main className={styles.main}>
        {selectedArticle ? (
          <div className={`glass ${styles.reader}`}>
            <button className={styles.backBtn} onClick={() => setSelectedArticle(null)}>← Back to Journals</button>
            <div className={styles.readerContent}>
              <span className={styles.category}>{selectedArticle.category}</span>
              <h1 className={styles.readerTitle}>{selectedArticle.title}</h1>
              <div className={styles.readerMeta}>
                By {selectedArticle.author} • {selectedArticle.date} • {selectedArticle.readTime}
              </div>
              <div className={styles.markdown}>
                {selectedArticle.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.pageHeader}>
              <div className={styles.headerLeft}>
                <h1 className={styles.title}>📜 Pulse Intelligence</h1>
                <p className={styles.subtitle}>Strategic Analysis & Urban Evaluation Journals</p>
              </div>
              <ApiLibraryButton section="evaluation" />
            </div>

            {/* Live City Assessment with Transparency */}
            <section className={`glass ${styles.assessmentSection}`}>
              <div className={styles.assessmentHeader}>
                <div className={styles.cityBadge}>
                  LIVE ASSESSMENT: {activeCity.name} 
                  <span style={{ marginLeft: '12px', color: 'var(--accent-blue)' }}>
                    RAW SCORE: {100 - (pulse?.stress?.score || 0)}/100
                  </span>
                </div>
                {loading ? (
                   <div className="pulse-skeleton" style={{ width: 120, height: 48 }} />
                ) : (
                  <div className={styles.ratingBadge} data-rating={pulse?.evaluation?.rating}>
                    GRADE {pulse?.evaluation?.rating}
                  </div>
                )}
              </div>
              
              <div className={styles.assessmentGrid}>
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="pulse-skeleton" style={{ height: 100 }} />)
                ) : pulse?.evaluation?.assessments.map((a, i) => (
                  <div key={i} className={styles.assessmentCard} data-type={a.type}>
                    <div className={styles.aCategory}>{a.category}</div>
                    <div className={styles.aMessage}>{a.message}</div>
                  </div>
                ))}
              </div>

              {!loading && (
                <div className={styles.stabilityFooter}>
                  <div className={styles.stabilityLabel}>
                    Structural Stability: <strong className={styles.stabilityValue}>{pulse?.evaluation?.stability}</strong>
                  </div>
                  <div className={styles.impactGrid}>
                    {factors.slice(0, 4).map(f => (
                      <div key={f.name} className={styles.impactItem}>
                        <span>{f.name}</span>
                        <span className={styles.impactValue} data-pos={f.value < 10}>
                          {f.value > 10 ? '-' : '+'}{f.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* NEW: Signal Source Feed (Transparency Logs) */}
            <section className={styles.signalSection}>
              <div className={styles.signalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h2 className={styles.chartTitle}>📡 Processed Signals & Sentiment Logs</h2>
                    <div className={styles.syncIndicator}>
                        <div className={styles.syncPulse}></div>
                        PULSE SYNC ACTIVE
                    </div>
                </div>
                <div className={styles.cityBadge}>{newsSignals.length} Active Vectors Deteced</div>
              </div>

              <div className={styles.signalList}>
                {loading ? (
                  [1,2,3,4,5].map(i => <div key={i} className="pulse-skeleton" style={{ height: 70 }} />)
                ) : (
                  newsSignals.slice(0, visibleSignals).map((signal, idx) => (
                    <div key={idx} className={styles.signalRow}>
                      <div className={styles.signalType}>{signal.sentiment > 60 ? '⚡' : '🛡️'}</div>
                      <div className={styles.signalBody}>
                        <div className={styles.signalTitle}>{signal.title}</div>
                        <div className={styles.signalMeta}>
                          <span className={styles.signalTag} data-tag={signal.tag}>{signal.tag.replace('_', ' ')}</span>
                          <span className={styles.signalSource}>SOURCE: {signal.source}</span>
                          <span>DETECTION: {new Date(signal.pubDate).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className={styles.signalImpact} style={{ color: signal.sentiment > 50 ? 'var(--accent-cyan)' : 'var(--accent-red)' }}>
                        {signal.sentiment}%
                      </div>
                    </div>
                  ))
                )}
              </div>

              {!loading && newsSignals.length > visibleSignals && (
                <button className={styles.loadMoreBtn} onClick={() => setVisibleSignals(v => v + 10)}>
                  Load More Intelligence Signals
                </button>
              )}
            </section>

            <div className={styles.grid}>
              {ARTICLES.map(article => (
                <div key={article.id} className={`glass ${styles.articleCard}`} onClick={() => setSelectedArticle(article)}>
                  <div className={styles.cardHeader}>
                    <span className={styles.category}>{article.category}</span>
                    <span className={styles.readTime}>{article.readTime}</span>
                  </div>
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                  <p className={styles.articleSummary}>{article.summary}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <span className={styles.author}>{article.author}</span>
                      <span className={styles.date}>{article.date}</span>
                    </div>
                    <button className={styles.readBtn}>Read Full Report</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Section */}
            <section className={`glass ${styles.featuredSection}`}>
              <div className={styles.featuredContent}>
                <span className={styles.badge}>Special Report</span>
                <h2 className={styles.featuredTitle}>The 2026 Global Urban Stability Index</h2>
                <p className={styles.featuredText}>
                  Our annual comprehensive evaluation of global megacities, ranking them by the lowest composite stress scores 
                  and highest infrastructure stability. Available for institutional access.
                </p>
                <button className={styles.ctaBtn}>Access Dataset</button>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
