import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css';

const MainLayout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet /> {/* This is where the specific page content (Dashboard, Profiles) will render */}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
