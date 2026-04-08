'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CitySearch from './CitySearch';
import styles from './Header.module.css';

const CORE_NAV = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/consciousness', label: 'Sentient', icon: '👁️' },
  { href: '/planetary', label: 'Tactical', icon: '🛰️' },
  { href: '/cortex', label: 'Cortex', icon: '🧠' },
  { href: '/sovereign', label: 'Sovereign', icon: '👑' },
  { href: '/lattice', label: 'Lattice', icon: '🕸️' },
  { href: '/oracle', label: 'Oracle', icon: '🔮' },
  { href: '/papers', label: 'Research', icon: '📚' },
];

const SENSOR_NAV = [
  { href: '/weather', label: 'Weather', icon: '☀️' },
  { href: '/quake', label: 'Quake', icon: '🌍' },
  { href: '/stress', label: 'Stress', icon: '💠' },
  { href: '/fx', label: 'FX', icon: '💱' },
  { href: '/intelligence', label: 'Sources', icon: '📜' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Pulse</span>
            <span className={styles.liveBadge}>
              <span className="live-dot" />
              LIVE
            </span>
          </Link>

          <CitySearch />
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            {CORE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={`${styles.navGroup} ${styles.sensors}`}>
            {SENSOR_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${styles.sensorLink} ${pathname === item.href ? styles.active : ''}`}
                title={item.label}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
