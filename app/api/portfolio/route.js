import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA = join(process.cwd(), 'data/portfolio.json');

export async function GET() {
  const raw = readFileSync(DATA, 'utf-8');
  return Response.json(JSON.parse(raw));
}

export async function POST(request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  writeFileSync(DATA, JSON.stringify(body, null, 2));
  return Response.json({ success: true });
}