import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CasesDemonstration from './cases/CasesDemonstration';
import CaseDetails from './cases/CaseDetails';
import Layout from './components/Layout';
import AnalyticsPage from './Analytics/AnalyticsPage'; 
import ReportDashboard from './reports/ReportDashboard';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Welcome to the dashboard.</div>} />
          <Route path="/cases" element={<CasesDemonstration />} />
          <Route path="/cases/:id" element={<CaseDetails />} />
          <Route path="/analytics" element={<AnalyticsPage />} /> 
          <Route path="/reports" element={<ReportDashboard />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
