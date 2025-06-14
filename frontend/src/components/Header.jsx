// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Human Rights Monitor</h1>
      </div>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/reports">Reports</Link></li> 
          <li><Link to="/cases">Cases</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
