import React, { useState, useEffect } from 'react';

const VictimForm = ({ onSubmit, initialData, submitText }) => {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    contact_info: '',
    statement: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['name', 'dob', 'gender', 'address', 'contact_info', 'statement'].map(field => (
        <div key={field}>
          <label className="block font-medium capitalize">{field.replace('_', ' ')}</label>
          <input
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {submitText || 'Submit'}
      </button>
    </form>
  );
};

export default VictimForm;

