import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        <Link to="/dashboard" className="logo" aria-label="CRUST Home">
          CRUST<span>.</span><span className="logo-tm">TM</span>
        </Link>

        <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="/build"
            className={`nav-link ${isActive('/build') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Build
          </Link>
          <Link
            to="/orders"
            className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Orders
          </Link>
        </div>

        <div className="nav-actions">
          {user && (
            <>
              <span className="user-info">Hey, {user.name}</span>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
