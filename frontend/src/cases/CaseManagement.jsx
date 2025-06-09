import React, { useEffect, useState } from "react";
import CaseTable from "../components/CaseTable";
import CaseFilter from "../components/CaseFilter";
import CaseDetailsModal from "../components/CaseDetailsModal";
import CaseFormModal from "../components/CaseFormModal";
import StatusUpdateModal from "../components/StatusUpdateModal";
import { fetchCases } from "../api/cases";
import './CaseManagement.css';


export default function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    loadCases();
  }, [filters]);

  const loadCases = async () => {
    try {
      const result = await fetchCases(filters);
      setCases(result.results);
    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">إدارة القضايا</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          + إضافة قضية
        </button>
      </div>

      <CaseFilter onFilterChange={setFilters} />

      <CaseTable
        cases={cases}
        onView={(c) => {
          setSelectedCase(c);
          setShowDetailsModal(true);
        }}
        onUpdateStatus={(c) => {
          setSelectedCase(c);
          setShowStatusModal(true);
        }}
      />

      {showDetailsModal && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && (
        <CaseFormModal
          onSuccess={() => {
            setShowAddModal(false);
            loadCases();
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showStatusModal && (
        <StatusUpdateModal
          caseData={selectedCase}
          onSuccess={() => {
            setShowStatusModal(false);
            loadCases();
          }}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
}
