'use client';
import { useState, useEffect } from 'react';

// Pre-defined professions and their associated skill sets
const PROFESSION_SKILLS = {
  'Software Engineer': [
    'React / Next.js',
    'Flutter',
    'Go / Golang',
    'PostgreSQL',
    'Node.js',
    'TypeScript',
    'Cloud Computing (AWS/GCP)',
    'Docker & Kubernetes'
  ],
  'Business Analyst': [
    'Requirements Gathering',
    'Data Analysis (SQL/Excel)',
    'Agile / Scrum Methodologies',
    'Process Mapping (BPMN)',
    'User Stories & Backlog Grooming',
    'Stakeholder Management',
    'Tableau / PowerBI'
  ],
  'UI/UX Designer': [
    'Figma',
    'User Research',
    'Wireframing & Prototyping',
    'Information Architecture',
    'Visual Design',
    'Interaction Design'
  ],
  'Project Manager': [
    'Resource Planning',
    'Risk Management',
    'Sprint Planning',
    'Budget Tracking',
    'Jira / Confluence',
    'Communication'
  ]
};

// ─── shared inline style helpers ────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-color)',
    color: 'var(--text-primary)',
    fontFamily: "'Poppins','Segoe UI',sans-serif",
    padding: '1rem',
    paddingBottom: '5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '10px',
  },
  h1: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  accent: { color: 'var(--accent-color)' },
  savedMsg: { fontSize: '0.85rem', color: '#2ecc71', fontWeight: 600 },
  errMsg: { fontSize: '0.85rem', color: '#e74c3c', fontWeight: 600 },
  btnPrimary: {
    padding: '12px 24px',
    background: 'var(--accent-color)',
    color: '#111',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'opacity .2s',
    whiteSpace: 'nowrap',
    touchAction: 'manipulation',
    boxShadow: '0 4px 20px rgba(255,180,0,0.3)',
  },
  btnOutline: {
    padding: '12px 24px',
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    touchAction: 'manipulation',
  },
  tabRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0',
  },
  tab: (active) => ({
    padding: '8px 14px',
    background: 'transparent',
    color: active ? 'var(--accent-color)' : 'var(--text-secondary)',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent-color)' : '2px solid transparent',
    fontWeight: active ? 700 : 500,
    fontSize: '0.8rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all .2s',
    marginBottom: '-1px',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }),
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '1.25rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--accent-color)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  label: {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-secondary)',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    outline: 'none',
    marginBottom: '14px',
    transition: 'border-color .2s',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    marginBottom: '14px',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    outline: 'none',
    marginBottom: '14px',
    cursor: 'pointer',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    padding: '10px 12px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    flexWrap: 'wrap',
  },
  rangeWrap: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' },
  range: { flex: 1, accentColor: 'var(--accent-color)' },
  pctBadge: {
    minWidth: '42px',
    textAlign: 'center',
    padding: '3px 8px',
    background: 'var(--accent-color)',
    color: '#111',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  deleteBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: '#e74c3c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    flexShrink: 0,
    fontFamily: 'inherit',
    touchAction: 'manipulation',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    background: 'transparent',
    color: 'var(--accent-color)',
    border: '1px solid var(--accent-color)',
    borderRadius: '30px',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    touchAction: 'manipulation',
  },
  badge: (type) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: 700,
    background: type === 'work' ? 'rgba(255,180,0,0.15)' : 'rgba(100,180,255,0.15)',
    color: type === 'work' ? 'var(--accent-color)' : '#64b4ff',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }),
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border-color)',
    margin: '1.25rem 0',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-color)',
    color: 'var(--accent-color)',
    fontSize: '1.1rem',
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
};

// ─── reusable field ──────────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {textarea ? (
        <textarea
          style={S.textarea}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          style={S.input}
          type={type}
          value={value || ''}
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
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── TAB: HERO ───────────────────────────────────────────────────────────────
function HeroTab({ data, set }) {
  const h = data.hero || {};
  const upd = (k, v) => set('hero', { ...h, [k]: v });
  return (
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
        label="Profile photo path (e.g. /images/profile/profile.jpg)"
        value={h.photo}
        onChange={(v) => upd('photo', v)}
        placeholder="/images/profile/profile.jpg"
      />
      {h.photo && (
        <div style={{ marginTop: '4px', marginBottom: '14px' }}>
          <img
            src={h.photo}
            alt="preview"
            style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--accent-color)' }}
          />
        </div>
      )}
    </SectionCard>
  );
}

// ─── TAB: ABOUT ──────────────────────────────────────────────────────────────
function AboutTab({ data, set }) {
  const a = data.about || {};
  const upd = (k, v) => set('about', { ...a, [k]: v });
  return (
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
        <Field label="Phone" value={a.phone} onChange={(v) => upd('phone', v)} placeholder="+94 77 000 0000" />
        <Field label="Email" value={a.email} onChange={(v) => upd('email', v)} type="email" />
        <Field label="Skype" value={a.skype} onChange={(v) => upd('skype', v)} />
        <Field label="Languages" value={a.languages} onChange={(v) => upd('languages', v)} placeholder="English, Tamil" />
        <Field label="Additional Language" value={a.additionalLanguage || ''} onChange={(v) => upd('additionalLanguage', v)} placeholder="e.g. Spanish" />
      </div>
      <hr style={S.divider} />
      <Field
        label="CV download link (e.g. /cv.pdf)"
        value={a.cvLink}
        onChange={(v) => upd('cvLink', v)}
        placeholder="/cv.pdf"
      />
    </SectionCard>
  );
}

