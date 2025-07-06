import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => toast.error('Failed to fetch job'));
  }, [id]);

  const handleDelete = async () => {
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      navigate('/employer-dashboard');
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Job Type:</strong> {job.jobType}</p>
      <p><strong>Experience:</strong> {job.experienceLevel}</p>
      <p><strong>Salary:</strong> ₹{job.salary}</p>
      <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

      <button onClick={() => navigate(`/edit-job/${job._id}`)}>Edit</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
    </div>
  );
}

export default JobDetails;
