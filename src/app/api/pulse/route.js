import { NextResponse } from 'next/server';
import sdk from '@/lib/sdk';

/**
 * Universal Pulse API Route
 * Allows cross-origin/cross-platform access to city intelligence data.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const name = searchParams.get('name');
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));
  const radius = parseInt(searchParams.get('radius')) || 1000;
  const timezone = searchParams.get('timezone') || 'UTC';

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing coordinates (lat, lon) in query parameters.' },
      { status: 400 }
    );
  }

  try {
    const pulse = await sdk.getCityPulse({ name, lat, lon, timezone }, { radius });
    
    return NextResponse.json({
      success: true,
      data: pulse,
      metadata: {
        endpoint: '/api/pulse',
        api_version: sdk.version,
        city: name || 'Localized Signal',
        coordinates: [lat, lon],
        evaluation_model: 'PulseEvaluationEngine_v1.2'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Signal Error', message: error.message },
      { status: 500 }
    );
  }
}
