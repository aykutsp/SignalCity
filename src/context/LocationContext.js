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
    const saved = localStorage.getItem('pulse_city_data');
    if (saved) {
      try {
        setActiveCity(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved city');
      }
    }
    setIsHydrated(true);
  }, []);

  const changeCity = (cityData) => {
    setActiveCity(cityData);
    localStorage.setItem('pulse_city_data', JSON.stringify(cityData));
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
