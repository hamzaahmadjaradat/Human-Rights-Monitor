import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import CaseCard from './caseCard.jsx';
import AddCaseModal from './AddCaseModal.jsx';
import './casesCss/CasesDemonstration.css';

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

function CasesDemonstration() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [regions, setRegions] = useState([]);

  const [filters, setFilters] = useState({
    title: '',
    region: '',
    dateFrom: '',
    dateTo: '',
    violation_type: []
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    fetchCases(currentPage, appliedFilters);
  }, [currentPage, appliedFilters]);

 

const fetchCases = async (page = 1, applied = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);

  if (applied.title) params.append('title', applied.title);
  if (applied.region) params.append('region', applied.region);
  if (applied.dateFrom) params.append('date_from', applied.dateFrom);
  if (applied.dateTo) params.append('date_to', applied.dateTo);
  if (applied.violation_type?.length > 0) {
    const types = applied.violation_type.map(opt => opt.value);
    params.append('violation', types.join(','));
  }

  try {
    const response = await axios.get(`http://localhost:8000/cases/?${params.toString()}`);
    const results = response.data.results || [];

    setCases(results);
    setTotalPages(Math.ceil((response.data.total || 1) / 10));

    const res = await axios.get("http://localhost:8000/cases/regions");
    setRegions(res.data.sort()); 
    
  } catch (err) {
    console.error(err);
    setError('Failed to fetch cases.');
  } finally {
    setLoading(false);
  }
};

  const handleAddCaseClick = () => setShowAddModal(true);
  const handleModalClose = () => setShowAddModal(false);
  const handleCaseAdded = () => fetchCases(currentPage, appliedFilters);

  const handleDeleteCase = async (caseId) => {
    try {
      await axios.delete(`http://localhost:8000/cases/${caseId}`);
      setCases(prev => prev.filter(c => c._id !== caseId));
    } catch (err) {
      alert('Failed to delete case.');
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleViolationChange = (selectedOptions) => {
    setFilters(prev => ({ ...prev, violation_type: selectedOptions }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  return (
    <div className="cases-page">
      <h2 className="cases-heading">Recent Human Rights Cases</h2>
<div className="filter-box">
  <input
    type="text"
    placeholder="Title"
    name="title"
    value={filters.title}
    onChange={handleFilterChange}
  />

<select name="region" value={filters.region} onChange={handleFilterChange}>
  <option value="">All Regions</option>
  {regions.map(region => (
    <option key={region} value={region}>{region}</option>
  ))}
</select>



  <div className="date-filter">
    <label className="filter-label">Date From (Start of Incident)</label>
    <input
      type="date"
      name="dateFrom"
      value={filters.dateFrom}
      onChange={handleFilterChange}
    />
  </div>

  <div className="date-filter">
    <label className="filter-label">Date To (End of Incident)</label>
    <input
      type="date"
      name="dateTo"
      value={filters.dateTo}
      onChange={handleFilterChange}
    />
  </div>

  <div className="violation-select">
    <label className="filter-label">Violation Types</label>
        <Select
      isMulti
      options={violationTypeOptions}
      value={filters.violation_type}
      onChange={(selected) =>
        setFilters({ ...filters, violation_type: selected })
      }
      className="multi-select"
      classNamePrefix="select"
    />

  </div>

</div>

  <div className="button-actions">
  <button className="apply-filter-btn" onClick={applyFilters}>Apply Filter</button>
  <button className="add-case-button" onClick={handleAddCaseClick}>+ Add Case</button>
</div>


      {loading ? (
        <p>Loading cases...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="case-card-list">
            {cases.map((caseItem) => (
              <CaseCard key={caseItem._id} caseItem={caseItem} onDelete={handleDeleteCase} />
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${i + 1 === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <AddCaseModal
        show={showAddModal}
        onHide={handleModalClose}
        onCaseAdded={handleCaseAdded}
      />
    </div>
  );
}

export default CasesDemonstration;
