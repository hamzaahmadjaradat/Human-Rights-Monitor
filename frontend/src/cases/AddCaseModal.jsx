import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { CheckCircleFill } from "react-bootstrap-icons";

export default function AddCaseModal({ show, onHide, onAdded }) {
  const [caseId, setCaseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [violationTypes, setViolationTypes] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dateOccurred, setDateOccurred] = useState("");
  const [dateReported, setDateReported] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const [perpetratorName, setPerpetratorName] = useState("");
  const [perpetratorType, setPerpetratorType] = useState("");
  const [evidenceType, setEvidenceType] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceDate, setEvidenceDate] = useState("");

  const [allVictims, setAllVictims] = useState([]);
  const [selectedVictims, setSelectedVictims] = useState([]);

  useEffect(() => {
    if (show) {
      axios
        .get("http://localhost:8000/individuals/victims")
        .then((res) => setAllVictims(res.data))
        .catch((err) => {
          console.error("Error fetching victims:", err);
          setAllVictims([]);
        });
    }
  }, [show]);

  const toggleVictim = (victim) => {
    const exists = selectedVictims.some((v) => v._id === victim._id);
    if (exists) {
      setSelectedVictims(selectedVictims.filter((v) => v._id !== victim._id));
    } else {
      setSelectedVictims([...selectedVictims, victim]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const perpetrators = [{ name: perpetratorName, type: perpetratorType }];
      const evidence = [{
        type: evidenceType,
        url: evidenceUrl,
        description: evidenceDescription,
        date_captured: evidenceDate,
      }];

      await axios.post("http://localhost:8000/cases/", {
        case_id: caseId,
        title,
        description,
        violation_types: violationTypes.split(",").map((s) => s.trim()),
        status,
        priority,
        location: {
          country,
          region,
          coordinates: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
        date_occurred: dateOccurred,
        date_reported: dateReported,
        victims: selectedVictims.map((v) => v._id),
        perpetrators,
        evidence,
        created_by: createdBy,
      });
      onAdded();
      onHide();
    } catch (error) {
      alert("Error: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Case</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group><Form.Label>Title</Form.Label><Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Violation Types (comma separated)</Form.Label><Form.Control value={violationTypes} onChange={(e) => setViolationTypes(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Status</Form.Label><Form.Control value={status} onChange={(e) => setStatus(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Priority</Form.Label><Form.Control value={priority} onChange={(e) => setPriority(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Country</Form.Label><Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Region</Form.Label><Form.Control value={region} onChange={(e) => setRegion(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Longitude</Form.Label><Form.Control value={longitude} onChange={(e) => setLongitude(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Latitude</Form.Label><Form.Control value={latitude} onChange={(e) => setLatitude(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Date Occurred</Form.Label><Form.Control type="datetime-local" value={dateOccurred} onChange={(e) => setDateOccurred(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Date Reported</Form.Label><Form.Control type="datetime-local" value={dateReported} onChange={(e) => setDateReported(e.target.value)} required /></Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Victims (click to select)</Form.Label>
            <div style={{ border: "1px solid #7F8A5A", borderRadius: "10px", padding: "10px", height: "180px", overflowY: "auto", backgroundColor: "#f9f9f9", display: "flex", flexDirection: "column", gap: "6px" }}>
              {allVictims.length === 0 ? <div>No victims available</div> : allVictims.map((victim) => {
                const isSelected = selectedVictims.some((v) => v._id === victim._id);
                return (
                  <div key={victim._id} onClick={() => toggleVictim(victim)} style={{ cursor: "pointer", padding: "8px 12px", borderRadius: "8px", backgroundColor: isSelected ? "#d1e7dd" : "white", border: isSelected ? "2px solid #0f5132" : "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      {victim.anonymous && <strong style={{ color: "#a00" }}>[Anonymous] </strong>}
                      <strong>{victim.demographics?.gender || "Unknown"}</strong> | Age: {victim.demographics?.age || "-"} | {victim.demographics?.ethnicity || "-"}<br />
                      Occupation: {victim.demographics?.occupation || "-"}
                    </div>
                    {isSelected && <CheckCircleFill color="#198754" size={20} />}
                  </div>
                );
              })}
            </div>
          </Form.Group>

          <h5>Perpetrator Info</h5>
          <Form.Group><Form.Label>Name</Form.Label><Form.Control value={perpetratorName} onChange={(e) => setPerpetratorName(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Type</Form.Label><Form.Control value={perpetratorType} onChange={(e) => setPerpetratorType(e.target.value)} /></Form.Group>

          <h5 className="mt-3">Evidence Info</h5>
          <Form.Group><Form.Label>Type</Form.Label><Form.Control value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>URL</Form.Label><Form.Control value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Date Captured</Form.Label><Form.Control type="date" value={evidenceDate} onChange={(e) => setEvidenceDate(e.target.value)} /></Form.Group>


          <Button type="submit" className="mt-3" variant="primary">Add Case</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
