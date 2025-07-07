import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import CompanyProfile from './pages/CompanyProfile';
import ViewApplicants from './pages/ViewApplicants';
import SearchJobs from './pages/SearchJobs';
import DashboardRedirect from './pages/DashboardRedirect';

const PrivateRoute = ({ children, token, role, allowedRole }) => {
  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setToken(storedToken);
    setRole(storedRole);
  }, []);

  const refreshUser = () => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  };

  return (
    <Router>
      <Navbar token={token} role={role} setToken={setToken} setRole={setRole} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <DashboardRedirect /> : <Login refreshUser={refreshUser} />} />
        <Route path="/register" element={token ? <DashboardRedirect /> : <Register />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Job Seeker Routes */}
        <Route
          path="/jobseeker-dashboard"
          element={
            <PrivateRoute token={token} role={role} allowedRole="jobSeeker">
              <JobSeekerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/search-jobs"
          element={
            <PrivateRoute token={token} role={role} allowedRole="jobSeeker">
              <SearchJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute token={token} role={role} allowedRole="jobSeeker">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute token={token} role={role}>
              <div> {/*  This is a dummy route that renders nothing */}</div>
            </PrivateRoute>
          }
        />

        {/* Employer Routes */}
        <Route
          path="/employer-dashboard"
          element={
            <PrivateRoute token={token} role={role} allowedRole="employer">
              <EmployerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <PrivateRoute token={token} role={role} allowedRole="employer">
              <PostJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <PrivateRoute token={token} role={role} allowedRole="employer">
              <EditJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <PrivateRoute token={token} role={role} allowedRole="employer">
              <CompanyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-applicants/:jobId"
          element={
            <PrivateRoute token={token} role={role} allowedRole="employer">
              <ViewApplicants />
            </PrivateRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Global Footer */}
      <Footer />
    </Router>
  );
}

export default App;
