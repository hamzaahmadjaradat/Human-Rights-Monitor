import React, { useState } from 'react';
import VictimForm from '../components/VictimForm';
import VictimList from '../components/VictimList';

const mockVictims = [
  {
    _id: '1',
    name: 'Jane Doe',
    dob: '1990-04-23',
    gender: 'Female',
    address: '123 Main St, Springfield',
    contact_info: '555-1234',
    statement: 'I witnessed the incident on Main Street.'
  },
  {
    _id: '2',
    name: 'John Smith',
    dob: '1985-11-10',
    gender: 'Male',
    address: '456 Elm St, Shelbyville',
    contact_info: '555-5678',
    statement: 'I was a victim of a robbery downtown.'
  },
  {
    _id: '3',
    name: 'Alice Johnson',
    dob: '1995-06-15',
    gender: 'Female',
    address: '789 Oak St, Capital City',
    contact_info: '555-9012',
    statement: 'I saw suspicious activity in the neighborhood.'
  }
];

const VictimPage = () => {
  const [victims, setVictims] = useState(mockVictims);
  const [editingVictim, setEditingVictim] = useState(null);


  const handleCreate = (victim) => {
    const newVictim = {
      ...victim,
      _id: Math.random().toString(36).substr(2, 9)
    };
    setVictims(prev => [...prev, newVictim]);
    alert('Victim created');
  };

  const handleUpdate = (victim) => {
    setVictims(prev => prev.map(v => v._id === victim._id ? victim : v));
    setEditingVictim(null);
    alert('Victim updated');
  };

  const handleDelete = (id) => {
    setVictims(prev => prev.filter(v => v._id !== id));
    alert('Victim deleted');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingVictim ? 'Edit Victim' : 'Register New Victim'}
      </h2>
      <VictimForm
        onSubmit={editingVictim ? handleUpdate : handleCreate}
        initialData={editingVictim}
        submitText={editingVictim ? 'Update' : 'Create'}
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">Victim Records</h2>
      <VictimList
        victims={victims}
        onEdit={setEditingVictim}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default VictimPage;
