'use client';
import { useState, useEffect } from 'react';

const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Proficient', 'Conversational', 'Basic'];

// ─── shared styles ────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)',
    fontFamily: "'Poppins','Segoe UI',sans-serif", padding: '1rem', paddingBottom: '6rem',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' },
  h1: { fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' },
  accent: { color: 'var(--accent-color)' },
  btnPrimary: {
    padding: '11px 24px', background: 'var(--accent-color)', color: '#111', border: 'none',
    borderRadius: '30px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
    textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(255,180,0,0.3)',
  },
  btnOutline: {
    padding: '11px 18px', background: 'transparent', color: 'var(--text-primary)',
    border: '1px solid var(--border-color)', borderRadius: '30px', fontWeight: 600,
    fontSize: '0.82rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
  },
  tabRow: { display: 'flex', gap: '4px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' },
  tab: (active) => ({
    padding: '8px 14px', background: 'transparent',
    color: active ? 'var(--accent-color)' : 'var(--text-secondary)', border: 'none',
    borderBottom: active ? '2px solid var(--accent-color)' : '2px solid transparent',
    fontWeight: active ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer',
    textTransform: 'uppercase', letterSpacing: '1px', transition: 'all .2s',
    marginBottom: '-1px', fontFamily: 'inherit', whiteSpace: 'nowrap',
  }),
  card: { background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' },
  label: { display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '5px' },
  input: {
    width: '100%', padding: '10px 14px', background: 'var(--bg-color)',
    border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', marginBottom: '14px', transition: 'border-color .2s',
  },
  textarea: {
    width: '100%', padding: '10px 14px', background: 'var(--bg-color)',
    border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '80px', marginBottom: '14px',
  },
  select: {
    width: '100%', padding: '10px 14px', background: 'var(--bg-color)',
    border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', marginBottom: '14px', cursor: 'pointer',
  },
  itemRow: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
    padding: '10px 12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)',
    borderRadius: '8px', flexWrap: 'wrap',
  },
  rangeWrap: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' },
  range: { flex: 1, accentColor: 'var(--accent-color)' },
  pctBadge: { minWidth: '42px', textAlign: 'center', padding: '3px 8px', background: 'var(--accent-color)', color: '#111', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 },
  deleteBtn: {
    width: '30px', height: '30px', borderRadius: '50%', background: 'transparent',
    border: '1px solid var(--border-color)', color: '#e74c3c', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, fontFamily: 'inherit',
  },
  addBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px',
    background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)',
    borderRadius: '30px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
    fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '1px',
  },
  badge: (type) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
    background: type === 'work' ? 'rgba(255,180,0,0.15)' : 'rgba(100,180,255,0.15)',
    color: type === 'work' ? 'var(--accent-color)' : '#64b4ff', textTransform: 'uppercase', letterSpacing: '1px',
  }),
  divider: { border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' },
  sectionLabel: {
    fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
    color: 'var(--accent-color)', marginBottom: '12px', marginTop: '4px',
    paddingBottom: '6px', borderBottom: '1px solid var(--border-color)',
  },
  loading: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-color)', color: 'var(--accent-color)', fontSize: '1.1rem',
    fontFamily: "'Poppins',sans-serif", fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
  },
};

// ─── reusable components ──────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {textarea
        ? <textarea style={S.textarea} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        : <input style={S.input} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      <select style={S.select} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={S.card}>
      <div style={S.cardTitle}><span style={{ fontSize: '1rem' }}>{icon}</span>{title}</div>
      {children}
    </div>
  );
}

// ─── TAB: HERO ───────────────────────────────────────────────────────────────
function HeroTab({ data, set }) {
  const h = data.hero;
  const upd = (k, v) => set('hero', { ...h, [k]: v });
  return (
    <SectionCard title="Hero section" icon="🏠">
      <div style={S.grid2}>
        <Field label="Full name" value={h.name} onChange={(v) => upd('name', v)} />
        <Field label="Role / title" value={h.role} onChange={(v) => upd('role', v)} />
      </div>
      <Field label="Short description" value={h.description} onChange={(v) => upd('description', v)} textarea />
      <Field label="Profile photo path (e.g. /images/profile/profile.jpg)" value={h.photo} onChange={(v) => upd('photo', v)} placeholder="/images/profile/profile.jpg" />
      {h.photo && (
        <div style={{ marginTop: '4px', marginBottom: '14px' }}>
          <img src={h.photo} alt="preview" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--accent-color)' }} />
        </div>
      )}
    </SectionCard>
  );
}