// ─── TAB: STATS ──────────────────────────────────────────────────────────────
function StatsTab({ data, setArr, removeArr, addArr }) {
  return (
    <SectionCard title="Stats / counters" icon="📊">
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        The 4 numbers shown in the About section.
      </p>
      {(data.stats || []).map((s, i) => (
        <div key={i} style={S.itemRow}>
          <div style={{ width: '70px', flexShrink: 0 }}>
            <label style={{ ...S.label, marginBottom: '3px' }}>No.</label>
            <input
              style={{ ...S.input, marginBottom: 0, width: '100%', padding: '8px 10px' }}
              value={s.number}
              onChange={(e) => setArr('stats', i, 'number', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ ...S.label, marginBottom: '3px' }}>Label</label>
            <input
              style={{ ...S.input, marginBottom: 0 }}
              value={s.label}
              onChange={(e) => setArr('stats', i, 'label', e.target.value)}
              placeholder="Years of Experience"
            />
          </div>
          <button style={{ ...S.deleteBtn, marginTop: '18px' }} onClick={() => removeArr('stats', i)}>×</button>
        </div>
      ))}
      <button style={S.addBtn} onClick={() => addArr('stats', { number: '0', label: 'New Stat' })}>
        + Add stat
      </button>
    </SectionCard>
  );
}

