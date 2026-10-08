import { Redis } from '@upstash/redis';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel limits request bodies to ~4.5MB)

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

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // ── Validate type: flexible for mobile browsers ─────────────────────
    const allowedTypes = [
      'application/pdf',
      'application/octet-stream', // some mobile browsers send this
      '',                         // some mobile browsers send an empty type
    ];
    const fileName = (file.name || '').toLowerCase();
    const isPdf = allowedTypes.includes(file.type) || fileName.endsWith('.pdf');

    if (!isPdf) {
      return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // ── Validate size ───────────────────────────────────────────────────
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File too large. Max 4MB' }, { status: 400 });
    }

    // ── Convert to buffer ───────────────────────────────────────────────
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── Check the file really is a PDF (starts with %PDF) ───────────────
    if (buffer.subarray(0, 4).toString() !== '%PDF') {
      return Response.json({ error: 'This file is not a valid PDF' }, { status: 400 });
    }

    const base64 = buffer.toString('base64');

    // ── Save: Redis in production, file system in local dev ─────────────
    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redis.set('cv_base64', base64);
      await redis.set('cv_updated', new Date().toISOString());
    } else {
      const savePath = join(process.cwd(), 'public', 'cv.pdf');
      writeFileSync(savePath, buffer);
    }

    return Response.json({ success: true, path: '/api/cv' });

  } catch (err) {
    console.error('CV upload error:', err);
    return Response.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}