// ─── TAB: ABOUT ──────────────────────────────────────────────────────────────
function AboutTab({ data, set }) {
  const a = data.about;
  const upd = (k, v) => set('about', { ...a, [k]: v });
  const langs = Array.isArray(a.languages) ? a.languages : [];

  function updateLang(i, field, val) {
    const arr = [...langs]; arr[i] = { ...arr[i], [field]: val }; upd('languages', arr);
  }
  function removeLang(i) { upd('languages', langs.filter((_, idx) => idx !== i)); }
  function addLang() { upd('languages', [...langs, { name: '', level: 'Fluent' }]); }

  const levelColors = {
    Native: { bg: 'rgba(39,174,96,0.2)', color: '#27ae60' },
    Fluent: { bg: 'rgba(255,180,0,0.2)', color: 'var(--accent-color)' },
    Proficient: { bg: 'rgba(100,180,255,0.2)', color: '#64b4ff' },
    Conversational: { bg: 'rgba(155,89,182,0.2)', color: '#9b59b6' },
    Basic: { bg: 'rgba(150,150,150,0.2)', color: 'var(--text-secondary)' },
  };

  return (
    <>
      <SectionCard title="Personal info" icon="👤">

        <div style={S.sectionLabel}>Basic details</div>
        <div style={S.grid3}>
          <Field label="First name" value={a.firstName} onChange={(v) => upd('firstName', v)} />
          <Field label="Last name" value={a.lastName} onChange={(v) => upd('lastName', v)} />
          <Field label="Age" value={a.age} onChange={(v) => upd('age', v)} placeholder="27 Years" />
          <SelectField label="Gender" value={a.gender || ''} onChange={(v) => upd('gender', v)} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
          <Field label="Nationality" value={a.nationality} onChange={(v) => upd('nationality', v)} />
          <Field label="Freelance status" value={a.freelance} onChange={(v) => upd('freelance', v)} placeholder="Available" />
        </div>

        <hr style={S.divider} />

        <div style={S.sectionLabel}>Phone number</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 160px) 1fr', gap: '12px' }}>
          <div>
            <label style={S.label}>Country code</label>
            <input style={S.input} value={a.phoneCode ?? ''} onChange={(e) => upd('phoneCode', e.target.value)} placeholder="+94" />
          </div>
          <div>
            <label style={S.label}>Phone number</label>
            <input style={S.input} value={a.phoneNumber ?? ''} onChange={(e) => upd('phoneNumber', e.target.value)} placeholder="77 000 0000" />
          </div>
        </div>

        <hr style={S.divider} />

        <div style={S.sectionLabel}>Contact & online</div>
        <div style={S.grid2}>
          <Field label="Email" value={a.email} onChange={(v) => upd('email', v)} type="email" />
          <Field label="Skype" value={a.skype} onChange={(v) => upd('skype', v)} />
        </div>

        <hr style={S.divider} />

        <div style={S.sectionLabel}>Address</div>
        <Field label="Address line 1 (Street / House no.)" value={a.addressLine1 ?? ''} onChange={(v) => upd('addressLine1', v)} placeholder="123 Main Street" />
        <Field label="Address line 2 (Area / District — optional)" value={a.addressLine2 ?? ''} onChange={(v) => upd('addressLine2', v)} placeholder="Colombo 03" />
        <div style={S.grid3}>
          <Field label="City" value={a.city ?? ''} onChange={(v) => upd('city', v)} placeholder="Colombo" />
          <Field label="Postal code" value={a.postalCode ?? ''} onChange={(v) => upd('postalCode', v)} placeholder="00300" />
          <Field label="Country" value={a.country ?? ''} onChange={(v) => upd('country', v)} placeholder="Sri Lanka" />
        </div>

        <hr style={S.divider} />

        <div style={S.sectionLabel}>Languages</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Add all languages you speak and set a proficiency level for each.
        </p>
        {langs.length === 0 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>No languages added yet.</p>
        )}
        {langs.map((lang, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 160px' }}>
              <label style={S.label}>Language {i + 1}</label>
              <input style={{ ...S.input, marginBottom: 0 }} value={lang.name} onChange={(e) => updateLang(i, 'name', e.target.value)} placeholder="e.g. English" />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label style={S.label}>Level</label>
              <select style={{ ...S.select, marginBottom: 0 }} value={lang.level} onChange={(e) => updateLang(i, 'level', e.target.value)}>
                {LANGUAGE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ flexShrink: 0, marginBottom: '2px' }}>
              <span style={{
                display: 'inline-block', padding: '5px 12px', borderRadius: '20px',
                fontSize: '0.75rem', fontWeight: 600,
                background: levelColors[lang.level]?.bg || 'rgba(150,150,150,0.2)',
                color: levelColors[lang.level]?.color || 'var(--text-secondary)',
                border: '1px solid currentColor',
              }}>{lang.level}</span>
            </div>
            <button style={{ ...S.deleteBtn, flexShrink: 0 }} onClick={() => removeLang(i)}>×</button>
          </div>
        ))}
        <button style={{ ...S.addBtn, marginTop: '6px' }} onClick={addLang}>+ Add language</button>

        <hr style={S.divider} />

        <div style={S.sectionLabel}>CV</div>
        <Field label="CV download link (e.g. /cv.pdf)" value={a.cvLink} onChange={(v) => upd('cvLink', v)} placeholder="/cv.pdf" />

      </SectionCard>
    </>
  );
}

