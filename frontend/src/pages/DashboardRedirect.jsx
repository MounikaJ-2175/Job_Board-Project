import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'jobSeeker') {
      navigate('/jobseeker-dashboard');
    } else if (role === 'employer') {
      navigate('/employer-dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
}

export default DashboardRedirect;
