import React, { useState, useEffect } from "react";
import "./reportscss/index.css";
import ReportForm from "./forms/ReportForm";
import ReportFilter from "./filters/ReportFilter";
import ReportList from "./lists/ReportList";
import { fetchReports, updateReportStatus, createReport } from "../services/api";

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadReports = async (f = {}) => {
    setLoading(true);
    try {
      const data = await fetchReports(f);
      setReports(data);
    } catch {
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showForm) loadReports(filters);
  }, [filters, showForm]);

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await createReport(formData);
      setShowForm(false);
      loadReports(filters);
    } catch {
      alert("Failed to create report");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      await updateReportStatus(id, status);
      loadReports(filters);
    } catch {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="incident-container">
      <header className="incident-header">
        <h1 className="incident-title text-gradient">Incident Reports</h1>
        <p className="incident-subtitle">
          {showForm
            ? "Fill out the form below to submit a new report"
            : "Create, filter, and manage incident reports"}
        </p>
        <button
          className={`btn btn-primary ${showForm ? "btn-secondary" : ""}`}
          onClick={() => setShowForm((f) => !f)}
        >
          {showForm ? "Cancel" : "Create Report"}
        </button>
      </header>

      {showForm ? (
        // ---- CREATE MODE: only the form ----
        <section className="incident-form">
          <ReportForm onSubmit={handleCreate} />
        </section>
      ) : (
        // ---- VIEW MODE: filters + list ----
        <div className="incident-grid">
          <aside className="reports-section">
            <ReportFilter onFilter={setFilters} />
          </aside>
          <main className="reports-section">
            {loading ? (
              <div className="empty-state">
                <p>Loading reports…</p>
              </div>
            ) : (
              <div className="reports-grid">
                <ReportList
                  reports={reports}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;
