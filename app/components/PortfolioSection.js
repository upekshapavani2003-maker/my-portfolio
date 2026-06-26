'use client';
import { useState } from 'react';

export default function PortfolioSection({ data, isActive }) {
  const [modal, setModal] = useState(null);

  function openModal(project) {
    setModal(project);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setModal(null);
    document.body.style.overflow = '';
  }

  return (
    <section id="portfolio"
      className={`portfolio-section ${isActive ? 'active' : ''}`}>
      <div className="title-container">
        <h1 className="section-title">
          My <span className="accent-text">Portfolio</span>
        </h1>
        <span className="bg-watermark">Works</span>
      </div>

      {/* Project grid */}
      <div className="portfolio-interactive-grid">
        {data.projects.map(project => (
          <div key={project.id}
            className="project-item-card"
            onClick={() => openModal(project)}>
            <img src={project.thumb} alt={project.title} />
            <div className="project-item-overlay">
              <span className="overlay-title">{project.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      <div
        id="projectLightboxModal"
        className={`project-lightbox-modal ${modal ? 'is-visible' : ''}`}
        onClick={e => e.target.id === 'projectLightboxModal' && closeModal()}>
        <div className="modal-inner-content">
          <button className="close-modal-trigger" onClick={closeModal}>×</button>
          {modal && (
            <>
              <h2 className="modal-project-heading">{modal.title}</h2>
              <div className="modal-details-grid">
                <div className="detail-meta-block">
                  <i className="far fa-file-alt"></i>
                  Project: <span className="detail-bold">{modal.category}</span>
                </div>
                <div className="detail-meta-block">
                  <i className="far fa-user"></i>
                  Client: <span className="detail-bold">{modal.client}</span>
                </div>
                <div className="detail-meta-block">
                  <i className="fas fa-code"></i>
                  Languages: <span className="detail-bold">{modal.languages}</span>
                </div>
                <div className="detail-meta-block">
                  <i className="fas fa-external-link-alt"></i>
                  Preview: 
                  <a href={modal.url} target="_blank"
                    className="detail-link">
                    {modal.url.replace('https://', '')}
                  </a>
                </div>
              </div>
              <div className="modal-media-frame">
                <img src={modal.image} alt={modal.title} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}