'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CitySearch from './CitySearch';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/consciousness', label: 'Sentient', icon: '👁️' },
  { href: '/planetary', label: 'Tactical', icon: '🛰️' },
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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
