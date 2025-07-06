import { useState, useEffect } from 'react';
import API from '../api';
import './SearchJobs.css';

function SearchJobs() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: ''
  });

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await API.get(`/jobs?${params}`);
      setJobs(res.data);
    } catch {
      console.error("❌ Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="search-jobs">
      <h2>🔍 Search Jobs</h2>

      <form className="filters-container" onSubmit={handleSearch}>
        <input
          name="title"
          placeholder="Job Title"
          value={filters.title}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="grid">
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>{job.companyName}</strong> — {job.location}</p>
              <p>{job.jobType} | {job.experienceLevel}</p>
              <p>💰 {job.salary} INR</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchJobs;
