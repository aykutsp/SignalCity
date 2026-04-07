export const DOCS_DATA = {
  weather: {
    title: 'Pulse Weather API',
    description: 'High-resolution atmospheric telemetry powered by Open-Meteo with Pulse localized timezone normalization.',
    endpoint: '/api/pulse?lat={lat}&lon={lon}&name={city}',
    usage_js: `import sdk from '@/lib/sdk';\nconst weather = await sdk.getWeather(loc);`,
    usage_py: `import requests\nres = requests.get("http://localhost:3000/api/pulse", params={"lat":41, "lon":28})`,
    usage_php: `$url = "http://localhost:3000/api/pulse?lat=41&lon=28";\n$res = json_decode(file_get_contents($url));`,
    usage_cs: `var json = await client.GetStringAsync("http://localhost:3000/api/pulse");`,
    output: {
      current: { temperature_2m: 21.5, relative_humidity_2m: 45, weather_code: 0, uv_index: 4.2 }
    }
  },
  quake: {
    title: 'Pulse Quake API',
    description: 'Localized seismic monitoring using the USGS GeoJSON engine with 1500km radius filtering.',
    endpoint: '/api/pulse?lat={lat}&lon={lon}&radius={radius}',
    usage_js: `const quakes = await sdk.getQuakes(41, 28, 1500);`,
    usage_py: `import requests\nres = requests.get("http://localhost:3000/api/pulse", params={"lat":41, "lon":28, "radius":1500})`,
    usage_php: `$url = "http://localhost:3000/api/pulse?lat=41&lon=28&radius=1500";\n$json = file_get_contents($url);`,
    usage_cs: `var res = await client.GetAsync("http://localhost:3000/api/pulse?lat=41&lon=28");`,
    output: {
      type: "FeatureCollection",
      features: [{ properties: { mag: 4.2, time: 1712498400000 } }]
    }
  },
  stress: {
    title: 'Pulse Stress Engine',
    description: 'Proprietary algorithm synthesizing atmospheric pressure, news sentiment, and financial volatility.',
    endpoint: '/api/pulse',
    usage_js: `const stress = sdk.api.stress.computeStress(weatherData, sentiment);`,
    usage_py: `res = requests.get("http://localhost:3000/api/pulse")\nprint(res.json()['stress'])`,
    usage_php: `$res = json_decode(file_get_contents("http://localhost:3000/api/pulse"));\necho $res->stress->score;`,
    usage_cs: `dynamic data = JsonConvert.DeserializeObject(json);\nvar score = data.stress.score;`,
    output: {
      score: 42,
      level: { label: "Active", color: "#ffd166" }
    }
  },
  news: {
    title: 'Pulse Social Signal API',
    description: 'Real-time news headlines processed through the Pulse Sentiment Scoring engine.',
    usage_js: `const news = await sdk.getNews('Istanbul');`,
    usage_py: `res = requests.get("http://localhost:3000/api/pulse")\nnews = res.json()['news']`,
    usage_php: `$news = json_decode(file_get_contents("http://localhost:3000/api/pulse"))->news;`,
    usage_cs: `var news = JsonConvert.DeserializeObject<List<Signal>>(json);`,
    output: [
      {
        title: "City Infrastructure Upgrade Commences",
        sentiment: 72,
        source: "Urban Reports",
        link: "..."
      }
    ]
  },
  fx: {
    title: 'Pulse FX Market API',
    description: 'Real-time global currency vectors and historic price trends via Frankfurter.',
    usage_js: `const rates = await sdk.getRates('USD');`,
    usage_py: `res = requests.get("https://api.frankfurter.dev/v1/latest?base=USD")`,
    usage_php: `$rates = json_decode(file_get_contents("https://api.frankfurter.dev/v1/latest"));`,
    usage_cs: `var rates = await client.GetStringAsync("https://api.frankfurter.dev/v1/latest");`,
    output: {
      base: "USD",
      date: "2026-04-07",
      rates: { EUR: 0.92, GBP: 0.79, TRY: 32.14 }
    }
  },
  evaluation: {
    title: 'Pulse Intelligence Evaluator',
    description: 'Qualitative analysis derived from multi-stream telemetry cross-referencing.',
    usage_js: `const evaluation = sdk.utils.evaluateCity(pulseData);`,
    usage_py: `pulse = requests.get("http://localhost:3000/api/pulse").json()\n# Implement evaluation logic on client`,
    usage_php: `// Use the Pulse Evaluation algorithm on the normalized JSON response`,
    usage_cs: `var evaluation = PulseEngine.Evaluate(pulseData);`,
    output: {
      rating: "A",
      stability: "82%",
      assessments: [
        { category: "Social", message: "Positive sentiment momentum detected.", type: "info" }
      ]
    }
  },
  overview: {
    title: 'Pulse Platform Overview',
    description: 'The core orchestration engine synthesizing environmental, financial, and social telemetry into a unified intelligence stream.',
    usage_js: `// Full platform initialization\nimport sdk from '@/lib/sdk';\nconst pulse = await sdk.getCityPulse(cityId);`,
    usage_py: `import requests\n# Fetch absolute city intelligence\nres = requests.get("http://localhost:3000/api/pulse")`,
    usage_php: `<?php\n// Strategic Urban Analysis\n$json = file_get_contents("http://localhost:3000/api/pulse");`,
    usage_cs: `// C# Core Integration\nvar data = await client.GetPulseAsync(city);`,
    output: {
      status: "Ready",
      engine: "Pulse_v2.0_Final",
      active_vectors: 12
    }
  }
};
