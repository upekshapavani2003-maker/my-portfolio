import { Redis } from '@upstash/redis';
import { writeFileSync } from 'fs';
import { join } from 'path';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(request) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Get file ────────────────────────────────────────────────────────
    const formData = await request.formData();
    const file = formData.get('cv');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // ── Validate type — be flexible for mobile browsers ──────────────────
    const allowedTypes = [
      'application/pdf',
      'application/octet-stream', // some mobile browsers send this
      '',                          // some mobile browsers send empty type
    ];
    const fileName = file.name || '';
    const isPdf = allowedTypes.includes(file.type) || fileName.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // ── Validate size (max 5MB) ──────────────────────────────────────────
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File too large. Max 5MB' }, { status: 400 });
    }

    // ── Convert to base64 ────────────────────────────────────────────────
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // ── Save to Redis (works on Vercel) ──────────────────────────────────
    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redis.set('cv_base64', base64);
      await redis.set('cv_updated', new Date().toISOString());
    } else {
      // Local dev — save to file system
      const savePath = join(process.cwd(), 'public', 'cv.pdf');
      writeFileSync(savePath, buffer);
    }

    return Response.json({ success: true, path: '/api/cv' });

  } catch (err) {
    console.error('CV upload error:', err);
    return Response.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}