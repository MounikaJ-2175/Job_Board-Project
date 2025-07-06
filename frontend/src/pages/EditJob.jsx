import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salary: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setForm(data);
      } catch {
        toast.error('❌ Failed to load job details');
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/jobs/${id}`, form);
      toast.success('✅ Job updated successfully');
      navigate('/employer-dashboard');
    } catch {
      toast.error('❌ Update failed');
    }
  };

  return (
    <div className="form">
      <h2>✏️ Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
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
        <select name="jobType" value={form.jobType} onChange={handleChange} required>
          <option value="">Select Job Type</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} required>
          <option value="">Select Experience Level</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior Level</option>
          <option>Executive</option>
        </select>
        <input
          name="salary"
          placeholder="Salary in INR"
          value={form.salary}
          onChange={handleChange}
          required
        />
        <button type="submit">✅ Update Job</button>
      </form>
    </div>
  );
}

export default EditJob;
