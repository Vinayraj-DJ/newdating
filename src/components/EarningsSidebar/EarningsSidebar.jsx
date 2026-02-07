import React, { useState } from "react";
import EarningsDashboard from "../EarningsDashboard/EarningsDashboard";
import styles from "./EarningsSidebar.module.css";

const EarningsSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.earningsSidebarContainer}>
      {/* Toggle Button */}
      <button 
        className={`${styles.toggleButton} ${isOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
        title="Toggle Earnings Dashboard"
      >
        <span className={styles.toggleIcon}>
          {isOpen ? '◀' : '📊'}
        </span>
        {!isOpen && <span className={styles.toggleText}>Earnings</span>}
      </button>

      {/* Sidebar Panel */}
      <div className={`${styles.sidebarPanel} ${isOpen ? styles.visible : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Earnings Dashboard</h3>
          <button 
            className={styles.closeButton}
            onClick={toggleSidebar}
            title="Close sidebar"
          >
            ×
          </button>
        </div>
        <div className={styles.sidebarContent}>
          <EarningsDashboard />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default EarningsSidebar;