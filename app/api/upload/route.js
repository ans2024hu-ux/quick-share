import { put } from '@vercel/blob';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Upstash Redis client using the environment variables automatically added by Vercel
const redis = Redis.fromEnv();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Upload the file to Vercel Blob store
    const blob = await put(file.name, file, { access: 'public' });

    // 2. Generate a random 6-digit alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 3. Save mapping to Upstash Redis (Set to expire in 86400 seconds = 24 hours)
    await redis.set(code, JSON.stringify({ url: blob.url, name: file.name }), { ex: 86400 });

    return NextResponse.json({ code });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
