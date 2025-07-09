import React from "react";
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard home-landing">
      <div className="landing-bg-anim" />
      <div className="landing-content">
        <h1 className="landing-title">
          <span className="statsland-glow">Statsland</span>
        </h1>
        <div className="landing-slogan">
          <span>
            Explore. <span className="slogan-gradient">Joue.</span> Progresse.
          </span>
        </div>
        <div className="landing-actions">
          <a href="/category-a" className="landing-btn landing-btn-main">Catégorie A</a>
          <a href="/category-b" className="landing-btn">Catégorie B</a>
          <a href="/category-c" className="landing-btn">Catégorie C</a>
          <a href="/rewards" className="landing-btn landing-btn-reward">🎁 Récompenses</a>
        </div>
        <div className="landing-icons-row">
          <div className="landing-icon-card">
            <span className="landing-icon">📈</span>
            <span className="landing-icon-label">Stats en temps réel</span>
          </div>
          <div className="landing-icon-card">
            <span className="landing-icon">🎨</span>
            <span className="landing-icon-label">Personnalisation</span>
          </div>
          <div className="landing-icon-card">
            <span className="landing-icon">🌙</span>
            <span className="landing-icon-label">Mode sombre</span>
          </div>
          <div className="landing-icon-card">
            <span className="landing-icon">🏆</span>
            <span className="landing-icon-label">Défis & Succès</span>
          </div>
        </div>
        <div className="landing-footer">
          <span>✨ Statsland — Suis tes progrès, bats des records, amuse-toi !</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;