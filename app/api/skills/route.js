import { readFileSync } from 'fs';
import { join } from 'path';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = readFileSync(
      join(process.cwd(), 'data/portfolio_skill_pool.json'),
      'utf-8'
    );
    const data = JSON.parse(raw);

    // Group skills by category → { "Category": ["skill1","skill2"] }
    const grouped = {};
    for (const skill of data.skills) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill.name);
    }

    return Response.json(grouped);
  } catch (err) {
    return Response.json({ error: 'Could not read skills' }, { status: 500 });
  }
}