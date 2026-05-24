import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Upload the file to cloud storage
    const blob = await put(file.name, file, { access: 'public' });

    // 2. Generate a random 6-digit code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 3. Save code mapping to the KV database (Expires in 24 hours)
    await kv.set(code, { url: blob.url, name: file.name }, { ex: 86400 });

    return NextResponse.json({ code });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
