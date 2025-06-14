import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Select from "react-select";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CREATED_BY_ID = "507f1f77bcf86cd799439012";

function LocationPicker({ setLatitude, setLongitude, setCountry, setRegion }) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      setLatitude(lat);
      setLongitude(lng);

      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const { address } = res.data;
        setCountry(address.country || "");
        setRegion(address.city || address.town || address.village || "");
      } catch {
        setCountry("");
        setRegion("");
      }
    },
  });

  return null;
}

export default function AddCaseModal({ show, onHide, onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [violationTypes, setViolationTypes] = useState([]);
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dateOccurred, setDateOccurred] = useState("");
  const [dateReported, setDateReported] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceDate, setEvidenceDate] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [allVictims, setAllVictims] = useState([]);
  const [selectedVictims, setSelectedVictims] = useState([]);
  const [victimSearch, setVictimSearch] = useState("");
  const [perpetrators, setPerpetrators] = useState([{ name: "", type: "" }]);
  const [createdBy] = useState(DEFAULT_CREATED_BY_ID);
    const violationTypeOptions = [
    { value: "arbitrary_detention", label: "Arbitrary Detention" },
    { value: "forced_displacement", label: "Forced Displacement" },
    { value: "torture", label: "Torture" },
    { value: "property_destruction", label: "Property Destruction" },
    { value: "extrajudicial_killing", label: "Extrajudicial Killing" },
    { value: "enforced_disappearance", label: "Enforced Disappearance" },
    { value: "sexual_violence", label: "Sexual Violence" },
    { value: "freedom_of_expression_violation", label: "Freedom of Expression Violation" },
      { value: "unlawful_search", label: "Unlawful Search or Seizure" },
  { value: "child_recruitment", label: "Child Recruitment or Use in Armed Conflict" },
  { value: "religious_persecution", label: "Religious Persecution" },
  { value: "ethnic_cleansing", label: "Ethnic Cleansing" },
  { value: "systematic_discrimination", label: "Systematic Discrimination" },
  { value: "internet_shutdown", label: "Internet Shutdown or Censorship" },
  { value: "judicial_harassment", label: "Judicial Harassment" },
  { value: "police_brutality", label: "Police Brutality" },
  { value: "labor_rights_violation", label: "Labor Rights Violation" },
  { value: "arson", label: "Arson of Civilian Property" },
  { value: "robbery", label: "Robbery or Armed Theft" },
  { value: "siege", label: "Siege and Blockade" },
  { value: "starvation", label: "Starvation as a Weapon" },
  { value: "use_of_banned_weapons", label: "Use of Banned Weapons (e.g., chemical, cluster bombs)" }

    
    ];

  const statusOptions = ["new", "under_investigation", "resolved", "archived"];

  useEffect(() => {
    if (show) {
      axios.get("http://localhost:8000/individuals/victims")
        .then((res) => setAllVictims(res.data))
        .catch(() => setAllVictims([]));
    }
  }, [show]);

  const toggleVictim = (victim) => {
    const exists = selectedVictims.some((v) => v._id === victim._id);
    setSelectedVictims(
      exists ? selectedVictims.filter((v) => v._id !== victim._id)
             : [...selectedVictims, victim]
    );
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

  const updatePerpetrator = (index, field, value) => {
    const updated = [...perpetrators];
    updated[index][field] = value;
    setPerpetrators(updated);
  };

  const addPerpetrator = () => {
    setPerpetrators([...perpetrators, { name: "", type: "" }]);
  };

  const removePerpetrator = (index) => {
    const updated = [...perpetrators];
    updated.splice(index, 1);
    setPerpetrators(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
      alert("Please enter valid longitude and latitude.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("priority", priority);
    formData.append("created_by", createdBy);
    formData.append("date_occurred", dateOccurred);
    formData.append("date_reported", dateReported);
    formData.append("violation_types", JSON.stringify(violationTypes));
    formData.append("victims", JSON.stringify(selectedVictims.map((v) => v._id.$oid || v._id)));
    formData.append("perpetrators", JSON.stringify(perpetrators.filter(p => p.name && p.type)));
    formData.append("location", JSON.stringify({
      country,
      region,
      coordinates: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] }
    }));
    formData.append("evidence_description", evidenceDescription);
    formData.append("evidence_date", evidenceDate);
    evidenceFiles.forEach(file => formData.append("evidence_files", file));

    try {
      await axios.post("http://localhost:8000/cases/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAdded();
      onHide();
    } catch (error) {
      alert("Error: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton><Modal.Title>Add New Case</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group><Form.Label>Title</Form.Label><Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group>

          <Form.Group><Form.Label>Description</Form.Label><Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required /></Form.Group>

          <Form.Group><Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group><Form.Label>Priority</Form.Label><Form.Control value={priority} onChange={(e) => setPriority(e.target.value)} /></Form.Group>
        <Form.Group>
        <Form.Label>Violation Types</Form.Label>
   <Select
  isMulti
  options={violationTypeOptions}
  value={violationTypeOptions.filter(opt => violationTypes.includes(opt.value))}
  onChange={(selected) => setViolationTypes(selected.map(opt => opt.value))}
  classNamePrefix="select"
  menuPortalTarget={document.body}
  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
/>
        </Form.Group>

          <Form.Group><Form.Label>Location</Form.Label>
            <div style={{ height: "300px" }}>
              <MapContainer center={[31.95, 35.23]} zoom={8} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker setLatitude={setLatitude} setLongitude={setLongitude} setCountry={setCountry} setRegion={setRegion} />
                {latitude && longitude && <Marker position={[latitude, longitude]} />}
              </MapContainer>
            </div>
            {latitude && longitude && <small>Lat: {latitude}, Lng: {longitude}, Country: {country}, Region: {region}</small>}
          </Form.Group>

          <Form.Group><Form.Label>Date Occurred</Form.Label><Form.Control type="datetime-local" value={dateOccurred} onChange={(e) => setDateOccurred(e.target.value)} required /></Form.Group>

          <Form.Group><Form.Label>Date Reported</Form.Label><Form.Control type="datetime-local" value={dateReported} onChange={(e) => setDateReported(e.target.value)} required /></Form.Group>

          <h5 className="mt-3">Victims</h5>
          <Form.Group className="mb-2">
            <Form.Control type="text" placeholder="Search victims..." value={victimSearch} onChange={(e) => setVictimSearch(e.target.value)} />
          </Form.Group>

          <div style={{ maxHeight: "250px", overflowY: "auto" }} className="d-flex flex-wrap gap-2">
            {allVictims.filter(v => v.demographics?.name?.toLowerCase().includes(victimSearch.toLowerCase()))
              .map((v) => {
                const isSelected = selectedVictims.some((sv) => sv._id === v._id);
                return (
                  <div key={v._id.$oid || v._id}
                    onClick={() => toggleVictim(v)}
                    style={{
                      border: isSelected ? '2px solid green' : '1px solid #ccc',
                      borderRadius: '10px',
                      padding: '10px',
                      cursor: 'pointer',
                      background: isSelected ? '#e0fce0' : 'white',
                      width: '140px',
                      textAlign: 'center',
                    }}
                  >
                    <strong>{v.demographics?.name || "Unnamed"}</strong><br />
                    <small>{v.demographics?.occupation}</small>
                  </div>
                );
              })}
          </div>

          <h5>Perpetrators</h5>
          {perpetrators.map((p, index) => (
            <Row key={index} className="mb-2">
              <Col><Form.Control placeholder="Name" value={p.name} onChange={(e) => updatePerpetrator(index, "name", e.target.value)} /></Col>
              <Col><Form.Control placeholder="Type" value={p.type} onChange={(e) => updatePerpetrator(index, "type", e.target.value)} /></Col>
              <Col xs="auto"><Button variant="danger" onClick={() => removePerpetrator(index)}>Remove</Button></Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addPerpetrator} className="mb-3">Add Perpetrator</Button>

          <h5>Evidence</h5>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Date Captured</Form.Label><Form.Control type="date" value={evidenceDate} onChange={(e) => setEvidenceDate(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Upload Files</Form.Label><Form.Control type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf,video/*" /></Form.Group>

          <div className="d-flex flex-wrap gap-2 mt-2">
            {filePreviews.map((img, i) => (
              <div key={i} className="position-relative">
                <Image src={img} fluid rounded style={{ height: '120px', width: '120px', objectFit: 'cover' }} />
                <Button variant="danger" size="sm" style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={() => handleRemoveImage(i)}>X</Button>
              </div>
            ))}
          </div>

          <Button type="submit" className="mt-4" variant="primary">Add Case</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
