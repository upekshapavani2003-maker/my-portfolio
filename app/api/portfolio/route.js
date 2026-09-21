import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';
import { join } from 'path';

// Force Next.js to never cache this route — always fetch fresh from Redis
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DATA = join(process.cwd(), 'data/portfolio.json');
const KEY  = 'portfolio';

export async function GET() {
  try {
    let data;

    if (process.env.UPSTASH_REDIS_REST_URL) {
      const cached = await redis.get(KEY);
      if (cached) {
        data = cached;
      } else {
        // No Redis data yet — fall back to JSON file
        const raw = readFileSync(DATA, 'utf-8');
        data = JSON.parse(raw);
      }
    } else {
      // Local dev — read from JSON file
      const raw = readFileSync(DATA, 'utf-8');
      data = JSON.parse(raw);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type':  'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma':        'no-cache',
        'Expires':       '0',
      },
    });

  } catch {
    try {
      // Last resort fallback to file
      const raw = readFileSync(DATA, 'utf-8');
      return new Response(raw, {
        status: 200,
        headers: {
          'Content-Type':  'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch {
      return new Response(
        JSON.stringify({ error: 'Could not read data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}

export async function POST(request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();

    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redis.set(KEY, body);
    } else {
      const { writeFileSync } = await import('fs');
      writeFileSync(DATA, JSON.stringify(body, null, 2));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type':  'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch {
    return new Response(
      JSON.stringify({ error: 'Could not save data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}