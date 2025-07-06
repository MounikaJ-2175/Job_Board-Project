import { useEffect, useState } from 'react';
import API from '../api';
import JobCard from '../components/JobCard';
import { toast } from 'react-toastify';

function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    salaryRange: []
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [jobsRes, appliedRes] = await Promise.all([
        API.get('/jobs'),
        API.get('/applications/my')
      ]);

      setJobs(jobsRes.data);
      setAppliedJobs(appliedRes.data.map(app => app.job._id));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  };

  const handleCheckbox = (category, value) => {
    setFilters((prev) => {
      const newValues = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: newValues };
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesType =
      filters.jobType.length === 0 || filters.jobType.includes(job.jobType);
    const matchesLevel =
      filters.experienceLevel.length === 0 || filters.experienceLevel.includes(job.experienceLevel);
    const matchesSalary =
      filters.salaryRange.length === 0 ||
      filters.salaryRange.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return job.salary >= min && job.salary <= max;
      });

    return matchesType && matchesLevel && matchesSalary;
  });

  const handleApply = async (jobId) => {
    try {
      await API.post(`/applications/apply/${jobId}`);
      toast.success('✅ Job applied successfully');
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Application failed');
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Filters</h2>
        <section>
          <h4>Job Type</h4>
          {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
            <label key={type} className="filter-option">
              <input
                type="checkbox"
                checked={filters.jobType.includes(type)}
                onChange={() => handleCheckbox('jobType', type)}
              />{' '}
              {type}
            </label>
          ))}
        </section>
        <section>
          <h4>Experience Level</h4>
          {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((level) => (
            <label key={level} className="filter-option">
              <input
                type="checkbox"
                checked={filters.experienceLevel.includes(level)}
                onChange={() => handleCheckbox('experienceLevel', level)}
              />{' '}
              {level}
            </label>
          ))}
        </section>
        <section>
          <h4>Salary Range</h4>
          {['30000-50000', '50000-70000', '70000-85000', '85000-100000'].map((range) => (
            <label key={range} className="filter-option">
              <input
                type="checkbox"
                checked={filters.salaryRange.includes(range)}
                onChange={() => handleCheckbox('salaryRange', range)}
              />{' '}
              ₹{range.replace('-', ' - ₹')}
            </label>
          ))}
        </section>
      </aside>

      <main className="job-listings">
        <h2>📄 Applied Jobs</h2>
        <div className="grid">
          {appliedJobs.length > 0 ? (
            jobs
              .filter((job) => appliedJobs.includes(job._id))
              .map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  applied={true}
                />
              ))
          ) : (
            <p>You haven't applied to any jobs yet.</p>
          )}
        </div>

        <h2>📌 Available Jobs</h2>
        <div className="grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                applied={appliedJobs.includes(job._id)}
                onApply={handleApply}
              />
            ))
          ) : (
            <p>No jobs match your filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default JobSeekerDashboard;
