import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import './AnalyticsCss/AnalyticsPage.css';

const AnalyticsPage = () => {
  const [violationData, setViolationData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [activeChart, setActiveChart] = useState('violations');
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const [violationsRes, geoRes, timelineRes] = await Promise.all([
        axios.get('http://localhost:8000/cases/analytics/violations'),
        axios.get('http://localhost:8000/cases/analytics/geodata'),
        axios.get('http://localhost:8000/cases/analytics/timeline'),
      ]);

      const formattedViolations = Object.entries(violationsRes.data).map(([type, count]) => ({
        _id: type,
        count,
      }));
      setViolationData(formattedViolations);

      if (Array.isArray(geoRes.data)) setGeoData(geoRes.data);

      const formattedTimeline = Object.entries(timelineRes.data).map(([date, count]) => ({
        _id: date,
        count,
      }));
      setTimelineData(formattedTimeline);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, []);

  return (
    <div className="analytics-wrapper">
      <aside className="analytics-sidebar">
        <h3>Analytics</h3>
        <ul>
          <li className={activeChart === 'violations' ? 'active' : ''} onClick={() => setActiveChart('violations')}>
            Violations by Type
          </li>
          <li className={activeChart === 'timeline' ? 'active' : ''} onClick={() => setActiveChart('timeline')}>
            Cases Over Time
          </li>
          <li className={activeChart === 'geo' ? 'active' : ''} onClick={() => setActiveChart('geo')}>
            Cases by Region
          </li>
          <li className={activeChart === 'pie' ? 'active' : ''} onClick={() => setActiveChart('pie')}>
            Violation Breakdown (Pie)
          </li>
        </ul>
        <h3>Export Reports</h3>
        <ul>
          <li><a href="http://localhost:8000/cases/analytics/export/pdf" target="_blank" rel="noopener noreferrer">Export as PDF</a></li>
          <li><a href="http://localhost:8000/cases/analytics/export/excel" target="_blank" rel="noopener noreferrer">Export as Excel</a></li>
        </ul>
      </aside>

      <main className="analytics-main">
        <h2 className="analytics-title">📊 Analytics Dashboard</h2>

        {loading ? (
          <p className="analytics-loading">Loading data...</p>
        ) : (
          <>
            {activeChart === 'violations' && (
              <div className="chart-section">
                <h3 className="chart-title">Violations by Type</h3>
                {violationData.length > 0 ? (
                  <Plot
                    data={[{
                      type: 'bar',
                      x: violationData.map(v => v._id),
                      y: violationData.map(v => v.count),
                      marker: { color: '#364116' },
                    }]}
                    layout={{
                      title: 'Violation Types',
                      margin: { t: 40, l: 40, r: 20, b: 60 },
                      height: 400,
                    }}
                    config={{ responsive: true }}
                  />
                ) : <p>No violation data available.</p>}
              </div>
            )}

            {activeChart === 'timeline' && (
  <div className="chart-section">
    <h3 className="chart-title">Cases Over Time</h3>
    {timelineData.length > 0 ? (
      <Plot
        data={[{
          type: 'scatter',
          mode: 'lines+markers',
          x: timelineData.map(d => new Date(d._id).toISOString()),
          y: timelineData.map(d => d.count),
          line: { color: '#2a3600' },
        }]}
        layout={{
          title: 'Reported Cases Timeline',
          xaxis: { title: 'Date', type: 'date' }, 
          yaxis: { title: 'Case Count' },
          margin: { t: 40, l: 50, r: 20, b: 60 },
        }}
        config={{ responsive: true }}
      />
    ) : <p>No timeline data available.</p>}
  </div>
)}
{activeChart === 'geo' && (
  <div className="chart-section">
    <h3 className="chart-title">Cases by Region</h3>
    {geoData.length > 0 ? (
      <Plot
        data={[{
          type: 'bar',
          orientation: 'h',
          x: geoData.map(g => g.count),
          y: geoData.map(g => g.region),
          marker: { color: '#8bbf3d' },
        }]}
        layout={{
          title: 'Cases by Region (Bar Chart)',
          margin: { t: 40, l: 100, r: 20, b: 40 },
          height: Math.max(400, geoData.length * 40),
        }}
        config={{ responsive: true }}
      />
    ) : <p>No geographical data available.</p>}
  </div>
)}


            {activeChart === 'pie' && (
              <div className="chart-section">
                <h3 className="chart-title">Violation Type Breakdown</h3>
                {violationData.length > 0 ? (
                  <Plot
                    data={[{
                      type: 'pie',
                      labels: violationData.map(v => v._id),
                      values: violationData.map(v => v.count),
                      textinfo: 'label+percent',
                      hole: 0.3,
                    }]}
                    layout={{
                      title: 'Violation Proportions',
                      height: 400,
                      margin: { t: 40, l: 40, r: 40, b: 40 },
                    }}
                    config={{ responsive: true }}
                  />
                ) : <p>No pie chart data available.</p>}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;