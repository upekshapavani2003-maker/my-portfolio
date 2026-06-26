'use client';
import { useState, useEffect } from 'react';

// ─── shared inline style helpers ────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-color)',
    color: 'var(--text-primary)',
    fontFamily: "'Poppins','Segoe UI',sans-serif",
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '12px',
  },
  h1: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  accent: { color: 'var(--accent-color)' },
  headerBtns: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  savedMsg: { fontSize: '0.9rem', color: '#2ecc71', fontWeight: 600 },
  errMsg: { fontSize: '0.9rem', color: '#e74c3c', fontWeight: 600 },
  btnPrimary: {
    padding: '10px 26px',
    background: 'var(--accent-color)',
    color: '#111',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'opacity .2s',
  },
  btnOutline: {
    padding: '10px 20px',
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '30px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  // tabs
  tabRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0',
  },
  tab: (active) => ({
    padding: '10px 20px',
    background: 'transparent',
    color: active ? 'var(--accent-color)' : 'var(--text-secondary)',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent-color)' : '2px solid transparent',
    fontWeight: active ? 700 : 500,
    fontSize: '0.88rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all .2s',
    marginBottom: '-1px',
    fontFamily: 'inherit',
  }),
  // cards / sections
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '1.75rem',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--accent-color)',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  // grid layouts
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  // form elements
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 16px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    marginBottom: '16px',
    transition: 'border-color .2s',
  },
  textarea: {
    width: '100%',
    padding: '11px 16px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    minHeight: '90px',
    marginBottom: '16px',
  },
  select: {
    width: '100%',
    padding: '11px 16px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    marginBottom: '16px',
    cursor: 'pointer',
  },
  // item row (skill, stat, etc)
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    padding: '12px 14px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
  },
  itemLabel: {
    flex: 1,
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  rangeWrap: { flex: 1, display: 'flex', alignItems: 'center', gap: '10px' },
  range: { flex: 1, accentColor: 'var(--accent-color)' },
  pctBadge: {
    minWidth: '44px',
    textAlign: 'center',
    padding: '3px 10px',
    background: 'var(--accent-color)',
    color: '#111',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  deleteBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: '#e74c3c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
    fontFamily: 'inherit',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 20px',
    background: 'transparent',
    color: 'var(--accent-color)',
    border: '1px solid var(--accent-color)',
    borderRadius: '30px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    marginTop: '6px',
    fontFamily: 'inherit',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  badge: (type) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: type === 'work' ? 'rgba(255,180,0,0.15)' : 'rgba(100,180,255,0.15)',
    color: type === 'work' ? 'var(--accent-color)' : '#64b4ff',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }),
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border-color)',
    margin: '1.5rem 0',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-color)',
    color: 'var(--accent-color)',
    fontSize: '1.2rem',
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
};

