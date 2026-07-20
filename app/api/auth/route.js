export async function POST(request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_SECRET) {
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Wrong password' }, { status: 401 });
}