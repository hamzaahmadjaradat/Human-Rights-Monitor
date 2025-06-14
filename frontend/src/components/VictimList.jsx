import React from 'react';

const VictimList = ({ victims, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {victims.map(victim => (
        <div key={victim._id} className="p-4 border rounded shadow">
          <p><strong>Name:</strong> {victim.name}</p>
          <p><strong>DOB:</strong> {victim.dob}</p>
          <p><strong>Gender:</strong> {victim.gender}</p>
          <p><strong>Address:</strong> {victim.address}</p>
          <p><strong>Contact Info:</strong> {victim.contact_info}</p>
          <p><strong>Statement:</strong> {victim.statement}</p>
          <div className="space-x-2 mt-2">
            <button onClick={() => onEdit(victim)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
            <button onClick={() => onDelete(victim._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VictimList;