// ─── small reusable field components ────────────────────────────────────────
function Field({ label, value, onChange, textarea, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {textarea ? (
        <textarea
          style={S.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          style={S.input}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── TAB: HERO ───────────────────────────────────────────────────────────────
function HeroTab({ data, set }) {
  const h = data.hero;
  const upd = (k, v) => set('hero', { ...h, [k]: v });
  return (
    <>
      <SectionCard title="Hero section" icon="🏠">
        <div style={S.grid2}>
          <Field label="Full name" value={h.name} onChange={(v) => upd('name', v)} />
          <Field label="Role / title" value={h.role} onChange={(v) => upd('role', v)} />
        </div>
        <Field
          label="Short description"
          value={h.description}
          onChange={(v) => upd('description', v)}
          textarea
          placeholder="I am a front-end developer focused on…"
        />
        <Field
          label="Profile photo URL or path (e.g. /profile.jpg)"
          value={h.photo}
          onChange={(v) => upd('photo', v)}
          placeholder="/profile.jpg"
        />
        {h.photo && (
          <div style={{ marginTop: '4px', marginBottom: '16px' }}>
            <img
              src={h.photo}
              alt="preview"
              style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--accent-color)' }}
            />
          </div>
        )}
      </SectionCard>
    </>
  );
}

// ─── TAB: ABOUT ──────────────────────────────────────────────────────────────
function AboutTab({ data, set }) {
  const a = data.about;
  const upd = (k, v) => set('about', { ...a, [k]: v });
  return (
    <>
      <SectionCard title="Personal info" icon="👤">
        <div style={S.grid2}>
          <Field label="First name" value={a.firstName} onChange={(v) => upd('firstName', v)} />
          <Field label="Last name" value={a.lastName} onChange={(v) => upd('lastName', v)} />
          <Field label="Age" value={a.age} onChange={(v) => upd('age', v)} placeholder="27 Years" />
          <Field label="Nationality" value={a.nationality} onChange={(v) => upd('nationality', v)} />
          <Field label="Freelance status" value={a.freelance} onChange={(v) => upd('freelance', v)} placeholder="Available" />
          <Field label="Address / location" value={a.address} onChange={(v) => upd('address', v)} />
        </div>
        <hr style={S.divider} />
        <div style={S.grid2}>
          <Field label="Phone" value={a.phone} onChange={(v) => upd('phone', v)} placeholder="+216 21 184 010" />
          <Field label="Email" value={a.email} onChange={(v) => upd('email', v)} type="email" />
          <Field label="Skype" value={a.skype} onChange={(v) => upd('skype', v)} />
          <Field label="Languages" value={a.languages} onChange={(v) => upd('languages', v)} placeholder="French, English" />
        </div>
        <hr style={S.divider} />
        <Field
          label="CV download link (e.g. /cv.pdf)"
          value={a.cvLink}
          onChange={(v) => upd('cvLink', v)}
          placeholder="/cv.pdf"
        />
      </SectionCard>
    </>
  );
}

// ─── TAB: STATS ──────────────────────────────────────────────────────────────
function StatsTab({ data, setArr, removeArr, addArr }) {
  return (
    <>
      <SectionCard title="Stats / counters" icon="📊">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          These are the 4 numbers shown in the About section (years, projects, customers, awards).
        </p>
        {data.stats.map((s, i) => (
          <div key={i} style={S.itemRow}>
            <div style={{ flex: 1 }}>
              <label style={{ ...S.label, marginBottom: '4px' }}>Number</label>
              <input
                style={{ ...S.input, marginBottom: 0, width: '80px' }}
                value={s.number}
                onChange={(e) => setArr('stats', i, 'number', e.target.value)}
              />
            </div>
            <div style={{ flex: 3 }}>
              <label style={{ ...S.label, marginBottom: '4px' }}>Label</label>
              <input
                style={{ ...S.input, marginBottom: 0 }}
                value={s.label}
                onChange={(e) => setArr('stats', i, 'label', e.target.value)}
                placeholder="Years of Experience"
              />
            </div>
            <button style={S.deleteBtn} onClick={() => removeArr('stats', i)} aria-label="Remove">×</button>
          </div>
        ))}
        <button style={S.addBtn} onClick={() => addArr('stats', { number: '0', label: 'New Stat' })}>
          + Add stat
        </button>
      </SectionCard>
    </>
  );
}

// ─── TAB: SKILLS ─────────────────────────────────────────────────────────────
function SkillsTab({ data, setArr, removeArr, addArr }) {
  return (
    <>
      <SectionCard title="Skills (circular progress)" icon="⚙️">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Drag the slider to update the percentage for each skill.
        </p>
        {data.skills.map((s, i) => (
          <div key={i} style={S.itemRow}>
            <input
              style={{ ...S.input, marginBottom: 0, flex: 1, minWidth: '100px' }}
              value={s.name}
              onChange={(e) => setArr('skills', i, 'name', e.target.value)}
              placeholder="Skill name"
            />
            <div style={S.rangeWrap}>
              <input
                type="range"
                min="0"
                max="100"
                style={S.range}
                value={s.percent}
                onChange={(e) => setArr('skills', i, 'percent', +e.target.value)}
              />
              <span style={S.pctBadge}>{s.percent}%</span>
            </div>
            <button style={S.deleteBtn} onClick={() => removeArr('skills', i)} aria-label="Remove">×</button>
          </div>
        ))}
        <button style={S.addBtn} onClick={() => addArr('skills', { name: 'New Skill', percent: 50 })}>
          + Add skill
        </button>
      </SectionCard>
    </>
  );
}

// ─── TAB: EXPERIENCE ─────────────────────────────────────────────────────────
function ExperienceTab({ data, setArr, removeArr, addArr }) {
  return (
    <>
      <SectionCard title="Work experience" icon="💼">
        {data.experience.filter((e) => e.type === 'work').map((exp) => {
          const i = data.experience.findIndex((x) => x.id === exp.id);
          return (
            <div key={exp.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={S.badge('work')}>Work</span>
                <button style={S.deleteBtn} onClick={() => removeArr('experience', i)} aria-label="Remove">×</button>
              </div>
              <div style={S.grid2}>
                <Field label="Job title / role" value={exp.role} onChange={(v) => setArr('experience', i, 'role', v)} />
                <Field label="Company / place" value={exp.place} onChange={(v) => setArr('experience', i, 'place', v)} />
                <Field label="Period (e.g. 2018 - PRESENT)" value={exp.period} onChange={(v) => setArr('experience', i, 'period', v)} />
              </div>
              <Field label="Description" value={exp.desc} onChange={(v) => setArr('experience', i, 'desc', v)} textarea />
            </div>
          );
        })}
        <button style={S.addBtn} onClick={() => addArr('experience', { id: Date.now(), type: 'work', period: '2024 - PRESENT', role: 'New Role', place: 'Company', desc: '' })}>
          + Add work experience
        </button>
      </SectionCard>

      <SectionCard title="Education" icon="🎓">
        {data.experience.filter((e) => e.type === 'education').map((exp) => {
          const i = data.experience.findIndex((x) => x.id === exp.id);
          return (
            <div key={exp.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={S.badge('education')}>Education</span>
                <button style={S.deleteBtn} onClick={() => removeArr('experience', i)} aria-label="Remove">×</button>
              </div>
              <div style={S.grid2}>
                <Field label="Degree / qualification" value={exp.role} onChange={(v) => setArr('experience', i, 'role', v)} />
                <Field label="University / institution" value={exp.place} onChange={(v) => setArr('experience', i, 'place', v)} />
                <Field label="Year (e.g. 2015)" value={exp.period} onChange={(v) => setArr('experience', i, 'period', v)} />
              </div>
              <Field label="Description" value={exp.desc} onChange={(v) => setArr('experience', i, 'desc', v)} textarea />
            </div>
          );
        })}
        <button style={S.addBtn} onClick={() => addArr('experience', { id: Date.now(), type: 'education', period: '2024', role: 'New Degree', place: 'University', desc: '' })}>
          + Add education
        </button>
      </SectionCard>
    </>
  );
}

// ─── TAB: PROJECTS ───────────────────────────────────────────────────────────
function ProjectsTab({ data, setArr, removeArr, addArr }) {
  return (
    <>
      <SectionCard title="Portfolio projects" icon="🖼️">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          These appear in the portfolio grid. Clicking a card opens the lightbox modal.
        </p>
        {data.projects.map((proj, i) => (
          <div key={proj.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ ...S.badge('work'), background: 'rgba(255,180,0,0.1)' }}>Project #{i + 1}</span>
              <button style={S.deleteBtn} onClick={() => removeArr('projects', i)} aria-label="Remove">×</button>
            </div>
            <div style={S.grid2}>
              <Field label="Title" value={proj.title} onChange={(v) => setArr('projects', i, 'title', v)} />
              <Field label="Category" value={proj.category} onChange={(v) => setArr('projects', i, 'category', v)} placeholder="Website / UI/UX / Branding…" />
              <Field label="Client" value={proj.client} onChange={(v) => setArr('projects', i, 'client', v)} />
              <Field label="Languages / tools used" value={proj.languages} onChange={(v) => setArr('projects', i, 'languages', v)} placeholder="HTML, CSS, JavaScript" />
            </div>
            <Field label="Project URL (shown in lightbox)" value={proj.url} onChange={(v) => setArr('projects', i, 'url', v)} placeholder="https://www.envato.com" />
            <div style={S.grid2}>
              <Field label="Thumbnail image URL (grid card)" value={proj.thumb} onChange={(v) => setArr('projects', i, 'thumb', v)} placeholder="https://…?w=600" />
              <Field label="Full image URL (lightbox modal)" value={proj.image} onChange={(v) => setArr('projects', i, 'image', v)} placeholder="https://…?w=800" />
            </div>
            {proj.thumb && (
              <div style={{ marginTop: '-8px', marginBottom: '8px' }}>
                <img src={proj.thumb} alt="thumb" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
              </div>
            )}
          </div>
        ))}
        <button
          style={S.addBtn}
          onClick={() => addArr('projects', {
            id: Date.now(),
            title: 'New Project',
            category: 'Website',
            client: 'Client Name',
            languages: 'HTML, CSS, JS',
            url: 'https://example.com',
            image: 'https://via.placeholder.com/800x500',
            thumb: 'https://via.placeholder.com/600x400',
          })}
        >
          + Add project
        </button>
      </SectionCard>
    </>
  );
}

// ─── TAB: CONTACT ────────────────────────────────────────────────────────────
function ContactTab({ data, set }) {
  const c = data.contact;
  const upd = (k, v) => set('contact', { ...c, [k]: v });
  const updSocial = (k, v) => set('contact', { ...c, social: { ...c.social, [k]: v } });

  return (
    <>
      <SectionCard title="Contact details" icon="✉️">
        <div style={S.grid2}>
          <Field label="Email address" value={c.email} onChange={(v) => upd('email', v)} type="email" />
          <Field label="Phone number" value={c.phone} onChange={(v) => upd('phone', v)} placeholder="+216 21 184 010" />
        </div>
        <Field
          label="Intro paragraph (shown above email/phone)"
          value={c.intro}
          onChange={(v) => upd('intro', v)}
          textarea
          placeholder="Feel free to get in touch with me…"
        />
      </SectionCard>

      <SectionCard title="Social links" icon="🔗">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Paste the full URL for each platform. Leave as # to hide.
        </p>
        <div style={S.grid2}>
          {Object.entries(c.social).map(([platform, url]) => (
            <div key={platform}>
              <label style={S.label}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>
                  {platform === 'facebook' ? '📘' : platform === 'twitter' ? '🐦' : platform === 'youtube' ? '📺' : '🎯'}
                </span>
                <input
                  style={{ ...S.input, marginBottom: 0 }}
                  value={url}
                  onChange={(e) => updSocial(platform, e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div style={{ height: '16px' }} />
            </div>
          ))}
        </div>
        <hr style={S.divider} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          To add a new platform, manually add a key to the <code>social</code> object in <code>portfolio.json</code>.
          The icon uses Font Awesome's <code>fab fa-[platform]</code> class, so the key must match exactly
          (e.g. <code>instagram</code>, <code>linkedin</code>, <code>dribbble</code>).
        </p>
      </SectionCard>
    </>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard({ token }) {
  const [data, setData]     = useState(null);
  const [tab, setTab]       = useState('hero');
  const [msg, setMsg]       = useState('');
  const [msgType, setMsgType] = useState('ok'); // 'ok' | 'err'

  // load data once
  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then(setData)
      .catch(() => showMsg('Failed to load data', 'err'));
  }, []);

  function showMsg(text, type = 'ok') {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  }

  // top-level field setter
  function set(key, value) {
    setData((d) => ({ ...d, [key]: value }));
  }

  // array item field setter
  function setArr(key, index, field, value) {
    setData((d) => {
      const arr = [...d[key]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...d, [key]: arr };
    });
  }

  // remove item from array
  function removeArr(key, index) {
    setData((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== index) }));
  }

  // add item to array
  function addArr(key, item) {
    setData((d) => ({ ...d, [key]: [...d[key], item] }));
  }

  async function save() {
    showMsg('Saving…', 'ok');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) showMsg('✓ Changes saved!', 'ok');
      else showMsg('Save failed — check your password', 'err');
    } catch {
      showMsg('Network error', 'err');
    }
  }

  if (!data) {
    return <div style={S.loading}>Loading…</div>;
  }

  const TABS = [
    { id: 'hero',       label: 'Hero' },
    { id: 'about',      label: 'About' },
    { id: 'stats',      label: 'Stats' },
    { id: 'skills',     label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects',   label: 'Projects' },
    { id: 'contact',    label: 'Contact' },
  ];

  return (
    <div style={S.page}>

      {/* ── header ── */}
      <div style={S.header}>
        <h1 style={S.h1}>
          Portfolio <span style={S.accent}>CMS</span>
        </h1>
        <div style={S.headerBtns}>
          {msg && (
            <span style={msgType === 'ok' ? S.savedMsg : S.errMsg}>{msg}</span>
          )}
          <a href="/" style={S.btnOutline}>
            ← View site
          </a>
          <button style={S.btnPrimary} onClick={save}>
            Save changes
          </button>
        </div>
      </div>

      {/* ── tabs ── */}
      <div style={S.tabRow}>
        {TABS.map((t) => (
          <button
            key={t.id}
            style={S.tab(tab === t.id)}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── tab content ── */}
      {tab === 'hero'       && <HeroTab       data={data} set={set} />}
      {tab === 'about'      && <AboutTab      data={data} set={set} />}
      {tab === 'stats'      && <StatsTab      data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'skills'     && <SkillsTab     data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'experience' && <ExperienceTab data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'projects'   && <ProjectsTab   data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'contact'    && <ContactTab    data={data} set={set} />}

      {/* ── floating save bar (bottom) ── */}
      <div style={{
        position: 'sticky',
        bottom: '1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '2rem',
      }}>
        <button style={{ ...S.btnPrimary, boxShadow: '0 4px 20px rgba(255,180,0,0.3)' }} onClick={save}>
          Save changes ↑
        </button>
      </div>

    </div>
  );
}