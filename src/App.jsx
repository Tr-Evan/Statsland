import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CategoryA from './dashboards/CategoryA';
import CategoryB from './dashboards/CategoryB';
import CategoryC from './dashboards/CategoryC';
import Recap from './dashboards/Recap';
import Rewards from './dashboards/Rewards';
import { useState, useEffect } from 'react';
import './styles/App.css';
import { useStatslandConfig } from "./hooks/useStatslandConfig";

function App() {
  const [theme, setTheme] = useState('light');
  const [config, setConfig] = useStatslandConfig();

  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme === 'light' ? 'light-mode' : 'dark-mode');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app ${theme}`}>
      <Router>
        <Sidebar theme={theme} toggleTheme={toggleTheme} config={config} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category-a" element={<CategoryA config={config} setConfig={setConfig} />} />
            <Route path="/category-b" element={<CategoryB config={config} setConfig={setConfig} />} />
            <Route path="/category-c" element={<CategoryC config={config} setConfig={setConfig} />} />
            <Route path="/recap" element={<Recap />} /> {/* Ajout du récap */}
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;