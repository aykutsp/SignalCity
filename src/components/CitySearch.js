'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocation } from '@/context/LocationContext';
import registry from '@/lib/sdk/registry';
import styles from './CitySearch.module.css';

export default function CitySearch() {
  const { activeCity, changeCity, detectLocation, isLoading: isLocating } = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Registry-Priority Debounced Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // 1. Search Local Registry (1000+ Pulse Nodes)
        const localResults = registry.search(query).map(c => ({
          id: `reg-${c.name}-${c.country}`,
          name: c.name,
          latitude: c.lat,
          longitude: c.lon,
          country: c.country,
          timezone: c.tz,
          isRegistry: true
        }));

        // 2. Search Global API for non-registry hits
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await res.json();
        const apiResults = (data.results || []).filter(apiCity => 
          !localResults.some(local => local.name.toLowerCase() === apiCity.name.toLowerCase())
        );

        setResults([...localResults, ...apiResults]);
        setIsOpen(true);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city) => {
    changeCity({
      name: city.name,
      lat: city.latitude,
      lon: city.longitude,
      timezone: city.timezone || 'UTC',
      country: city.country
    });
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          placeholder={isLocating ? 'Locating...' : (activeCity.name || "Search 1,000+ Pulse Nodes...")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <button 
          className={styles.locateBtn} 
          onClick={detectLocation}
          disabled={isLocating}
          title="Use my location"
        >
          {isLocating ? '⌛' : '📍'}
        </button>
      </div>

      {isOpen && (results.length > 0 || isSearching) && (
        <div className={styles.dropdown}>
          {isSearching ? (
            <div className={styles.loading}>Searching Pulse Registry...</div>
          ) : (
            results.map((city) => (
              <button
                key={city.id || `${city.name}-${city.country}`}
                className={styles.resultItem}
                onClick={() => handleSelect(city)}
              >
                <span className={styles.cityName}>
                  {city.name}
                  {city.isRegistry && <span className={styles.nodeBadge}>Pulse Node</span>}
                </span>
                <span className={styles.cityDetails}>
                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
