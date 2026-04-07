'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ApiLibraryButton from '@/components/ApiLibraryButton';
import { useLocation } from '@/context/LocationContext';
import sdk from '@/lib/sdk';
import styles from './news.module.css';

export default function NewsPage() {
  const { activeCity, isHydrated } = useLocation();
  const [data, setData] = useState({
    news: [],
    loading: true,
    score: 50
  });

  useEffect(() => {
    if (!isHydrated) return;
    async function load() {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const pulse = await sdk.getCityPulse(activeCity);
        setData({
          news: pulse.news,
          score: pulse.newsScore,
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

  const { news, score, loading } = data;

  const getSentimentLabel = (s) => {
    if (s > 70) return { label: 'Positive', color: '#06d6a0' };
    if (s < 40) return { label: 'High Alert', color: '#ef476f' };
    return { label: 'Neutral', color: '#ffd166' };
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>📰 Pulse Social</h1>
            <p className={styles.subtitle}>{activeCity.name} — Real-time Sentiment Analysis & Local Signals</p>
          </div>
          <ApiLibraryButton section="news" />
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-line" style={{ height: 120, borderRadius: 16 }} />)}
          </div>
        ) : (
          <div className={styles.content}>
            {/* Sentiment Dashboard */}
            <div className={`glass ${styles.sentimentHero}`}>
              <div className={styles.sentimentInfo}>
                <h2 className={styles.sentimentTitle}>Social Sentiment Score</h2>
                <div className={styles.sentimentValue} style={{ color: getSentimentLabel(score).color }}>
                  {score}
                  <span className={styles.sentimentLabel}>{getSentimentLabel(score).label} Pulse</span>
                </div>
                <p className={styles.sentimentDesc}>
                  Calculated by analyzing localized news headlines for urban tension, economic stability, and public events.
                </p>
              </div>
              <div className={styles.bars}>
                <div className={styles.sentimentBar}>
                  <div className={styles.sentimentFill} style={{ width: `${score}%`, background: getSentimentLabel(score).color }} />
                </div>
              </div>
            </div>

            {/* News Feed */}
            <div className={styles.feed}>
              {news.length === 0 ? (
                <div className={`glass ${styles.empty}`}>
                  <p>No recent news signals found for this region.</p>
                </div>
              ) : (
                news.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`glass ${styles.newsCard}`}>
                    <div className={styles.cardHeader}>
                      <span className={styles.source}>{item.source}</span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.date}>{new Date(item.pubDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    <div className={styles.cardFooter}>
                      <div className={styles.sentimentBadge} style={{ background: `${getSentimentLabel(item.sentiment).color}20`, color: getSentimentLabel(item.sentiment).color }}>
                        {item.sentiment} Signal Strength
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