// ─── TAB: STATS ──────────────────────────────────────────────────────────────
function StatsTab({ data, setArr, removeArr, addArr }) {
  return (
    <SectionCard title="Stats / counters" icon="📊">
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>The 4 numbers shown in the About section.</p>
      {data.stats.map((s, i) => (
        <div key={i} style={S.itemRow}>
          <div style={{ width: '70px', flexShrink: 0 }}>
            <label style={{ ...S.label, marginBottom: '3px' }}>No.</label>
            <input style={{ ...S.input, marginBottom: 0, width: '100%', padding: '8px 10px' }} value={s.number} onChange={(e) => setArr('stats', i, 'number', e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ ...S.label, marginBottom: '3px' }}>Label</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={s.label} onChange={(e) => setArr('stats', i, 'label', e.target.value)} placeholder="Years of Experience" />
          </div>
          <button style={{ ...S.deleteBtn, marginTop: '18px' }} onClick={() => removeArr('stats', i)}>×</button>
        </div>
      ))}
      <button style={S.addBtn} onClick={() => addArr('stats', { number: '0', label: 'New Stat' })}>+ Add stat</button>
    </SectionCard>
  );
}

// ─── TAB: SKILLS — loads from /api/skills dynamically ────────────────────────
function SkillsTab({ data, set, setArr, removeArr, addArr }) {
  const [skillPool, setSkillPool]     = useState({});
  const [poolLoading, setPoolLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedPct, setSelectedPct]     = useState(50);
  const [searchQuery, setSearchQuery]     = useState('');

  // Load skill pool from API on mount
  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => { setSkillPool(d); setPoolLoading(false); })
      .catch(() => setPoolLoading(false));
  }, []);

  const categories     = Object.keys(skillPool).sort();
  const activeCategory = data.profession || categories[0] || '';
  const categorySkills = skillPool[activeCategory] || [];
  const alreadyAdded   = data.skills.map(s => s.name);

  // Filter by search and remove already added
  const filteredSkills = categorySkills
    .filter(s => !alreadyAdded.includes(s))
    .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  // Reset selected skill when category changes
  useEffect(() => { setSelectedSkill(''); setSearchQuery(''); }, [activeCategory]);

  function handleAdd() {
    if (!selectedSkill) return;
    addArr('skills', { name: selectedSkill, percent: selectedPct });
    setSelectedSkill('');
    setSelectedPct(50);
    setSearchQuery('');
  }

  return (
    <SectionCard title="Skills (circular progress)" icon="⚙️">

      {/* Step 1 — Category selector (loaded from JSON) */}
      <div style={{ marginBottom: '1.25rem', padding: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
        <label style={S.label}>Step 1 — Select a skill category</label>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          {poolLoading ? 'Loading categories from skill pool…' : `${categories.length} categories · ${Object.values(skillPool).flat().length} total skills loaded from portfolio_skill_pool.json`}
        </p>
        <select
          style={{ ...S.select, marginBottom: '8px' }}
          value={activeCategory}
          onChange={(e) => set('profession', e.target.value)}
          disabled={poolLoading}
        >
          <option value="">— Select category —</option>
          {categories.map(c => (
            <option key={c} value={c}>{c} ({skillPool[c]?.length || 0} skills)</option>
          ))}
        </select>

        {/* Preview chips */}
        {categorySkills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {categorySkills.slice(0, 5).map(s => (
              <span key={s} style={{ fontSize: '0.7rem', padding: '2px 9px', borderRadius: '20px', background: 'rgba(255,180,0,0.1)', color: 'var(--accent-color)', border: '1px solid rgba(255,180,0,0.2)' }}>{s}</span>
            ))}
            {categorySkills.length > 5 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '2px 6px' }}>+{categorySkills.length - 5} more</span>
            )}
          </div>
        )}
      </div>

      {/* Step 2 — Current skills list */}
      <label style={{ ...S.label, marginBottom: '8px' }}>Step 2 — Your current skills (drag slider to adjust %)</label>
      {data.skills.length === 0 && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>No skills added yet. Use Step 3 below to add one.</p>
      )}
      {data.skills.map((s, i) => (
        <div key={i} style={S.itemRow}>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', flex: '0 0 auto', minWidth: '120px' }}>{s.name}</span>
          <div style={S.rangeWrap}>
            <input type="range" min="0" max="100" style={S.range} value={s.percent} onChange={(e) => setArr('skills', i, 'percent', +e.target.value)} />
            <span style={S.pctBadge}>{s.percent}%</span>
          </div>
          <button style={S.deleteBtn} onClick={() => removeArr('skills', i)}>×</button>
        </div>
      ))}

      {/* Step 3 — Add skill with search */}
      <div style={{ marginTop: '1rem', padding: '14px', background: 'var(--bg-color)', border: '1px dashed var(--accent-color)', borderRadius: '10px' }}>
        <label style={S.label}>Step 3 — Add a skill from "{activeCategory || 'select a category above'}"</label>

        {!activeCategory ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Please select a category in Step 1 first.</p>
        ) : filteredSkills.length === 0 && !searchQuery ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>All skills from this category are already added!</p>
        ) : (
          <>
            {/* Search box */}
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                style={{ ...S.input, marginBottom: 0, paddingLeft: '36px' }}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedSkill(''); }}
                placeholder={`Search in ${activeCategory}…`}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '14px' }}>🔍</span>
            </div>

            {/* Skill dropdown */}
            <select
              style={{ ...S.select, marginBottom: '10px' }}
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">— Select a skill ({filteredSkills.length} available) —</option>
              {filteredSkills.map(sk => <option key={sk} value={sk}>{sk}</option>)}
            </select>

            {filteredSkills.length === 0 && searchQuery && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>No skills match "{searchQuery}"</p>
            )}

            {/* Percentage slider */}
            <label style={S.label}>Set percentage</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <input type="range" min="0" max="100" style={{ ...S.range, flex: 1 }} value={selectedPct} onChange={(e) => setSelectedPct(+e.target.value)} />
              <span style={S.pctBadge}>{selectedPct}%</span>
            </div>

            {/* Preview */}
            {selectedSkill && (
              <div style={{ marginBottom: '10px', padding: '8px 12px', background: 'var(--card-bg)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Will add: <strong style={{ color: 'var(--accent-color)' }}>{selectedSkill}</strong> at <strong style={{ color: 'var(--accent-color)' }}>{selectedPct}%</strong>
              </div>
            )}

            <button style={{ ...S.addBtn, opacity: selectedSkill ? 1 : 0.5 }} onClick={handleAdd} disabled={!selectedSkill}>
              + Add skill
            </button>
          </>
        )}
      </div>
    </SectionCard>
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
            <div key={exp.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={S.badge('work')}>Work</span>
                <button style={S.deleteBtn} onClick={() => removeArr('experience', i)}>×</button>
              </div>
              <div style={S.grid2}>
                <Field label="Job title" value={exp.role} onChange={(v) => setArr('experience', i, 'role', v)} />
                <Field label="Company" value={exp.place} onChange={(v) => setArr('experience', i, 'place', v)} />
                <Field label="Period (e.g. 2018 - PRESENT)" value={exp.period} onChange={(v) => setArr('experience', i, 'period', v)} />
              </div>
              <Field label="Description" value={exp.desc} onChange={(v) => setArr('experience', i, 'desc', v)} textarea />
            </div>
          );
        })}
        <button style={S.addBtn} onClick={() => addArr('experience', { id: Date.now(), type: 'work', period: '2024 - PRESENT', role: 'New Role', place: 'Company', desc: '' })}>+ Add work experience</button>
      </SectionCard>

      <SectionCard title="Education" icon="🎓">
        {data.experience.filter((e) => e.type === 'education').map((exp) => {
          const i = data.experience.findIndex((x) => x.id === exp.id);
          return (
            <div key={exp.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={S.badge('education')}>Education</span>
                <button style={S.deleteBtn} onClick={() => removeArr('experience', i)}>×</button>
              </div>
              <div style={S.grid2}>
                <Field label="Degree" value={exp.role} onChange={(v) => setArr('experience', i, 'role', v)} />
                <Field label="University" value={exp.place} onChange={(v) => setArr('experience', i, 'place', v)} />
                <Field label="Year" value={exp.period} onChange={(v) => setArr('experience', i, 'period', v)} />
              </div>
              <Field label="Description" value={exp.desc} onChange={(v) => setArr('experience', i, 'desc', v)} textarea />
            </div>
          );
        })}
        <button style={S.addBtn} onClick={() => addArr('experience', { id: Date.now(), type: 'education', period: '2024', role: 'New Degree', place: 'University', desc: '' })}>+ Add education</button>
      </SectionCard>
    </>
  );
}