// ─── TAB: SKILLS ─────────────────────────────────────────────────────────────
function SkillsTab({ data, set, setArr, removeArr, addArr }) {
  const activeProfession = data.profession || 'Software Engineer';
  const availableSkills = PROFESSION_SKILLS[activeProfession] || [];
  
  const [selectedSkillToAdd, setSelectedSkillToAdd] = useState(availableSkills[0] || '');
  const [selectedPercent, setSelectedPercent] = useState(50);

  useEffect(() => {
    if (availableSkills.length > 0) {
      setSelectedSkillToAdd(availableSkills[0]);
    }
  }, [activeProfession]);

  return (
    <SectionCard title="Skills (circular progress)" icon="⚙️">
      
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)' }}>
        <label style={S.label}>Select Profession Profile</label>
        <select 
          style={{ ...S.select, marginBottom: 0, width: '100%', maxWidth: '320px' }}
          value={activeProfession}
          onChange={(e) => set('profession', e.target.value)}
        >
          {Object.keys(PROFESSION_SKILLS).map((prof) => (
            <option key={prof} value={prof}>{prof}</option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Drag the slider to update each skill percentage.
      </p>
      
      {(data.skills || []).map((s, i) => (
        <div key={i} style={S.itemRow}>
          <input
            style={{ ...S.input, marginBottom: 0, width: '100%', flex: '1 1 180px' }}
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
          <button style={S.deleteBtn} onClick={() => removeArr('skills', i)}>×</button>
        </div>
      ))}

      {/* Stacked Responsive Add-Skill Control */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '14px', 
        background: 'var(--bg-color)', 
        border: '1px dashed var(--border-color)', 
        borderRadius: '8px' 
      }}>
        <label style={{ ...S.label, marginBottom: '8px' }}>Add Prescribed Skill Platform</label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select
            style={{ ...S.select, marginBottom: 0, width: '100%' }}
            value={selectedSkillToAdd}
            onChange={(e) => setSelectedSkillToAdd(e.target.value)}
          >
            {availableSkills.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              style={S.range} 
              value={selectedPercent} 
              onChange={(e) => setSelectedPercent(+e.target.value)}
            />
            <span style={S.pctBadge}>{selectedPercent}%</span>
          </div>

          <button 
            style={{ 
              ...S.addBtn, 
              width: '100%', 
              justifyContent: 'center', 
              padding: '10px 16px',
              marginTop: '4px' 
            }} 
            onClick={() => {
              if (!selectedSkillToAdd) return;
              addArr('skills', { name: selectedSkillToAdd, percent: selectedPercent });
            }}
          >
            + Add Skill
          </button>
        </div>
      </div>

    </SectionCard>
  );
}

// ─── TAB: EXPERIENCE ─────────────────────────────────────────────────────────
function ExperienceTab({ data, setArr, removeArr, addArr }) {
  return (
    <>
      <SectionCard title="Work experience" icon="💼">
        {(data.experience || []).filter((e) => e.type === 'work').map((exp) => {
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
                <Field label="Period" value={exp.period} onChange={(v) => setArr('experience', i, 'period', v)} />
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
        {(data.experience || []).filter((e) => e.type === 'education').map((exp) => {
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
        <button style={S.addBtn} onClick={() => addArr('experience', { id: Date.now(), type: 'education', period: '2024', role: 'New Degree', place: 'University', desc: '' })}>
          + Add education
        </button>
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
            <span style={{ ...S.badge('work'), background: 'rgba(39,174,96,0.15)', color: '#27ae60' }}>
              Volunteer #{i + 1}
            </span>
            <button style={S.deleteBtn} onClick={() => removeArr('volunteer', i)}>×</button>
          </div>
          <div style={S.grid2}>
            <Field label="Role / Position" value={v.role} onChange={(val) => setArr('volunteer', i, 'role', val)} />
            <Field label="Organization" value={v.organization} onChange={(val) => setArr('volunteer', i, 'organization', val)} />
            <Field label="Period" value={v.period} onChange={(val) => setArr('volunteer', i, 'period', val)} />
          </div>
          <Field label="Description" value={v.desc} onChange={(val) => setArr('volunteer', i, 'desc', val)} textarea />
        </div>
      ))}
      <button style={S.addBtn} onClick={() => addArr('volunteer', { id: Date.now(), role: 'New Role', organization: 'Organization', period: '2024', desc: '' })}>
        + Add volunteer work
      </button>
    </SectionCard>
  );
}

// ─── TAB: PROJECTS ───────────────────────────────────────────────────────────
function ProjectsTab({ data, setArr, removeArr, addArr }) {
  return (
    <SectionCard title="Portfolio projects" icon="🖼️">
      {(data.projects || []).map((proj, i) => (
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
          <Field label="Project URL" value={proj.url} onChange={(v) => setArr('projects', i, 'url', v)} />
          <div style={S.grid2}>
            <Field label="Thumbnail URL" value={proj.thumb} onChange={(v) => setArr('projects', i, 'thumb', v)} />
            <Field label="Full image URL" value={proj.image} onChange={(v) => setArr('projects', i, 'image', v)} />
          </div>
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
  );
}

// ─── TAB: CONTACT ────────────────────────────────────────────────────────────
function ContactTab({ data, set }) {
  const c = data.contact || { social: {} };
  const upd = (k, v) => set('contact', { ...c, [k]: v });
  
  const updSocial = (platform, val) => {
    set('contact', {
      ...c,
      social: {
        ...(c.social || {}),
        [platform]: val
      }
    });
  };

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
          {Object.entries(c.social || {}).map(([platform, url]) => (
            <div key={platform}>
              <label style={S.label}>{platform}</label>
              <input
                style={S.input}
                value={url || ''}
                onChange={(e) => updSocial(platform, e.target.value)}
              />
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
    fetch('/api/portfolio', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => showMsg('Failed to load data', 'err'));
  }, []);

  function showMsg(text, type = 'ok') {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  }

  function set(key, value) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function setArr(key, index, field, value) {
    setData((d) => {
      const arr = [...(d[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...d, [key]: arr };
    });
  }

  function removeArr(key, index) {
    setData((d) => ({ ...d, [key]: (d[key] || []).filter((_, i) => i !== index) }));
  }

  function addArr(key, item) {
    setData((d) => ({ ...d, [key]: [...(d[key] || []), item] }));
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
      if (res.ok) showMsg('✓ Saved!', 'ok');
      else showMsg('Save failed', 'err');
    } catch {
      showMsg('Network error', 'err');
    }
  }

  if (!data) return <div style={S.loading}>Loading…</div>;

  const TABS = [
    { id: 'hero',       label: 'Hero' },
    { id: 'about',      label: 'About' },
    { id: 'stats',      label: 'Stats' },
    { id: 'skills',     label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'volunteer',  label: 'Volunteer' },
    { id: 'projects',   label: 'Projects' },
    { id: 'contact',    label: 'Contact' },
  ];

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.h1}>Portfolio <span style={S.accent}>CMS</span></h1>
      </div>

      {/* Dynamic Tabs */}
      <div style={{ overflowX: 'auto', marginBottom: '0' }}>
        <div style={{ ...S.tabRow, minWidth: 'max-content' }}>
          {TABS.map((t) => (
            <button key={t.id} style={S.tab(tab === t.id)} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }} />

      {/* Active Tab Router */}
      {tab === 'hero'       && <HeroTab       data={data} set={set} />}
      {tab === 'about'      && <AboutTab      data={data} set={set} />}
      {tab === 'stats'      && <StatsTab      data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'skills'     && <SkillsTab     data={data} set={set} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'experience' && <ExperienceTab data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'volunteer'  && <VolunteerTab  data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'projects'   && <ProjectsTab   data={data} setArr={setArr} removeArr={removeArr} addArr={addArr} />}
      {tab === 'contact'    && <ContactTab    data={data} set={set} />}

      {/* Single Bottom Control Bar with Uniform Buttons */}
      <div style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        right: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        zIndex: 2000 
      }}>
        {msg && <span style={msgType === 'ok' ? S.savedMsg : S.errMsg}>{msg}</span>}
        <a href="/" style={S.btnOutline}>← Site</a>
        <button style={S.btnPrimary} onClick={save}>Save ↑</button>
      </div>

    </div>
  );
}