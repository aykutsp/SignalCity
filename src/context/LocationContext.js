'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [activeCity, setActiveCity] = useState({
    name: 'San Francisco',
    lat: 37.7749,
    lon: -122.4194,
    timezone: 'America/Los_Angeles',
    country: 'USA'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 1. Initial hydration from URL params (Priority #1)
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get('city');
    const urlLat = params.get('lat');
    const urlLon = params.get('lon');

    if (urlCity && urlLat && urlLon) {
      const cityData = {
        name: urlCity,
        lat: parseFloat(urlLat),
        lon: parseFloat(urlLon),
        timezone: params.get('tz') || 'UTC',
        country: params.get('country') || ''
      };
      setActiveCity(cityData);
      localStorage.setItem('pulse_city_data', JSON.stringify(cityData));
    } else {
      // 2. Hydration from LocalStorage (Priority #2)
      const saved = localStorage.getItem('pulse_city_data');
      if (saved) {
        try {
          setActiveCity(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load saved city');
        }
      }
    }
    
    setIsHydrated(true);
  }, []);

  const changeCity = (cityData) => {
    setActiveCity(cityData);
    localStorage.setItem('pulse_city_data', JSON.stringify(cityData));
    
    // Synchronize URL for shareability
    const url = new URL(window.location.href);
    url.searchParams.set('city', cityData.name);
    url.searchParams.set('lat', cityData.lat);
    url.searchParams.set('lon', cityData.lon);
    url.searchParams.set('tz', cityData.timezone);
    url.searchParams.set('country', cityData.country);
    
    window.history.pushState({}, '', url.toString());
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      
      try {
        // Reverse Geocoding using Nominatim (No Key Needed)
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
        const data = await res.json();
        
        const cityData = {
          name: data.address.city || data.address.town || data.address.village || 'Current Location',
          lat,
          lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Approximate
          country: data.address.country
        };
        
        changeCity(cityData);
      } catch (e) {
        console.error('Reverse Geocoding failed', e);
        // Fallback with generic name
        changeCity({
          name: 'Detected Location',
          lat,
          lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          country: 'Local'
        });
      } finally {
        setIsLoading(false);
      }
    }, () => {
      setIsLoading(false);
      alert('Location access denied');
    });
  };

  return (
    <LocationContext.Provider value={{ activeCity, changeCity, detectLocation, isLoading, isHydrated }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
