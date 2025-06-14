import React, { useEffect, useState } from 'react';

import axios from 'axios';
import './casesCss/CaseDetails.css';

import { useParams, Link } from 'react-router-dom';

function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [victimDetails, setVictimDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  const fetchVictimsInfo = async (victimIds) => {
    const promises = victimIds.map((victimId) =>
      axios.get(`http://localhost:8000/individuals/victims/${victimId}`).then(res => res.data).catch(() => null)
    );
    const results = await Promise.all(promises);
    setVictimDetails(results.filter(Boolean));
  };

  const fetchCaseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/cases/${id}`);
      setCaseData(response.data);
      if (response.data.victims?.length > 0) {
        await fetchVictimsInfo(response.data.victims);
      }
    } catch (err) {
      setError('Failed to load case details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="case-loading">Loading...</p>;
  if (error) return <p className="case-error">{error}</p>;

  return (
    <div className="case-details">
    <Link to="/cases" className="back-link">← Back to Cases</Link>
      <h2>{caseData.title}</h2>

      <div className="case-info-block">
        <p><strong>Description:</strong> {caseData.description}</p>
        <p><strong>Status:</strong> {caseData.status}</p>
        <p><strong>Priority:</strong> {caseData.priority || 'N/A'}</p>
        <p><strong>Violation Types:</strong> {caseData.violation_types?.join(', ')}</p>
        <p><strong>Country:</strong> {caseData.location?.country}</p>
        <p><strong>Region:</strong> {caseData.location?.region}</p>
        <p><strong>Coordinates:</strong> {caseData.location?.coordinates?.coordinates?.join(', ')}</p>
        <p><strong>Date Occurred:</strong> {new Date(caseData.date_occurred).toLocaleString()}</p>
        <p><strong>Date Reported:</strong> {new Date(caseData.date_reported).toLocaleString()}</p>
        <p><strong>Created At:</strong> {new Date(caseData.created_at).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(caseData.updated_at).toLocaleString()}</p>
      </div>

      <hr />
      <h4 className="section-title">Victims</h4>
{victimDetails.length > 0 ? (
  <div className="card-grid">
    {victimDetails.map((v, index) => (
      <div className="card" key={index}>
        <p><strong>Name:</strong> {v.demographics?.name || "Anonymous"}</p>
        <p><strong>Gender:</strong> {v.demographics?.gender}</p>
        <p><strong>Age:</strong> {v.demographics?.age}</p>
        <p><strong>Occupation:</strong> {v.demographics?.occupation}</p>
      </div>
    ))}
  </div>
) : (
  <p>No victim details available.</p>
)}

<h4 className="section-title">Perpetrators</h4>
{caseData.perpetrators?.length > 0 ? (
  <div className="card-grid">
    {caseData.perpetrators.map((p, index) => (
      <div className="card" key={index}>
        <p><strong>Name:</strong> {p.name}</p>
        <p><strong>Type:</strong> {p.type}</p>
      </div>
    ))}
  </div>
) : (
  <p>No perpetrators available.</p>
)}

      <hr />
      <h4>Evidence</h4>
    {caseData.evidence?.length > 0 ? (
      <div className="evidence-list">
        {caseData.evidence.map((evi, index) => (
          <div className="evidence-item" key={index}>
            <p><strong>Type:</strong> {evi.type}</p>
            <p><strong>Description:</strong> {evi.description}</p>
            <p><strong>Date Captured:</strong> {new Date(evi.date_captured).toLocaleDateString()}</p>
            {evi.url && (
              <img
                src={`http://localhost:8000${encodeURI(evi.url)}`}
                alt={`evidence-${index}`}
                className="evidence-image"
              />
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>No evidence available.</p>
    )}
    </div>
  );
}

export default CaseDetails;
