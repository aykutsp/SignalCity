'use client';

import { useState } from 'react';
import DocModal from './DocModal';
import { DOCS_DATA } from '@/lib/docs/data';
import styles from './ApiLibraryButton.module.css';

export default function ApiLibraryButton({ section }) {
  const [isOpen, setIsOpen] = useState(false);
  const data = DOCS_DATA[section];

  if (!data) return null;

  return (
    <>
      <button 
        className={styles.button} 
        onClick={() => setIsOpen(true)}
        title="View API Documentation"
      >
        <span className={styles.icon}>📚</span>
        <span className={styles.label}>API Library</span>
      </button>

      <DocModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        data={data} 
      />
    </>
  );
}
