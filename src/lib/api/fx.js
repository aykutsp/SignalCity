export async function fetchRates(base = 'USD', symbols = '') {
  let url = `https://api.frankfurter.dev/v1/latest?base=${base}`;
  if (symbols) url += `&symbols=${symbols}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Frankfurter API failed');
  return res.json();
}

export async function fetchTimeSeries(base = 'USD', target = 'EUR', days = 30) {
  const end = new Date().toISOString().split('T')[0];
  const start = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const url = `https://api.frankfurter.dev/v1/${start}..${end}?base=${base}&symbols=${target}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Frankfurter timeseries failed');
  const data = await res.json();
  return Object.entries(data.rates).map(([date, rates]) => ({
    date,
    rate: rates[target],
  }));
}

export const POPULAR_PAIRS = [
  { base: 'USD', target: 'EUR', label: 'USD/EUR' },
  { base: 'USD', target: 'GBP', label: 'USD/GBP' },
  { base: 'USD', target: 'JPY', label: 'USD/JPY' },
  { base: 'USD', target: 'TRY', label: 'USD/TRY' },
  { base: 'EUR', target: 'GBP', label: 'EUR/GBP' },
];
