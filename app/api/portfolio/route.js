import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';
import { join } from 'path';
export const dynamic = 'force-dynamic';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DATA = join(process.cwd(), 'data/portfolio.json');
const KEY  = 'portfolio';

export async function GET() {
  try {
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const cached = await redis.get(KEY);
      if (cached) return Response.json(cached);
    }
    const raw = readFileSync(DATA, 'utf-8');
    return Response.json(JSON.parse(raw));
  } catch {
    try {
      const raw = readFileSync(DATA, 'utf-8');
      return Response.json(JSON.parse(raw));
    } catch {
      return Response.json({ error: 'Could not read data' }, { status: 500 });
    }
  }
}

export async function POST(request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redis.set(KEY, body);
    } else {
      const { writeFileSync } = await import('fs');
      writeFileSync(DATA, JSON.stringify(body, null, 2));
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Could not save data' }, { status: 500 });
  }
}