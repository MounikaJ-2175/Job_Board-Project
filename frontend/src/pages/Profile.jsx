import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    bio: '',
    skills: [],
    resume: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profile');
        const { username, email, location, bio, skills, resume } = data;
        setFormData({
          username,
          email,
          location: location || '',
          bio: bio || '',
          skills: skills || [],
          resume: resume || ''
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      setFormData({ ...formData, skills: value.split(',') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile', formData);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleFileUpload = async (e) => {
    const uploadData = new FormData();
    uploadData.append('resume', e.target.files[0]);

    try {
      const res = await API.post('/profile/upload-resume', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, resume: res.data.file }));
      toast.success('Resume uploaded successfully!');
    } catch {
      toast.error('Resume upload failed');
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="form">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          name="email"
          value={formData.email}
          readOnly
          disabled
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location (e.g., Hyderabad)"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Short bio (e.g., passionate frontend developer...)"
        />
        <input
          name="skills"
          value={formData.skills.join(',')}
          onChange={handleChange}
          placeholder="Skills (e.g., HTML, CSS, React, MongoDB)"
        />

        <label>Upload Resume (PDF):</label>
        <input type="file" accept=".pdf" onChange={handleFileUpload} />

        {formData.resume && (
          <p className="resume-link">
            📄 <a href={`http://localhost:5000/uploads/${formData.resume}`} target="_blank" rel="noreferrer">View Uploaded Resume</a>
          </p>
        )}

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
