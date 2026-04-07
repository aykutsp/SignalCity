import styles from './PulseCard.module.css';
import Link from 'next/link';

export default function PulseCard({ title, icon, href, accent, children, loading = false, delay = 0 }) {
  const card = (
    <div
      className={`glass ${styles.card} fade-in ${loading ? styles.loading : ''}`}
      style={{
        '--card-accent': accent || 'var(--accent-cyan)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{icon}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.cardBody}>
        {loading ? (
          <div className={styles.skeletonContainer}>
            <div className="pulse-skeleton" style={{ height: '32px', width: '60%', marginBottom: '12px' }} />
            <div className="pulse-skeleton" style={{ height: '14px', width: '90%', marginBottom: '6px' }} />
            <div className="pulse-skeleton" style={{ height: '14px', width: '40%' }} />
          </div>
        ) : children}
      </div>
      {href && (
        <div className={styles.cardFooter}>
          <span className={styles.viewMore}>View Details →</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className={styles.cardLink}>{card}</Link>;
  }
  return card;
}
