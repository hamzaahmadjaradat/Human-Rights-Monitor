import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function UpdateCaseStatusModal({ show, onHide, caseId, onUpdated }) {
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [currentCase, setCurrentCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const statusOptions = ["new", "under_investigation", "resolved", "archived"];

  useEffect(() => {
    if (show && caseId) {
      axios
        .get(`http://localhost:8000/cases/${caseId}`)
        .then((res) => {
          setCurrentCase(res.data);
          setNewStatus(res.data.status || "");
        })
        .catch((err) => {
          console.error("Failed to fetch case:", err);
          setMessage("Error loading case data.");
        });
    }
  }, [show, caseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.patch(`http://localhost:8000/cases/${caseId}`, {
        new_status: newStatus,
        reason,
        notes,
        changed_by: "admin" // You may replace this with dynamic user if available
      });
      setMessage("✅ Status updated successfully!");
      if (onUpdated) onUpdated();
      onHide();
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("❌ Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Case Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentCase ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Case Title</Form.Label>
              <Form.Control type="text" value={currentCase.title} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Status</Form.Label>
              <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} required>
                <option value="">-- Select Status --</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Change</Form.Label>
              <Form.Control
                type="text"
                placeholder="Optional reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>

            {message && (
            <div className="mb-3">
                <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert">
                {message}
                </div>
            </div>
            )}

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </Form>
        ) : (
          <p>Loading case details...</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
