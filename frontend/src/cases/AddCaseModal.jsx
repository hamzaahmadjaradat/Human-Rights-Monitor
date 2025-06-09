import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import axios from "axios";
import { CheckCircleFill } from "react-bootstrap-icons";

export default function AddCaseModal({ show, onHide, onAdded }) {
  const [caseId, setCaseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [violationTypes, setViolationTypes] = useState("");
  const [status, setStatus] = useState("new");
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
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceDate, setEvidenceDate] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const violationTypeOptions = [
  "arbitrary_detention",
  "forced_displacement",
  "torture",
  "property_destruction",
  "extrajudicial_killing",
  "enforced_disappearance",
  "sexual_violence",
  "freedom_of_expression_violation"
];


  const [allVictims, setAllVictims] = useState([]);
  const [selectedVictims, setSelectedVictims] = useState([]);

  const statusOptions = ["new", "in_progress", "resolved", "archived"];

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

 const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files);

  const uniqueFiles = [...evidenceFiles];
  const uniquePreviews = [...filePreviews];

  newFiles.forEach(file => {
    if (!uniqueFiles.find(f => f.name === file.name && f.size === file.size)) {
      uniqueFiles.push(file);
      uniquePreviews.push(URL.createObjectURL(file));
    }
  });

  setEvidenceFiles(uniqueFiles);
  setFilePreviews(uniquePreviews);
};


  const handleRemoveImage = (index) => {
    const newFiles = [...evidenceFiles];
    const newPreviews = [...filePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setEvidenceFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const perpetrators =
      perpetratorName && perpetratorType
        ? [{ name: perpetratorName, type: perpetratorType }]
        : [];

    const formData = new FormData();
    formData.append("case_id", caseId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("priority", priority);
    formData.append("created_by", createdBy);
    formData.append("date_occurred", dateOccurred);
    formData.append("date_reported", dateReported);

    formData.append("location", JSON.stringify({
      country,
      region,
      coordinates: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    }));

    formData.append("violation_types", JSON.stringify(
      violationTypes.split(",").map((s) => s.trim())
    ));

    formData.append("victims", JSON.stringify(
      selectedVictims.map((v) => v._id)
    ));

    formData.append("perpetrators", JSON.stringify(perpetrators));
    formData.append("evidence_description", evidenceDescription);
    formData.append("evidence_date", evidenceDate);

    for (let i = 0; i < evidenceFiles.length; i++) {
      formData.append("evidence_files", evidenceFiles[i]);
    }

    try {
      await axios.post("http://localhost:8000/cases/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
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
          <Form.Group><Form.Label>Case ID</Form.Label><Form.Control value={caseId} onChange={(e) => setCaseId(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Title</Form.Label><Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label> </Form.Label><Form.Group className="mb-3">
  <Form.Label>Violation Types</Form.Label>
  <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9' }}>
    {violationTypeOptions.map((type) => (
      <Form.Check
        key={type}
        type="checkbox"
        id={`violation-${type}`}
        label={type.replace(/_/g, " ")}
        checked={violationTypes.includes(type)}
        onChange={(e) => {
          if (e.target.checked) {
            setViolationTypes([...violationTypes, type]);
          } else {
            setViolationTypes(violationTypes.filter((v) => v !== type));
          }
        }}
      />
    ))}
  </div>
</Form.Group>
</Form.Group>

          <Form.Group><Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group><Form.Label>Priority</Form.Label><Form.Control value={priority} onChange={(e) => setPriority(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Country</Form.Label><Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Region</Form.Label><Form.Control value={region} onChange={(e) => setRegion(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Longitude</Form.Label><Form.Control value={longitude} onChange={(e) => setLongitude(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Latitude</Form.Label><Form.Control value={latitude} onChange={(e) => setLatitude(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Date Occurred</Form.Label><Form.Control type="datetime-local" value={dateOccurred} onChange={(e) => setDateOccurred(e.target.value)} required /></Form.Group>
          <Form.Group><Form.Label>Date Reported</Form.Label><Form.Control type="datetime-local" value={dateReported} onChange={(e) => setDateReported(e.target.value)} required /></Form.Group>

         
          <h5 className="mt-3">Evidence Info (Optional)</h5>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Date Captured</Form.Label><Form.Control type="date" value={evidenceDate} onChange={(e) => setEvidenceDate(e.target.value)} /></Form.Group>

          <Form.Group controlId="evidenceFiles" className="mb-3">
            <Form.Label>Upload Files</Form.Label>
            <div style={{
              border: '1px solid #a6b17f',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fdfdfd'
            }}>
              {filePreviews.length > 0 && (
                <div className="mb-3 d-flex flex-wrap gap-2">
                  {filePreviews.map((img, index) => (
                    <div key={index} className="position-relative">
                      <Image
                        src={img}
                        fluid
                        rounded
                        style={{ height: '120px', width: '120px', objectFit: 'cover' }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{ position: 'absolute', top: '5px', right: '5px' }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Form.Control type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf,video/*" />
            </div>
          </Form.Group>

          <Button type="submit" className="mt-3" variant="primary">Add Case</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
