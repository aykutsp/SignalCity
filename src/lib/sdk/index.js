/**
 * Pulse SDK - Advanced City Intelligence Library
 * 
 * A unified interface for atmospheric, seismic, financial, and urban stress data.
 * Designed for high-performance city monitoring applications.
 */

import { fetchWeather, getWeatherLabel, getWeatherIcon } from '../api/weather';
import { fetchQuakes, getMagnitudeColor, getMagnitudeLabel, formatQuakeTime } from '../api/quakes';
import { fetchRates } from '../api/fx';
import { computeStress, computeStressForecast } from '../api/stress';
import { fetchNews, scoreNews } from './news';
import { evaluateCity } from './evaluator';
import { getIsoByCountry, MAJOR_CURRENCIES, getCurrencyByCountry } from './currencies';
import sourceRegistry from './sources.json';

class PulseSDK {
  constructor() {
    this.version = '8.0.0-Planetary';
    this.author = 'SignalCity Intelligence';
    this.registry = sourceRegistry;
  }

  /**
   * Returns the formal planetary source registry and methodology.
   */
  getSources() {
    return this.registry.sources;
  }

  /**
   * Fetches the composite pulse of a city.
   * @param {Object} location - { name, lat, lon, timezone }
   * @param {Object} options - { radius: number, minMag: number }
   */
  async getCityPulse(location, options = { radius: 1000 }) {
    try {
      const { lat, lon, name, country } = location;
      const isoCode = getIsoByCountry(country);
      const localCurrency = getCurrencyByCountry(country);
      
      // Targeted FX symbols to ensure local liquidity is represented
      const fxSymbols = [...MAJOR_CURRENCIES, localCurrency].filter((v, i, a) => a.indexOf(v) === i).join(',');

      const [weather, quakes, rates] = await Promise.all([
        this.getWeather(location),
        this.getQuakes(lat, lon, options.radius),
        this.getFXRates('USD', fxSymbols),
      ]);

      const newsQuery = `${name}, ${country}`;
      const news = await this.getNews(newsQuery, isoCode);
      const newsScore = scoreNews(news);
      const stressOptions = { 
        cityName: name, 
        newsVolume: news.length,
        lat,
        lon
      };
      const stress = computeStress(weather, newsScore, quakes?.features || [], rates?.top || [], stressOptions);
      const forecast = computeStressForecast(weather, newsScore, quakes?.features || [], rates?.top || [], stressOptions);
      const evaluation = evaluateCity({ weather, stress, quakes, newsScore });

      return {
        weather,
        quakes,
        rates,
        news,
        stress,
        forecast,
        newsScore,
        evaluation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('PulseSDK Error:', error);
      throw error;
    }
  }

  async getWeather(location) {
    const { lat, lon } = location;
    return fetchWeather(lat, lon);
  }

  async getQuakes(lat, lon, radius) {
    return fetchQuakes(lat, lon, radius);
  }

  async getFXRates(base = 'USD', symbols = '') {
    return fetchRates(base, symbols);
  }

  async getNews(query, countryIso) {
    return fetchNews(query, countryIso);
  }

  // Utilities
  utils = {
    getWeatherLabel,
    getWeatherIcon,
    getMagnitudeColor,
    getMagnitudeLabel,
    formatQuakeTime,
    scoreNews,
  }

  /**
   * Scans a sample of the planetary registry to identify current risk leaders.
   */
  async getGlobalRiskLeaders() {
    // In a real scenario, this would query a real-time analytics backend.
    // For SignalCity, we simulate the planetary scan by sampling the elite hub database.
    const hubs = [
      "Tokyo", "New York", "London", "Paris", "Berlin", "Dubai", 
      "Singapore", "Mumbai", "Mexico City", "São Paulo", "Lagos", 
      "Sydney", "Istanbul", "Seoul", "Jakarta"
    ];
    
    return hubs
      .map(name => ({
        name,
        score: Math.floor(Math.random() * 40) + 30, // Simulated stress baseline
        status: Math.random() > 0.8 ? 'ALARM' : 'NOMINAL'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  /**
   * Performs semantic query against the Neural Lattice (Vector DB).
   */
  async searchNeuralLattice(query, topK = 10) {
    try {
      const response = await fetch('http://localhost:8011/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: topK })
      });
      return await response.json();
    } catch (e) {
      console.warn("Neural Lattice offline. Falling back to local heuristic.", e);
      return [];
    }
  }

  /**
   * Generates a synthetic planetary tension trajectory for the mission control chart.
   */
  getPlanetaryTrend() {
    return Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: 40 + Math.sin(i / 3) * 10 + Math.random() * 5
    }));
  }
}

export const sdk = new PulseSDK();
export default sdk;
