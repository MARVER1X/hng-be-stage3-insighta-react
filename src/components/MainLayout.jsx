import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css';

/**
 * Main Application Layout
 * Provides the consistent structural shell for the internal portal,
 * including the persistent sidebar and the responsive content area.
 */
const MainLayout = () => {
  return (
    <div className="layout-container">
      {/* Navigation and Identity Sidebar */}
      <Sidebar />

      <main className="main-content">
        <div className="content-wrapper">
          {/* Outlet renders the child route components (Dashboard, Profiles, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
