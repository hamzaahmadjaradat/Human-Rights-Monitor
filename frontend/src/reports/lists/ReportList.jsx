import React from "react";

const ReportList = ({ reports, onStatusChange }) => {
  const handleStatusChange = (id, e) => {
    onStatusChange(id, e.target.value);
  };

  return (
    <div>
      <h3>Reports</h3>
      {reports.length === 0 && <p>No reports found.</p>}
      {reports.map((r) => (
        <div key={r._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10, borderRadius: 5 }}>
          <p><strong>Reporter Type:</strong> {r.reporter_type}</p>
          <p><strong>Status:</strong>
            <select value={r.status} onChange={(e) => handleStatusChange(r._id, e)}>
              <option value="new">New</option>
              <option value="under_investigation">under_investigation</option>
              <option value="resolved">resolved</option>
            </select>
          </p>
          <p><strong>Date:</strong> {new Date(r.incident_details.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {r.incident_details.location.city}, {r.incident_details.location.country}</p>
          <p><strong>Description:</strong> {r.incident_details.description}</p>
          <p><strong>Violations:</strong> {r.incident_details.violation_types.join(", ")}</p>
          {r.evidence && r.evidence.length > 0 && (
            <div>
              <strong>Evidence:</strong>
              <ul>
                {r.evidence.map((file, idx) => (
                  <li key={idx}>
                    <a href={`/${file.url}`} target="_blank" rel="noreferrer">{file.url.split("/").pop()}</a> ({file.type})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReportList;
