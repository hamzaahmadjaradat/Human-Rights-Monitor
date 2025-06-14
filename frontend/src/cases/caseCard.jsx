import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';
import './casesCss/CaseCard.css';
import UpdateCaseStatusModal from './UpdateCaseStatusModal';

const CaseCard = ({ caseItem, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleStatusUpdateClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to archive this case?')) {
      onDelete(caseItem._id);
    }
  };

  return (
    <div
      className="case-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Delete Icon */}
      {hovered && (
        <Trash
          className="delete-icon"
          onClick={handleDeleteClick}
          size={20}
          title="Delete Case"
        />
      )}

      <div className="case-info">
        <h3 className="case-title">{caseItem.title}</h3>
        <div className="case-meta">
          <span><strong>Status:</strong> {caseItem.status}</span>
          <span><strong>Region:</strong> {caseItem.location?.region || 'N/A'}</span>
          <span><strong>Date:</strong> {new Date(caseItem.date_occurred).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/cases/${caseItem._id}`}>
          <button className="view-button">View Details</button>
        </Link>
        <button className="status-button" onClick={handleStatusUpdateClick}>
          Change Status
        </button>
      </div>

      {showModal && (
        <UpdateCaseStatusModal
          show={showModal}
          onHide={() => setShowModal(false)}
          caseId={caseItem._id}
        />
      )}
    </div>
  );
};

export default CaseCard;
