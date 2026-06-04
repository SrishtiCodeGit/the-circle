import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Compass, Briefcase, Users, LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const navLinks = [
    { to: '/discover', label: 'Discover', icon: <Compass size={15} /> },
    { to: '/gigs',     label: 'Gigs',     icon: <Briefcase size={15} /> },
    { to: '/collabs',  label: 'Collabs',  icon: <Users size={15} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/"><Logo size={34} textSize="1.05rem" /></Link>

        <div className="navbar-links">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
              {icon} <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="theme-toggle"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {currentUser ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '0.42rem 0.85rem' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '0.42rem 0.75rem' }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost"   style={{ fontSize: '0.82rem', padding: '0.42rem 0.85rem' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '0.42rem 0.95rem' }}>Join free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
