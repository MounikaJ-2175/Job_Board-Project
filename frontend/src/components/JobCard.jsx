import React from 'react';

function JobCard({ job, applied, onApply }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong> Company:</strong> {job.companyName || 'N/A'}</p>
      <p><strong> Location:</strong> {job.location || 'Remote'}</p>
      <p><strong> Type:</strong> {job.jobType}</p>
      <p><strong> Experience:</strong> {job.experienceLevel}</p>
      <p><strong> Salary:</strong> ₹{job.salary}</p>
      <p>{job.description ? job.description.slice(0, 120) + '...' : 'No description provided.'}</p>

      {onApply && (
        <button
          className="btn"
          onClick={() => onApply(job._id)}
          disabled={applied}
          style={{
            backgroundColor: applied ? '#bbb' : '#28a745',
            color: '#fff',
            cursor: applied ? 'not-allowed' : 'pointer',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            marginTop: '0.5rem',
          }}
        >
          {applied ? '✔️ Applied' : 'Apply Now'}
        </button>
      )}
    </div>
  );
}

export default JobCard;
