import React, { useState } from "react";
import LocationPicker from "../map/LocationPicker";
import { createReport } from "../../services/api";

const violationOptions = [
  { label: "Arbitrary Detention", value: "arbitrary_detention" },
  { label: "Torture", value: "torture" },
  { label: "Forced Disappearance", value: "forced_disappearance" },
];


const initialForm = {
  reporter_type: "",
  anonymous: true,
  contact_info: { email: "", phone: "", preferred_contact: "" },
  incident_details: {
    date: "",
    location: { country: "", city: "", coordinates: [0, 0] },
    description: "",
    violation_types: [],
  },
  files: [],
};

const ReportForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialForm);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "anonymous") {
      setForm(f => ({ ...f, anonymous: checked }));
    } else if (name.startsWith("contact_info.")) {
      const key = name.split(".")[1];
      setForm(f => ({
        ...f,
        contact_info: { ...f.contact_info, [key]: value },
      }));
    } else if (name.startsWith("incident_details.location.")) {
      const key = name.split(".")[2];
      setForm(f => ({
        ...f,
        incident_details: {
          ...f.incident_details,
          location: {
            ...f.incident_details.location,
            [key]: value,
          },
        },
      }));
    } else if (name.startsWith("incident_details.")) {
      const key = name.split(".")[1];
      setForm(f => ({
        ...f,
        incident_details: { ...f.incident_details, [key]: value },
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleViolationChange = (e) => {
    const { value, checked } = e.target;
    setForm(f => {
      const list = new Set(f.incident_details.violation_types);
      checked ? list.add(value) : list.delete(value);
      return {
        ...f,
        incident_details: {
          ...f.incident_details,
          violation_types: Array.from(list),
        },
      };
    });
  };

  const handleLocationChange = (coords) => {
    setForm(f => ({
      ...f,
      incident_details: {
        ...f.incident_details,
        location: { ...f.incident_details.location, coordinates: coords },
      },
    }));
  };

  const handleFilesChange = (e) => {
    setForm(f => ({ ...f, files: Array.from(e.target.files) }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("reporter_type", form.reporter_type);
    data.append("anonymous", form.anonymous);
    data.append("email", form.contact_info.email);
    data.append("phone", form.contact_info.phone);
    data.append("preferred_contact", form.contact_info.preferred_contact);
  
    data.append("date", form.incident_details.date);
    data.append("country", form.incident_details.location.country);
    data.append("city", form.incident_details.location.city);
    data.append("description", form.incident_details.description);
    data.append("violation_types", form.incident_details.violation_types.join(","));
  
    data.append("coordinates", JSON.stringify({
      type: "Point",
      coordinates: form.incident_details.location.coordinates
    }));
  
    form.files.forEach((file) => {
      data.append("files", file);
    });
  
    try {
      await createReport(data);
      alert("Report submitted successfully!");
      onSubmit && onSubmit(data);
      setForm(initialForm);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit report.");
    }
  };
  

  return (
    <form className="report-form" onSubmit={submitForm}>
      <h2>Submit Incident Report</h2>

      <label>
        Reporter Type
        <input
          name="reporter_type"
          value={form.reporter_type}
          onChange={handleInputChange}
          required
        />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="anonymous"
          checked={form.anonymous}
          onChange={handleInputChange}
        />
        Anonymous
      </label>

      <fieldset>
        <legend>Contact Information</legend>
        <input
          name="contact_info.email"
          type="email"
          placeholder="Email"
          value={form.contact_info.email}
          onChange={handleInputChange}
        />
        <input
          name="contact_info.phone"
          placeholder="Phone"
          value={form.contact_info.phone}
          onChange={handleInputChange}
        />
        <input
          name="contact_info.preferred_contact"
          placeholder="Preferred Contact Method"
          value={form.contact_info.preferred_contact}
          onChange={handleInputChange}
        />
      </fieldset>

      <fieldset>
        <legend>Incident Details</legend>
        <input
          name="incident_details.date"
          type="date"
          value={form.incident_details.date}
          onChange={handleInputChange}
          required
        />
        <input
          name="incident_details.location.country"
          placeholder="Country"
          value={form.incident_details.location.country}
          onChange={handleInputChange}
          required
        />
        <input
          name="incident_details.location.city"
          placeholder="City"
          value={form.incident_details.location.city}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="incident_details.description"
          placeholder="Description"
          value={form.incident_details.description}
          onChange={handleInputChange}
          required
        />
      </fieldset>

      <fieldset>
        <legend>Violation Types</legend>
        {violationOptions.map(({ label, value }) => (
          <label key={value} className="checkbox-label">
            <input
              type="checkbox"
              value={value}
              checked={form.incident_details.violation_types.includes(value)}
              onChange={handleViolationChange}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Pick Location</legend>
        <LocationPicker onLocationSelect={handleLocationChange} />
      </fieldset>

      <label>
        Upload Evidence
        <input type="file" multiple onChange={handleFilesChange} />
      </label>

      <button type="submit">Submit Report</button>
    </form>
  );
};

export default ReportForm;
