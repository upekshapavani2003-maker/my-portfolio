'use client';
import { useState } from 'react';
import Dashboard from './Dashboard';

export default function AdminPage() {
  const [pass, setPass]       = useState('');
  const [token, setToken]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(pass);
      } else {
        setError('Wrong password.');
      }
    } catch {
      setError('Something went wrong.');
    }

    setLoading(false);
  }

  if (token) return <Dashboard token={token} />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111'
    }}>
      <div style={{
        background: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '360px'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
          Admin <span style={{ color: '#ffb400' }}>Login</span>
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>
          Enter your password to edit your portfolio
        </p>
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{
            width: '100%', padding: '12px 16px',
            background: '#111',
            border: '1px solid #333',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.95rem',
            marginBottom: '12px',
            outline: 'none',
            fontFamily: 'Poppins, sans-serif'
          }}
        />
        {error && (
          <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '10px' }}>
            {error}
          </p>
        )}
        <button
          onClick={login}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            background: '#ffb400',
            color: '#111',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {loading ? 'Checking...' : 'Login →'}
        </button>
      </div>
    </div>
  );
}