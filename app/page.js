'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PortfolioSection from './components/PortfolioSection';
import ColorSwitcher from './components/ColorSwitcher';

export default function Home() {
  const [data, setData]     = useState(null);
  const [active, setActive] = useState('home');

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(setData);
  }, []);

  function navigate(sectionId) {
    setActive(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!data) return (
    <div style={{ display:'flex', alignItems:'center',
      justifyContent:'center', height:'100vh',
      color:'var(--accent-color)', fontSize:'1.2rem' }}>
      Loading...
    </div>
  );

  const { hero, about, stats, skills, experience, contact } = data;

  return (
    <>
      <ColorSwitcher />
      <Navbar activeSection={active} onNavigate={navigate} />

      <main className="content-wrapper">

        {/* ===== HOME ===== */}
        <section id="home"
          className={`portfolio-section ${active==='home' ? 'active' : ''}`}>
          <div className="hero-container">
            <div className="hero-image-box">
              <img src={hero.photo} alt={hero.name} />
            </div>
            <div className="hero-text-box">
              <h1>I'm {hero.name}.{' '}
                <span className="accent-text">{hero.role}</span>
              </h1>
              <p>{hero.description}</p>
              <button className="cta-button"
                onClick={() => navigate('about')}>
                More About Me <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section id="about"
          className={`portfolio-section ${active==='about' ? 'active' : ''}`}>
          <div className="title-container">
            <h1 className="section-title">About <span className="accent-text">Me</span></h1>
            <span className="bg-watermark">Resume</span>
          </div>
          
          <div className="about-main-container">
            <div className="about-grid-row">
              {/* Personal info */}
              <div className="personal-info-col">
                <h3>Personal Infos</h3>
                <div className="info-list-split">
                  <div className="info-left">
                    <p>First Name: <strong>{about.firstName}</strong></p>
                    <p>Last Name: <strong>{about.lastName}</strong></p>
                    <p>Age: <strong>{about.age}</strong></p>
                    <p>Nationality: <strong>{about.nationality}</strong></p>
                    <p>Freelance: <strong>{about.freelance}</strong></p>
                  </div>
                  <div className="info-right">
                    <p>Address: <strong>{about.address}</strong></p>
                    <p>Phone: <strong>{about.phone}</strong></p>
                    <p>Email: 
                      <strong>
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&to=${about.email}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {about.email}
                        </a>
                      </strong>
                    </p>
                    <p>Skype: <strong>{about.skype}</strong></p>
                    <p>Languages: <strong>{about.languages}</strong></p>
                    {about.additionalLanguage && (
                      <p>Additional Language: <strong>{about.additionalLanguage}</strong></p>
                    )}
                  </div>
                </div>
                <a href={about.cvLink} className="download-cv-btn">
                  <span className="btn-text">Download CV</span>
                  <span className="btn-icon-circle">
                    <i className="fas fa-download"></i>
                  </span>
                </a>
              </div>
              
              {/* Stats */}
              <div className="stats-cards-col">
                {stats.map((s, i) => (
                  <div key={i} className="stat-box">
                    <h2>{s.number}<sup>+</sup></h2>
                    <p><span className="dash-line"></span>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="section-separator" />

            {/* Skills */}
            <div className="skills-section-wrapper">
              <h3 className="subsection-title">My Skills</h3>
              <div className="circular-skills-grid">
                {skills.map((s, i) => (
                  <div key={i} className="skill-item">
                    <div className="circle-progress"
                      style={{ '--percent': s.percent }}>
                      <div className="inner-val">{s.percent}%</div>
                    </div>
                    <h4>{s.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            <hr className="section-separator" />

            {/* Timeline: Experience & Education */}
            <div className="timeline-section-wrapper">
              <h3 className="subsection-title">Experience & Education</h3>
              <div className="timeline-dual-grid">
                
                {/* Work Column */}
                <div className="timeline-column">
                  {experience.filter(e => e.type === 'work').map(e => (
                    <div key={e.id} className="timeline-node">
                      <div className="icon-badge">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <span className="time-stamp">{e.period}</span>
                      <h5>{e.role} <span className="place-tag">— {e.place}</span></h5>
                      <p>{e.desc}</p>
                    </div>
                  ))}
                </div>
                
                {/* Education Column */}
                <div className="timeline-column">
                  {experience.filter(e => e.type === 'education').map(e => (
                    <div key={e.id} className="timeline-node">
                      <div className="icon-badge">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                      <span className="time-stamp">{e.period}</span>
                      <h5>{e.role} <span className="place-tag">— {e.place}</span></h5>
                      <p>{e.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Volunteer Work Section (Nested safely inside layout wrapper) */}
            {data.volunteer && data.volunteer.length > 0 && (
              <>
                <hr className="section-separator" />
                <div className="timeline-section-wrapper">
                  <h3 className="subsection-title">Volunteer Work</h3>
                  <div className="timeline-dual-grid">
                    <div className="timeline-column">
                      {data.volunteer.map(v => (
                        <div key={v.id} className="timeline-node">
                          <div className="icon-badge">
                            <i className="fas fa-hands-helping"></i>
                          </div>
                          <span className="time-stamp">{v.period}</span>
                          <h5>{v.role} <span className="place-tag">— {v.organization}</span></h5>
                          <p>{v.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </section>

        {/* ===== PORTFOLIO ===== */}
        <PortfolioSection data={data} isActive={active==='portfolio'} />

        {/* ===== CONTACT ===== */}
        <section id="contact"
          className={`portfolio-section ${active==='contact' ? 'active' : ''}`}>
          <div className="title-container">
            <h1 className="section-title">Get In <span className="accent-text">Touch</span></h1>
            <span className="bg-watermark">Contact</span>
          </div>
          <div className="contact-grid-wrapper">
            <div className="contact-details-column">
              <h3>Don't be shy !</h3>
              <p>{contact.intro}</p>
              <div className="meta-info-item">
                <i className="fas fa-envelope-open icon-indicator"></i>
                <div className="meta-text">
                  <span className="meta-label">Mail Me</span>
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&to=${contact.email}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="meta-value"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <div className="meta-info-item">
                <i className="fas fa-phone-alt icon-indicator"></i>
                <div className="meta-text">
                  <span className="meta-label">Call Me</span>
                  <a href={`tel:${contact.phone}`} className="meta-value">{contact.phone}</a>
                </div>
              </div>
              <div className="social-links-row">
                {Object.entries(contact.social).map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="social-circle-btn">
                    <i className={`fab fa-${key}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="contact-form-column">
              <form
                className="interactive-contact-form"
                action="https://formspree.io/f/mdaqangw"
                method="POST">
                <div className="form-input-row">
                  <input type="text" name="name" placeholder="YOUR NAME" required />
                  <input type="email" name="email" placeholder="YOUR EMAIL" required />
                  <input type="text" name="subject" placeholder="YOUR SUBJECT" required />
                </div>
                <div className="form-textarea-row">
                  <textarea name="message" placeholder="YOUR MESSAGE" rows="6" required></textarea>
                </div>
                <button type="submit" className="cta-submit-btn">
                  <span className="btn-text">Send Message</span>
                  <span className="btn-icon-circle">
                    <i className="fas fa-paper-plane"></i>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}