import { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(request) {
  try {
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('cv');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File too large. Max 5MB' }, { status: 400 });
    }

    // Save to public/cv.pdf
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const savePath = join(process.cwd(), 'public', 'cv.pdf');
    writeFileSync(savePath, buffer);

    return Response.json({ success: true, path: '/cv.pdf' });

  } catch (err) {
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}