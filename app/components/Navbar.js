'use client';
import { useState, useEffect } from 'react';

export default function Navbar({ activeSection, onNavigate }) {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setThemeState(saved);
    document.body.className = saved + '-theme';
  }, []);

  function setTheme(name) {
    setThemeState(name);
    document.body.className = name + '-theme';
    localStorage.setItem('theme', name);
  }

  const navItems = [
    { id: 'home',      icon: 'fa-home',     label: 'Home' },
    { id: 'about',     icon: 'fa-user',     label: 'About' },
    { id: 'portfolio', icon: 'fa-briefcase',label: 'Portfolio' },
    { id: 'contact',   icon: 'fa-envelope', label: 'Contact' },
  ];

  return (
    <>
      {/* Theme switcher — top right */}
      <div className="theme-switcher-panel">
        <button id="btn-dark"
          className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}>
          <i className="fas fa-moon"></i>
        </button>
        <button id="btn-light"
          className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}>
          <i className="fas fa-sun"></i>
        </button>
      </div>

      {/* Vertical navbar — right side */}
      <nav className="vertical-navbar">
        {navItems.map(item => (
          <button key={item.id}
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}