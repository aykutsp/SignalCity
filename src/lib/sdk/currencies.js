/**
 * Pulse Currency Mapper
 * Maps country names (from Geocoding API) to ISO 4217 Currency Codes.
 * Used for localized financial intelligence.
 */

const COUNTRY_TO_CURRENCY = {
  'United States': 'USD',
  'United Kingdom': 'GBP',
  'United States': 'USD',
  'Germany': 'EUR',
  'France': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Japan': 'JPY',
  'Australia': 'AUD',
  'Canada': 'CAD',
  'Switzerland': 'CHF',
  'China': 'CNY',
  'Hong Kong': 'HKD',
  'Singapore': 'SGD',
  'India': 'INR',
  'Brazil': 'BRL',
  'Mexico': 'MXN',
  'South Africa': 'ZAR',
  'Russia': 'RUB',
  'South Korea': 'KRW',
  'Norway': 'NOK',
  'Sweden': 'SEK',
  'Denmark': 'DKK',
  'Poland': 'PLN',
  'Saudi Arabia': 'SAR',
  'United Arab Emirates': 'AED',
};

const COUNTRY_TO_ISO = {
  'United States': 'US',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Germany': 'DE',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Japan': 'JP',
  'Australia': 'AU',
  'Canada': 'CA',
  'Switzerland': 'CH',
  'China': 'CN',
  'Hong Kong': 'HK',
  'Singapore': 'SG',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'South Africa': 'ZA',
  'Russia': 'RU',
  'South Korea': 'KR',
  'Norway': 'NO',
  'Sweden': 'SE',
  'Denmark': 'DK',
  'Poland': 'PL',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
};

export function getCurrencyByCountry(countryName) {
  if (!countryName) return 'USD';
  const match = Object.entries(COUNTRY_TO_CURRENCY).find(([country]) => 
    countryName.includes(country) || country.includes(countryName)
  );
  return match ? match[1] : 'USD';
}

export function getIsoByCountry(countryName) {
  if (!countryName) return 'US';
  const match = Object.entries(COUNTRY_TO_ISO).find(([country]) => 
    countryName.includes(country) || country.includes(countryName)
  );
  return match ? match[1] : 'US';
}

export const MAJOR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'TRY'];
