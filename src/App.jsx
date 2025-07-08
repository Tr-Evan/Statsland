import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CategoryA from './dashboards/CategoryA';
import CategoryB from './dashboards/CategoryB';
import CategoryC from './dashboards/CategoryC';
import Recap from './dashboards/Recap';
import Rewards from './dashboards/Rewards';
import './styles/App.css';
import { useStatslandConfig } from "./hooks/useStatslandConfig";

function App() {
  // --- Correction : persistance du thème ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('statsland_theme') || 'light';
  });
  const [config, setConfig] = useStatslandConfig();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme === 'light' ? 'light-mode' : 'dark-mode');
    localStorage.setItem('statsland_theme', theme); // <-- Sauvegarde le thème
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app ${theme}`}>
      <Router>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
          style={{
            position: "fixed",
            top: 18,
            left: 18,
            zIndex: 100,
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 44,
            height: 44,
            boxShadow: "0 2px 8px #646cff22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <span style={{fontSize: "2em"}}>☰</span>
        </button>
        {sidebarOpen && <Sidebar theme={theme} toggleTheme={toggleTheme} config={config} />}
        <main className="main-content" style={{marginLeft: sidebarOpen ? 240 : 0, transition: "margin-left 0.3s"}}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category-a" element={<CategoryA config={config} setConfig={setConfig} />} />
            <Route path="/category-b" element={<CategoryB config={config} setConfig={setConfig} />} />
            <Route path="/category-c" element={<CategoryC config={config} setConfig={setConfig} />} />
            <Route path="/recap" element={<Recap />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;