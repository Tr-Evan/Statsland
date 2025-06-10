import '../styles/Theme.css';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
    </button>
  );
}

export default ThemeToggle;