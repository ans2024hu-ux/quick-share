import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  // Find the file information matching the 6-digit code
  const fileInfo = await kv.get(code);

  if (!fileInfo) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 });
  }

  return NextResponse.json(fileInfo);
}
