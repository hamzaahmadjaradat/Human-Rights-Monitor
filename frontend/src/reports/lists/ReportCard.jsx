import React from "react";

const ReportCard = ({ report, onStatusChange }) => {
  return (
    <div className="report-card">
      <h3>{report.reporter_type}</h3>
      <p>Status: {report.status}</p>
      <p>Date: {report.incident_details?.date}</p>
      <p>City: {report.incident_details?.location?.city}</p>
      <button onClick={() => onStatusChange(report._id, "resolved")}>
        Mark as Resolved
      </button>
    </div>
  );
};

export default ReportCard;
