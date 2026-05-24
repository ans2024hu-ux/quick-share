import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  // Look up code key in Upstash database
  const fileInfo = await redis.get(code);

  if (!fileInfo) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 });
  }

  // Upstash natively handles the data retrieval object parse structure 
  return NextResponse.json(fileInfo);
}
