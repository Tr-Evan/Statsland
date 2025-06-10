import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.svg';
import '../styles/Sidebar.css';

const Sidebar = ({ theme, toggleTheme }) => {
  const [now, setNow] = useState(new Date());
  const location = useLocation();

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
            <Link to="/category-a" className={location.pathname === '/category-a' ? 'active' : ''}>Category A</Link>
          </li>
          <li>
            <Link to="/category-b" className={location.pathname === '/category-b' ? 'active' : ''}>Category B</Link>
          </li>
          <li>
            <Link to="/category-c" className={location.pathname === '/category-c' ? 'active' : ''}>Category C</Link>
          </li>
          <li>
            <Link
              to="/recap"
              className={`recap-link${location.pathname === '/recap' ? ' active' : ''}`}
            >
              <span>📊 Récapitulatif</span>
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