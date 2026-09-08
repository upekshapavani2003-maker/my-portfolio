export async function POST(request) {
  try {
    const { token, name, email, subject, message } = await request.json();

    // ── Step 1: Verify reCAPTCHA token ──────────────────────────────────
    if (!token) {
      return Response.json({ error: 'reCAPTCHA token missing' }, { status: 400 });
    }

    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return Response.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    // ── Step 2: Forward to Formspree ─────────────────────────────────────
    const formData = new FormData();
    formData.append('name',    name);
    formData.append('email',   email);
    formData.append('subject', subject);
    formData.append('message', message);

    const formspreeRes = await fetch('https://formspree.io/f/mdaqangw', {
      method:  'POST',
      body:    formData,
      headers: { Accept: 'application/json' },
    });

    if (formspreeRes.ok) {
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Failed to send message' }, { status: 500 });

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}