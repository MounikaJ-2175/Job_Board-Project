import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function ViewApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    API.get(`/jobs/applicants/${jobId}`)
      .then(res => setApplicants(res.data))
      .catch(() => toast.error('❌ Failed to load applicants'));
  }, [jobId]);

  return (
    <div className="form">
      <h2>👤 Applicants for Job ID: {jobId}</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="grid">
          {applicants.map(app => (
            <div key={app._id} className="job-card">
              <h3>{app.username}</h3>
              <p>Email: {app.email}</p>
              {app.resume && (
                <p>
                  📄 Resume:{' '}
                  <a
                    href={`http://localhost:5000/uploads/${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewApplicants;
