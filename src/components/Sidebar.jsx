import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.svg';
import '../styles/Sidebar.css';

// Simule la détection d'un objectif atteint (à remplacer par la vraie logique)
function useAnyRewardAchieved() {
  // À remplacer par une vraie détection (localStorage, contexte, etc.)
  const [achieved, setAchieved] = useState(false);
  useEffect(() => {
    // Exemple : check localStorage ou une API
    const reward = localStorage.getItem("statsland_any_reward");
    setAchieved(reward === "1");
    // Pour test, décommente pour forcer l'affichage :
    // setAchieved(true);
  }, []);
  return achieved;
}

const Sidebar = ({ theme, toggleTheme, config }) => {
  const [now, setNow] = useState(new Date());
  const location = useLocation();
  const anyReward = useAnyRewardAchieved();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <span className="sidebar-title">Statsland</span>
      </div>
      <hr className="sidebar-separator" />
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`home-link${location.pathname === '/' ? ' active' : ''}`}>Accueil</Link>
          </li>
          {config.categories.map(cat => (
            <li key={cat.key}>
              <Link to={`/${cat.key}`} className={location.pathname === `/${cat.key}` ? 'active' : ''}>
                {cat.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/recap"
              className={`recap-link${location.pathname === '/recap' ? ' active' : ''}`}
            >
              <span>Récap</span>
            </Link>
          </li>
          <li style={{ position: "relative" }}>
            <Link
              to="/rewards"
              className={`rewards-link${location.pathname === '/rewards' ? ' active' : ''}`}
            >
              <span>Récompenses</span>
              {anyReward && (
                <span className="rewards-notif-star" aria-label="Objectif atteint" title="Objectif atteint !">⭐</span>
              )}
              <span className="rewards-firework" aria-hidden="true">✨</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-clock">{now.toLocaleTimeString()}</div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </aside>
  );
};

export default Sidebar;