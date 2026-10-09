import { Redis } from '@upstash/redis';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const MAX_SIZE = 700 * 1024; // 700KB (the browser compresses before upload)

function detectType(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString() === 'PNG') return 'image/png';
  if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  return null;
}

export async function POST(request) {
  try {
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('photo');

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'Image too large after compression. Try a smaller image.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectType(buffer);

    if (!type) {
      return Response.json({ error: 'Only JPG, PNG or WebP images are allowed' }, { status: 400 });
    }

    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redis.set('profile_photo', { type, data: buffer.toString('base64') });
    } else {
      // Local dev: save to the public folder
      const dir = join(process.cwd(), 'public', 'images', 'profile');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'profile.jpg'), buffer);
    }

    return Response.json({ success: true, path: `/api/photo?v=${Date.now()}` });

  } catch (err) {
    console.error('Photo upload error:', err);
    return Response.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}