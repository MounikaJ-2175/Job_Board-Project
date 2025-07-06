import { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function CompanyProfile() {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/company/me')
      .then(res => {
        const { companyName, website, description, location } = res.data;
        setFormData({
          companyName: companyName || '',
          website: website || '',
          description: description || '',
          location: location || ''
        });
      })
      .catch(() => toast.error('❌ Failed to load company profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/company/me', formData);
      toast.success('✅ Company profile updated');
    } catch {
      toast.error('❌ Update failed');
    }
  };

  if (loading) return <p>⏳ Loading company info...</p>;

  return (
    <div className="form">
      <h2>🏢 Company Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          name="website"
          type="url"
          placeholder="Website (https://example.com)"
          value={formData.website}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Headquarters Location"
          value={formData.location}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Brief Description (max 250 chars)"
          maxLength="250"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Update Company Profile</button>
      </form>
    </div>
  );
}

export default CompanyProfile;