// ─── TAB: VOLUNTEER ──────────────────────────────────────────────────────────
function VolunteerTab({ data, setArr, removeArr, addArr }) {
  return (
    <SectionCard title="Volunteer Work" icon="🤝">
      {(data.volunteer || []).map((v, i) => (
        <div key={v.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ ...S.badge('work'), background: 'rgba(39,174,96,0.15)', color: '#27ae60' }}>Volunteer #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => removeArr('volunteer', i)}>×</button>
          </div>
          <div style={S.grid2}>
            <Field label="Role / Position" value={v.role} onChange={(val) => setArr('volunteer', i, 'role', val)} />
            <Field label="Organization" value={v.organization} onChange={(val) => setArr('volunteer', i, 'organization', val)} />
            <Field label="Period" value={v.period} onChange={(val) => setArr('volunteer', i, 'period', val)} placeholder="2022 - 2023" />
          </div>
          <Field label="Description" value={v.desc} onChange={(val) => setArr('volunteer', i, 'desc', val)} textarea />
        </div>
      ))}
      <button style={S.addBtn} onClick={() => addArr('volunteer', { id: Date.now(), role: 'New Role', organization: 'Organization', period: '2024', desc: '' })}>+ Add volunteer work</button>
    </SectionCard>
  );
}

