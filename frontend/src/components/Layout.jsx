import React from 'react';
import Header from './Header.jsx';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default Layout;
