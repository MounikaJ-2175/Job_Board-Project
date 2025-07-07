import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salary: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request will be sent with token automatically via Axios instance
      await API.post('/jobs', form);
      toast.success('🎉 Job posted successfully!');
      navigate('/employer-dashboard');
    } catch (err) {
      console.error('Error posting job:', err);
      toast.error(err.response?.data?.message || '❌ Failed to post job');
    }
  };

  return (
    <div className="form">
      <h2>📝 Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <select
          name="jobType"
          value={form.jobType}
          onChange={handleChange}
          required
        >
          <option value="">Select Job Type</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <select
          name="experienceLevel"
          value={form.experienceLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Experience Level</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior Level</option>
          <option>Executive</option>
        </select>
        <input
          name="salary"
          placeholder="Salary (INR)"
          value={form.salary}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;
