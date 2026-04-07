'use client';

import { useState } from 'react';
import styles from './DocModal.module.css';

export default function DocModal({ isOpen, onClose, data }) {
  const [activeTab, setActiveTab] = useState('js');
  if (!isOpen || !data) return null;

  const tabs = [
    { id: 'js', label: 'JavaScript' },
    { id: 'py', label: 'Python' },
    { id: 'php', label: 'PHP' },
    { id: 'cs', label: 'C# / .NET' }
  ].filter(tab => data[`usage_${tab.id}`] || (tab.id === 'js' && data.usage));

  const content = data[`usage_${activeTab}`] || (activeTab === 'js' ? data.usage : null);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`glass ${styles.modal}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        <div className={styles.header}>
          <span className={styles.icon}>📚</span>
          <h2 className={styles.title}>{data.title}</h2>
        </div>

        <p className={styles.desc}>{data.description}</p>

        {data.endpoint && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Unified REST Endpoint</h3>
            <div className={styles.codeBlock}>
              <code>{data.endpoint}</code>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Implementation Samples</h3>
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.codeBlock}>
            <pre><code>{content || '// No sample available for this platform.'}</code></pre>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>JSON Schema Output</h3>
          <div className={styles.codeBlock}>
            <pre><code>{JSON.stringify(data.output, null, 2)}</code></pre>
          </div>
        </div>

        <div className={styles.footer}>
          Pulse Platform Intelligence Documentation • v2.0 • Localized Core
        </div>
      </div>
    </div>
  );
}
