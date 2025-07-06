import { useEffect, useState } from 'react';
import API from '../api';
import JobCard from '../components/JobCard';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
  });

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = () => {
    const params = new URLSearchParams();
    filters.jobType.forEach(type => params.append('jobType', type));
    filters.experience.forEach(level => params.append('experience', level));

    API.get(`/jobs?${params.toString()}`)
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  };

  const handleCheckbox = (type, value) => {
    setFilters(prev => {
      const list = prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: list };
    });
  };

  return (
    <div className="dashboard">
      <h2>Available Jobs</h2>

      {/* ✅ Show filters only if logged in and role is jobseeker */}
      {token && role === 'jobseeker' && (
        <div className="filters">
          <h3>Filters</h3>
          <div>
            <strong>Job Type</strong>
            {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={filters.jobType.includes(type)}
                  onChange={() => handleCheckbox('jobType', type)}
                />
                {type}
              </label>
            ))}
          </div>
          <div>
            <strong>Experience Level</strong>
            {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((level) => (
              <label key={level}>
                <input
                  type="checkbox"
                  checked={filters.experience.includes(level)}
                  onChange={() => handleCheckbox('experience', level)}
                />
                {level}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job._id} job={job} />)
        ) : (
          <p>No jobs available.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
