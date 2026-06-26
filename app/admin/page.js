'use client';
import { useState } from 'react';
import Dashboard from './Dashboard';

export default function AdminPage() {
  const [pass, setPass]   = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true); setError('');
    const res  = await fetch('/api/portfolio');
    const data = await res.json();
    const test = await fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pass}`
      },
      body: JSON.stringify(data)
    });
    if (test.ok) setToken(pass);
    else setError('Wrong password.');
    setLoading(false);
  }

  if (token) return <Dashboard token={token} />;

  const box = {
    minHeight:'100vh', display:'flex',
    alignItems:'center', justifyContent:'center',
    background:'var(--bg-color)'
  };
  const card = {
    background:'var(--card-bg)', border:'1px solid var(--border-color)',
    borderRadius:'16px', padding:'2.5rem', width:'360px'
  };

  return (
    <div style={box}>
      <div style={card}>
        <h2 style={{color:'var(--text-primary)',marginBottom:'8px'}}>
          Admin <span style={{color:'var(--accent-color)'}}>Login</span>
        </h2>
        <p style={{color:'var(--text-secondary)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>
          Enter your password to edit your portfolio
        </p>
        <input type="password" placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key==='Enter' && login()}
          style={{
            width:'100%', padding:'12px 16px',
            background:'var(--bg-color)',
            border:'1px solid var(--border-color)',
            borderRadius:'10px', color:'var(--text-primary)',
            fontSize:'0.95rem', marginBottom:'12px', outline:'none'
          }}
        />
        {error && <p style={{color:'#e74c3c',fontSize:'0.85rem',marginBottom:'10px'}}>{error}</p>}
        <button onClick={login} disabled={loading} style={{
          width:'100%', padding:'12px',
          background:'var(--accent-color)', color:'#111',
          border:'none', borderRadius:'10px',
          fontWeight:'700', fontSize:'0.95rem', cursor:'pointer'
        }}>
          {loading ? 'Checking...' : 'Login →'}
        </button>
      </div>
    </div>
  );
}