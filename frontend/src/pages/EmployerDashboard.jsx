import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import './EmployerDashboard.css';

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: myJobs } = await API.get('/jobs/mine');
      const enriched = await Promise.all(
        myJobs.map(async job => {
          const { data: apps } = await API.get(`/jobs/${job._id}/applicants`);
          return { ...job, applicants: apps };
        })
      );
      setJobs(enriched);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading your job posts...</p>;

  return (
    <div className="page dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📋 Your Job Posts</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="primary-btn" onClick={() => navigate('/post-job')}>
            ➕ Post Job
          </button>
          <button className="secondary-btn" onClick={() => navigate('/company-profile')}>
            🏢 Company Profile
          </button>
        </div>
      </div>

      {jobs.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>No jobs posted yet.</h3>
        </div>
      )}

      <div className="grid">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.jobType} — <strong>Exp:</strong> {job.experienceLevel}</p>
            <p><strong>Salary:</strong> ₹{job.salary.toLocaleString()}</p>
            <p><strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

            <div className="actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="secondary-btn"
                onClick={() => navigate(`/edit-job/${job._id}`)}
              >
                ✏️ Edit
              </button>
              <button
                className="secondary-btn"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this job?')) {
                    try {
                      await API.delete(`/jobs/${job._id}`);
                      toast.success('Job deleted');
                      fetchJobs(); // Refresh job list
                    } catch {
                      toast.error('Failed to delete job');
                    }
                  }
                }}
              >
                🗑️ Delete
              </button>
            </div>

            <h4 style={{ marginTop: '1rem' }}>👥 Applicants ({job.applicants?.length || 0})</h4>

            {job.applicants?.length ? (
              job.applicants.map(app => (
                <div key={app._id} className="applicant-card" style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginTop: '0.75rem'
                }}>
                  <p><strong>{app.user.username}</strong> — {app.user.email}</p>
                  {app.user.skills?.length > 0 && (
                    <p><strong>Skills:</strong> {app.user.skills.join(', ')}</p>
                  )}
                  {app.user.qualification && (
                    <p><strong>Qualification:</strong> {app.user.qualification}</p>
                  )}
                  <p><strong>Experience:</strong> {app.user.experienceLevel}</p>
                  {app.user.resume && (
                    <a
                      href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${app.user.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontWeight: '500' }}
                    >
                      📄 View Resume
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p style={{ marginTop: '0.5rem' }}>No applicants yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;
