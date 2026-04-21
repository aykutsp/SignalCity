'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import styles from './cortex.module.css';

export default function CortexTerminal() {
  const [belief, setBelief] = useState(null);
  const [history, setHistory] = useState(null);
  const [question, setQuestion] = useState('');
  const [determination, setDetermination] = useState(null);
  const [loading, setLoading] = useState(false);
  const thoughtEndRef = useRef(null);

  // Fetch Belief and Judicial History
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beliefRes, historyRes] = await Promise.all([
          fetch('http://localhost:8011/cortex/belief'),
          fetch('http://localhost:8011/arbiter/history')
        ]);
        setBelief(await beliefRes.json());
        setHistory(await historyRes.json());
      } catch (err) {
        console.warn("API offline...");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setDetermination(null);
    try {
      const res = await fetch('http://localhost:8011/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setDetermination(data);
    } catch (err) {
      console.error("Predict error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.cortexContainer}>
        <div className={styles.cortexGrid}>
          <main className={styles.mainTerminal}>
            <div className={styles.neuralPulse} />
            <header className={styles.neuralHeader}>
              <div className={styles.titleGroup}>
                <h1>Planetary Cortex</h1>
                <div className={styles.cycleCounter}>
                  AGI_JUDICIAL_EPOCH: {history?.accuracy.toFixed(1) || '0.0'}% SYSTEM_ACCURACY
                </div>
              </div>
              <div className={styles.statusBadge}>
                <span className="live-dot" /> ARBITER_ACTIVE
              </div>
            </header>

            <section className={styles.beliefPanel}>
              <div className={styles.beliefStat}>
                <span className={styles.statVal}>
                  {belief ? (belief.global_tension * 100).toFixed(2) : '--.--'}%
                </span>
                <span className={styles.statLbl}>Target Tension</span>
              </div>
              <div className={styles.beliefStat}>
                <span className={styles.statVal}>
                  {history?.learning_momentum.toFixed(3) || '0.000'}
                </span>
                <span className={styles.statLbl}>Learning Momentum</span>
              </div>
              <div className={styles.beliefStat}>
                <span className={styles.statVal}>
                  {history?.total_predictions || '0'}
                </span>
                <span className={styles.statLbl}>Historical Audits</span>
              </div>
            </section>

            <section className={styles.thoughtModule}>
              <div className={styles.thoughtHeader}>
                <div className={styles.statLbl}>Live Thought stream [USRT_TENSOR_OUTPUT]</div>
                <div className={styles.learningActivity} style={{ color: history?.accuracy > 80 ? '#00f2ff' : '#ff4d4d' }}>
                  LEARNING_MODE: SLOW_STABLE ({history?.accuracy.toFixed(1)}%)
                </div>
              </div>
              <div className={styles.thoughtStream}>
                {belief?.recent_insights ? (
                  belief.recent_insights.map((insight, i) => {
                    const isAudit = insight.includes('REALITY_AUDIT');
                    const isCorrect = insight.includes('[CORRECT]');
                    const color = isAudit ? (isCorrect ? '#00ffa3' : '#ff4d4d') : '#00f2ff';
                    
                    return (
                      <div key={i} className={styles.thoughtEntry} style={{ borderColor: color, color: color }}>
                        <span className={styles.timePrefix} style={{ color: '#8899a6' }}>[{belief.last_update}]</span>
                        {insight}
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.thoughtEntry}>SYNCHRONIZING WITH ARBITER VAULT...</div>
                )}
                <div ref={thoughtEndRef} />
              </div>
            </section>
          </main>

          <aside className={styles.forecastInterface}>
            <div className={styles.forecastTitle}>
              <span>⚖️</span> STRATEGIC ARBITER
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8899a6', marginBottom: '1.5rem' }}>
              Input a tactical event query. The AGI will determine binary strike probability and learn from the outcome.
            </p>
            
            <form onSubmit={handlePredict}>
              <textarea 
                className={styles.askInput}
                placeholder="Tactical Event (e.g. 'Will US strike Iranian targets at 03:00?')"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
              <button type="submit" className={styles.askBtn} disabled={loading} style={{ background: '#ff4d4d', color: '#fff' }}>
                {loading ? 'DETERMINING...' : 'RUN JUDICIAL ANALYSIS'}
              </button>
            </form>

            {determination && (
              <div className={styles.responseArea}>
                <div className={styles.statLbl} style={{ color: '#ff4d4d', marginBottom: '0.5rem' }}>SCIENTIFIC DETERMINATION</div>
                <div className={styles.responseText} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {determination.determination}
                </div>
                <div className={styles.metaInfo}>
                  <span>STRIKE PROBABILITY: {(determination.scientific_score * 100).toFixed(1)}%</span>
                  <span>CONFIDENCE: {(determination.confidence * 100).toFixed(1)}%</span>
                </div>
                <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '1rem' }}>
                  MATURATION ID: #{determination.maturation_id} | REALITY AUDIT PENDING
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
