import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar({ token, role, setToken, setRole }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null); // ✅ Clear token in App state
    setRole(null);  // ✅ Clear role in App state
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('#dropdownUser')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const styles = {
    navbar: {
      backgroundColor: '#fff',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      fontFamily: 'Segoe UI, sans-serif',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a73e8',
      textDecoration: 'none',
    },
    links: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
    },
    link: {
      color: '#555',
      textDecoration: 'none',
      fontWeight: '500',
    },
    button: {
      backgroundColor: '#1a73e8',
      color: '#fff',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      textDecoration: 'none',
      fontWeight: '500',
      cursor: 'pointer',
    },
    dropdownToggle: {
      backgroundColor: '#f1f1f1',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      border: 'none',
      fontWeight: '500',
    },
    dropdownMenu: {
      position: 'absolute',
      right: 0,
      top: '44px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 999,
      minWidth: '180px',
    },
    dropdownItem: {
      padding: '10px 16px',
      display: 'block',
      textDecoration: 'none',
      color: '#333',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      border: 'none',
      textAlign: 'left',
      width: '100%',
    },
    dropdownItemHover: {
      backgroundColor: '#f5f5f5',
    },
    logout: {
      color: '#d32f2f',
      borderTop: '1px solid #eee',
    },
    dropdownContainer: {
      position: 'relative',
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        💼 JobBoard
      </Link>

      {!token ? (
        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
          <Link to="/register" style={styles.button}>
            Register
          </Link>
        </div>
      ) : (
        <div style={styles.dropdownContainer} id="dropdownUser">
          <button onClick={toggleDropdown} style={styles.dropdownToggle}>
            {role === 'jobSeeker' ? '👤 Job Seeker' : '🏢 Employer'}
          </button>

          {dropdownOpen && (
            <div style={styles.dropdownMenu}>
              {role === 'jobSeeker' && (
                <>
                  <Link to="/jobseeker-dashboard" style={styles.dropdownItem}>
                    📋 Dashboard
                  </Link>
                  <Link to="/profile" style={styles.dropdownItem}>
                    🙍‍♂️ My Profile
                  </Link>
                 
                </>
              )}
              {role === 'employer' && (
                <>
                  <Link to="/employer-dashboard" style={styles.dropdownItem}>
                    📊 Dashboard
                  </Link>
                  <Link to="/post-job" style={styles.dropdownItem}>
                    ➕ Post Job
                  </Link>
                  <Link to="/company-profile" style={styles.dropdownItem}>
                    🏢 Company Profile
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                style={{ ...styles.dropdownItem, ...styles.logout }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