// ─── TAB: PROJECTS ───────────────────────────────────────────────────────────
function ProjectsTab({ data, setArr, removeArr, addArr }) {
  return (
    <SectionCard title="Portfolio projects" icon="🖼️">
      {data.projects.map((proj, i) => (
        <div key={proj.id} style={{ ...S.card, background: 'var(--bg-color)', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ ...S.badge('work'), background: 'rgba(255,180,0,0.1)' }}>Project #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => removeArr('projects', i)}>×</button>
          </div>
          <div style={S.grid2}>
            <Field label="Title" value={proj.title} onChange={(v) => setArr('projects', i, 'title', v)} />
            <Field label="Category" value={proj.category} onChange={(v) => setArr('projects', i, 'category', v)} />
            <Field label="Client" value={proj.client} onChange={(v) => setArr('projects', i, 'client', v)} />
            <Field label="Tools used" value={proj.languages} onChange={(v) => setArr('projects', i, 'languages', v)} />
          </div>
          <Field label="Project URL" value={proj.url} onChange={(v) => setArr('projects', i, 'url', v)} placeholder="https://example.com" />
          <div style={S.grid2}>
            <Field label="Thumbnail URL" value={proj.thumb} onChange={(v) => setArr('projects', i, 'thumb', v)} />
            <Field label="Full image URL" value={proj.image} onChange={(v) => setArr('projects', i, 'image', v)} />
          </div>
          {proj.thumb && (
            <div style={{ marginTop: '-6px', marginBottom: '8px' }}>
              <img src={proj.thumb} alt="thumb" style={{ width: '100px', height: '66px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
            </div>
          )}
        </div>
      ))}
      <button style={S.addBtn} onClick={() => addArr('projects', { id: Date.now(), title: 'New Project', category: 'Website', client: 'Client Name', languages: 'HTML, CSS, JS', url: 'https://example.com', image: 'https://via.placeholder.com/800x500', thumb: 'https://via.placeholder.com/600x400' })}>+ Add project</button>
    </SectionCard>
  );
}

// ─── TAB: CONTACT ────────────────────────────────────────────────────────────
function ContactTab({ data, set }) {
  const c = data.contact;
  const upd       = (k, v) => set('contact', { ...c, [k]: v });
  const updSocial = (k, v) => set('contact', { ...c, social: { ...c.social, [k]: v } });
  return (
    <>
      <SectionCard title="Contact details" icon="✉️">
        <div style={S.grid2}>
          <Field label="Email address" value={c.email} onChange={(v) => upd('email', v)} type="email" />
          <Field label="Phone number" value={c.phone} onChange={(v) => upd('phone', v)} placeholder="+94 77 000 0000" />
        </div>
        <Field label="Intro paragraph" value={c.intro} onChange={(v) => upd('intro', v)} textarea />
      </SectionCard>
      <SectionCard title="Social links" icon="🔗">
        <div style={S.grid2}>
          {Object.entries(c.social).map(([platform, url]) => (
            <div key={platform}>
              <label style={S.label}>
                {platform === 'facebook' ? '📘' : platform === 'twitter' ? '🐦' : platform === 'youtube' ? '📺' : '🎯'}{' '}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              <input style={S.input} value={url} onChange={(e) => updSocial(platform, e.target.value)} placeholder="https://..." />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard({ token }) {
  const [data, setData]       = useState(null);
  const [tab, setTab]         = useState('hero');
  const [msg, setMsg]         = useState('');
  const [msgType, setMsgType] = useState('ok');

  useEffect(() => {
    fetch('/api/portfolio').then(r => r.json()).then(d => {
      // Migrate: flat languages → array
      if (d.about && !Array.isArray(d.about.languages)) {
        const oldLangs = [];
        if (d.about.languages) oldLangs.push({ name: d.about.languages, level: 'Fluent' });
        if (d.about.additionalLanguage) oldLangs.push({ name: d.about.additionalLanguage, level: 'Fluent' });
        d.about.languages = oldLangs;
        delete d.about.additionalLanguage;
      }
      // Migrate: flat phone → split
      if (d.about && !d.about.phoneCode && d.about.phone) {
        const match = d.about.phone.match(/^(\+\d+)\s*(.*)$/);
        if (match) { d.about.phoneCode = match[1]; d.about.phoneNumber = match[2]; }
        else { d.about.phoneCode = ''; d.about.phoneNumber = d.about.phone; }
      }
      // Migrate: flat address → structured
      if (d.about && !d.about.addressLine1 && d.about.address) {
        d.about.addressLine1 = d.about.address;
        d.about.city = ''; d.about.postalCode = ''; d.about.country = '';
      }
      setData(d);
    }).catch(() => showMsg('Failed to load data', 'err'));
  }, []);

  function showMsg(text, type = 'ok') { setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3000); }
  function set(key, value) { setData(d => ({ ...d, [key]: value })); }
  function setArr(key, index, field, value) {
    setData(d => { const arr = [...d[key]]; arr[index] = { ...arr[index], [field]: value }; return { ...d, [key]: arr }; });
  }
  function removeArr(key, index) { setData(d => ({ ...d, [key]: d[key].filter((_, i) => i !== index) })); }
  function addArr(key, item) { setData(d => ({ ...d, [key]: [...(d[key] || []), item] })); }

  async function save() {
    showMsg('Saving…', 'ok');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) showMsg('✓ Saved!', 'ok');
      else showMsg('Save failed', 'err');
    } catch { showMsg('Network error', 'err'); }
  }

  if (!data) return <div style={S.loading}>Loading…</div>;

  const TABS = [
    { id: 'hero', label: 'Hero' }, { id: 'about', label: 'About' },
    { id: 'stats', label: 'Stats' }, { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' }, { id: 'volunteer', label: 'Volunteer' },
    { id: 'projects', label: 'Projects' }, { id: 'contact', label: 'Contact' },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Portfolio <span style={S.accent}>CMS</span></h1>
        {msg && <span style={{ fontWeight: 600, fontSize: '0.9rem', color: msgType === 'ok' ? '#2ecc71' : '#e74c3c' }}>{msg}</span>}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ ...S.tabRow, minWidth: 'max-content' }}>
          {TABS.map(t => <button key={t.id} style={S.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }} />

      {tab === 'hero'       && <HeroTab       data={data} set={set} />}
      {tab === 'about'      && <AboutTab      data={data} set={set} />}
      {tab === 'stats'      && <StatsTab      data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'skills'     && <SkillsTab     data={data} set={set} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'experience' && <ExperienceTab data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'volunteer'  && <VolunteerTab  data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'projects'   && <ProjectsTab   data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'contact'    && <ContactTab    data={data} set={set} />}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', zIndex: 200 }}>
        <a href="/" style={S.btnOutline}>← Site</a>
        <button style={S.btnPrimary} onClick={save}>Save Changes ↑</button>
      </div>
    </div>
  );
}