import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './casesCss/CaseDetails.css';

function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  const fetchCaseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/cases/${id}`);
      setCaseData(response.data);
    } catch (err) {
      setError('Failed to load case details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="case-loading">Loading...</p>;
  if (error) return <p className="case-error">{error}</p>;

  return (
    <div className="case-details-page">
      <h2 className="case-title-detail">{caseData.title}</h2>
      <div className="case-info-block">
        <p><strong>Description:</strong> {caseData.description}</p>
        <p><strong>Status:</strong> {caseData.status}</p>
        <p><strong>Region:</strong> {caseData.location?.region}</p>
        <p><strong>Country:</strong> {caseData.location?.country}</p>
        <p><strong>Date Occurred:</strong> {new Date(caseData.date_occurred).toLocaleDateString()}</p>
        <p><strong>Created By:</strong> {caseData.created_by}</p>
      </div>
    </div>
  );
}

export default CaseDetails;
