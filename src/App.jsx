import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CategoryA from './dashboards/CategoryA';
import CategoryB from './dashboards/CategoryB';
import CategoryC from './dashboards/CategoryC';
import Recap from './dashboards/Recap';
import { useState, useEffect } from 'react';
import './styles/App.css';

function App() {
  const [theme, setTheme] = useState('light');

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
        <Sidebar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category-a" element={<CategoryA />} />
            <Route path="/category-b" element={<CategoryB />} />
            <Route path="/category-c" element={<CategoryC />} />
            <Route path="/recap" element={<Recap />} /> {/* Ajout du récap */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;