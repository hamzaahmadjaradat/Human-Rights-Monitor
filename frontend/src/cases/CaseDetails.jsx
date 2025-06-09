import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './casesCss/CaseDetails.css';

const CaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/cases/${id}`);
        setCaseData(response.data);
      } catch (err) {
        setError('❌ Failed to load case details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (loading) return <div className="case-details">Loading case details...</div>;
  if (error) return <div className="case-details error">{error}</div>;
  if (!caseData) return <div className="case-details">No case data found.</div>;

  const {
    title,
    description,
    violation_types,
    status,
    priority,
    location,
    date_occurred,
    date_reported,
    created_by,
    created_at,
    updated_at,
    victims,
    perpetrators,
    evidence,
  } = caseData;

  return (
    <div className="case-details">
      <h2>{title}</h2>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Priority:</strong> {priority}</p>
      <p><strong>Violation Types:</strong> {violation_types.join(', ')}</p>
      
      <p><strong>Country:</strong> {location?.country || 'N/A'}</p>
      <p><strong>Region:</strong> {location?.region || 'N/A'}</p>
      <p><strong>Coordinates:</strong> {location?.coordinates?.coordinates?.join(', ') || 'N/A'}</p>

      <p><strong>Date Occurred:</strong> {new Date(date_occurred).toLocaleString()}</p>
      <p><strong>Date Reported:</strong> {date_reported ? new Date(date_reported).toLocaleString() : 'Not reported'}</p>
      <p><strong>Created By:</strong> {created_by}</p>
      <p><strong>Created At:</strong> {new Date(created_at).toLocaleString()}</p>
      <p><strong>Last Updated:</strong> {new Date(updated_at).toLocaleString()}</p>

      <p><strong>Victims:</strong> {victims.length > 0 ? victims.join(', ') : 'None'}</p>
      <p><strong>Perpetrators:</strong> {perpetrators.length > 0 ? perpetrators.join(', ') : 'None'}</p>
      <p><strong>Evidence:</strong> {evidence.length > 0 ? evidence.join(', ') : 'None'}</p>
    </div>
  );
};

export default CaseDetails;
