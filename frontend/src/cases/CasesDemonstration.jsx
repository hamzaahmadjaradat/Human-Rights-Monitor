import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CaseCard from './caseCard.jsx';
import AddCaseModal from './AddCaseModal.jsx';
import './casesCss/CasesDemonstration.css';

function CasesDemonstration() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);
  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cases/');
      setCases(response.data.results);
    } catch (err) {
      setError('Failed to fetch cases.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCaseClick = () => setShowAddModal(true);
  const handleModalClose = () => setShowAddModal(false);
  const handleCaseAdded = () => fetchCases();
  const handleDeleteCase = async (caseId) => {
  try {
    await axios.delete(`http://localhost:8000/cases/${caseId}`);
    setCases(cases.filter(c => c._id !== caseId));
  } catch (err) {
    alert('Failed to delete case.');
    console.error(err);
  }
};


  if (loading) return <p>Loading cases...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cases-page">
      <h2 className="cases-heading">Recent Human Rights Cases</h2>

      <div className="add-button-container">
        <button className="add-case-button" onClick={handleAddCaseClick}>
          + Add Case
        </button>
      </div>

      <div className="case-card-list">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem._id} caseItem={caseItem} onDelete={handleDeleteCase}/>

        ))}
      </div>

      <AddCaseModal
        show={showAddModal}
        onHide={handleModalClose}
        onCaseAdded={handleCaseAdded}
      />
    </div>
  );
}

export default CasesDemonstration;



