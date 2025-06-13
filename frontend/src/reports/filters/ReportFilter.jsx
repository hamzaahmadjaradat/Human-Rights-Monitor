import React, { useState } from "react";

const ReportFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    date_from: "",
    date_to: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const empty = { status: "", city: "", date_from: "", date_to: "" };
    setFilters(empty);
    onFilter(empty);
  };

  return (
    <form className="report-filter" onSubmit={handleSubmit}>
      <h3>Filter Reports</h3>

      <div className="filter-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="under_investigation">under_investigation</option>
          <option value="resolved">resolved</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          name="city"
          placeholder="Enter city"
          value={filters.city}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="date_from">Date From</label>
        <input
          id="date_from"
          type="date"
          name="date_from"
          value={filters.date_from}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="date_to">Date To</label>
        <input
          id="date_to"
          type="date"
          name="date_to"
          value={filters.date_to}
          onChange={handleChange}
        />
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn-primary">Apply</button>
        <button type="button" onClick={handleReset} className="btn-secondary">Reset</button>
      </div>
    </form>
  );
};

export default ReportFilter;
