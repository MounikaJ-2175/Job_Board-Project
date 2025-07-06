import { useState, useEffect } from 'react';

function JobFilters({ onFilter }) {
  const [jobTypes, setJobTypes] = useState([]);
  const [levels, setLevels] = useState([]);

  // Call onFilter whenever filters change
  useEffect(() => {
    onFilter({ jobTypes, levels });
  }, [jobTypes, levels, onFilter]);

  const toggleFilter = (value, setState, currentState) => {
    const updated = currentState.includes(value)
      ? currentState.filter((v) => v !== value)
      : [...currentState, value];
    setState(updated);
  };

  return (
    <div className="filters">
      <h3>Filters</h3>

      <p>Job Type</p>
      {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
        <label key={type} style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={jobTypes.includes(type)}
            onChange={() => toggleFilter(type, setJobTypes, jobTypes)}
          />
          {type}
        </label>
      ))}

      <p>Experience Level</p>
      {['Entry', 'Mid', 'Senior', 'Executive'].map((level) => (
        <label key={level} style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={levels.includes(level)}
            onChange={() => toggleFilter(level, setLevels, levels)}
          />
          {level}
        </label>
      ))}
    </div>
  );
}

export default JobFilters;
