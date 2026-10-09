import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  try {
    let buffer;
    let type = 'image/jpeg';

    if (process.env.UPSTASH_REDIS_REST_URL) {
      const stored = await redis.get('profile_photo');
      if (stored && stored.data) {
        buffer = Buffer.from(stored.data, 'base64');
        type = stored.type || 'image/jpeg';
      }
    }

    // Fallback: the default file in /public (also used in local dev)
    if (!buffer) {
      buffer = readFileSync(join(process.cwd(), 'public', 'images', 'profile', 'profile.jpg'));
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':   type,
        'Content-Length': String(buffer.length),
        'Cache-Control':  'public, max-age=0, must-revalidate',
      },
    });

  } catch (err) {
    console.error('Photo read error:', err);
    return new Response('Photo not found', { status: 404 });
  }
}