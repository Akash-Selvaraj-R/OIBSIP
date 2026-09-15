import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="logo">CRUST<span>.</span></Link>

        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Menu</Link>
          <Link to="/build" className={`nav-link ${isActive('/build') ? 'active' : ''}`}>Build</Link>
          <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>Orders</Link>
        </div>

        <div className="nav-actions">
          {user && (
            <>
              <span className="user-info">Hey, {user.name}</span>
              <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
