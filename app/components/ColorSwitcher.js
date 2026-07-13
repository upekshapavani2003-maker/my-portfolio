'use client';
import { useState, useEffect } from 'react';

const COLORS = [
  { name: 'Yellow',  value: '#ffb400' },
  { name: 'Red',     value: '#e74c3c' },
  { name: 'Purple',  value: '#9b59b6' },
  { name: 'Blue',    value: '#2980b9' },
  { name: 'Orange',  value: '#e67e22' },
  { name: 'Pink',    value: '#e91e8c' },
  { name: 'Green',   value: '#27ae60' },
  { name: 'Cyan',    value: '#00bcd4' },
  { name: 'Indigo',  value: '#3f51b5' },
  { name: 'Teal',    value: '#009688' },
  { name: 'Lime',    value: '#8bc34a' },
  { name: 'Amber',   value: '#ff9800' },
];

export default function ColorSwitcher() {
  const [open, setOpen]   = useState(false);
  const [active, setActive] = useState('#ffb400');

  useEffect(() => {
    const saved = localStorage.getItem('accent-color') || '#ffb400';
    setActive(saved);
    document.documentElement.style.setProperty('--accent-color', saved);
  }, []);

  function applyColor(color) {
    setActive(color);
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accent-color', color);
  }

  return (
    <>
      {/* Toggle button — gear icon */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Color switcher"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'var(--accent-color)',
          border: 'none',
          color: '#111',
          fontSize: '18px',
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          transition: 'transform 0.3s',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      >
        <i className="fas fa-palette"></i>
      </button>

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: '20px',
        width: '220px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '18px',
        zIndex: 1999,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        transform: open ? 'translateX(0) scale(1)' : 'translateX(-110%) scale(0.95)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.25,1,0.5,1), opacity 0.3s ease',
        transformOrigin: 'top left',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--text-secondary)',
          }}>
            Color Switcher
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              padding: '0',
            }}
          >
            ×
          </button>
        </div>

        {/* Color grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
        }}>
          {COLORS.map(c => (
            <button
              key={c.value}
              title={c.name}
              onClick={() => applyColor(c.value)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: c.value,
                border: active === c.value
                  ? '3px solid var(--text-primary)'
                  : '3px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.2s, border 0.2s',
                transform: active === c.value ? 'scale(1.2)' : 'scale(1)',
                outline: 'none',
                boxShadow: active === c.value
                  ? `0 0 0 2px var(--bg-color), 0 0 0 4px ${c.value}`
                  : 'none',
              }}
            />
          ))}
        </div>

        {/* Current color label */}
        <div style={{
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: active,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
          }}>
            {active.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Backdrop to close on outside click */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1998,
          }}
        />
      )}
    </>
  );
}