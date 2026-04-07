'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import styles from './docs.module.css';

const DOCS = [
  {
    icon: '🚀',
    title: 'Pulse SDK Introduction',
    content: 'The Pulse SDK is a zero-latency, keyless library for accessing global urban telemetry. It unifies environmental, seismic, and economic data into a single, high-performance interface.',
    code: `import sdk from '@/lib/sdk';\n\n// Get unified city intelligence\nconst pulse = await sdk.getCityPulse(cityContext);`
  },
  {
    icon: '🏙️',
    title: 'City Telemetry',
    content: 'Fetch real-time atmospheric data including temperature, UV index, and barometric pressure. Automatically localized to the target city timezone.',
    code: `const weather = await sdk.getWeather(latitude, longitude);\nconsole.log(weather.current.temperature_2m);`
  },
  {
    icon: '🌍',
    title: 'Seismic Monitoring',
    content: 'Query the USGS seismic database with localized radius filtering. Returnsgeojson features centered on specified coordinates.',
    code: `// Get quakes within 1000km of Istanbul\nconst quakes = await sdk.getQuakes(41.0082, 28.9784, 1000);`
  },
  {
    icon: '💠',
    title: 'Social & Ambient Stress',
    content: 'The proprietary Pulse Stress algorithm synthesizes 6+ environmental and social signals into a 0-100 tension index.',
    code: `const stress = sdk.utils.computeStress(weatherData, newsSentimentScore);\nconsole.log(stress.level.label); // e.g., "High Pressure"`
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.versionBadge}>v{require('@/lib/sdk').default.version}</span>
              <h2 className={styles.sidebarTitle}>Developer Guide</h2>
            </div>
            <nav className={styles.nav}>
              {DOCS.map((doc, i) => (
                <button 
                  key={i} 
                  className={`${styles.navItem} ${activeTab === i ? styles.navActive : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  <span className={styles.navIcon}>{doc.icon}</span>
                  {doc.title}
                </button>
              ))}
            </nav>
          </aside>

          <section className={styles.content}>
            <div className={`glass ${styles.docCard}`}>
              <div className={styles.docHeader}>
                <span className={styles.docIcon}>{DOCS[activeTab].icon}</span>
                <h1 className={styles.docTitle}>{DOCS[activeTab].title}</h1>
              </div>
              <p className={styles.docText}>{DOCS[activeTab].content}</p>
              
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>javascript</span>
                  <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(DOCS[activeTab].code)}>Copy</button>
                </div>
                <pre className={styles.pre}>
                  <code>{DOCS[activeTab].code}</code>
                </pre>
              </div>

              <div className={styles.infoBox}>
                <strong>Pro Tip:</strong> All Pulse SDK calls are idempotent and require zero API keys, making them ideal for high-scale frontend deployments.
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
