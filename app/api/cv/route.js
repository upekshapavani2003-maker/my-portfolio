import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';
import { join } from 'path';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  try {
    let buffer;

    if (process.env.UPSTASH_REDIS_REST_URL) {
      // Production — read from Redis
      const base64 = await redis.get('cv_base64');

      if (!base64) {
        try {
          buffer = readFileSync(join(process.cwd(), 'public', 'cv.pdf'));
        } catch {
          return new Response('CV not found. Please upload your CV from the admin panel.', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      } else {
        buffer = Buffer.from(base64, 'base64');
      }
    } else {
      // Local dev — read from file system
      buffer = readFileSync(join(process.cwd(), 'public', 'cv.pdf'));
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': 'inline; filename="CV.pdf"', 
        'Cache-Control':       'no-cache, no-store, must-revalidate',
      },
    });

  } catch (err) {
    return new Response('CV not found', { status: 404 });
  }
}