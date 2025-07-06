import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar({ token, role, setToken, setRole }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
  <div className="navbar-logo">JobBoard</div>

        <div className="navbar-links">
          {!token ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <div className="profile-dropdown">
              <button
                className="profile-icon"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                👤
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>👤 Profile</Link>
                  {role === 'employer' && (
                    <Link to="/employer-dashboard" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                  )}
                  {/* You can remove or comment Settings if route not available */}
                  {/* <Link to="/settings" onClick={() => setShowDropdown(false)}>⚙️ Settings</Link> */}
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
