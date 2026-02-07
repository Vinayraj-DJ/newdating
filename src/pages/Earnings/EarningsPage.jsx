import React from "react";
import EarningsDashboard from "../../components/EarningsDashboard/EarningsDashboard";
import styles from "./EarningsPage.module.css";

const EarningsPage = () => {
  return (
    <div className={styles.earningsPage}>
      <div className={styles.pageHeader}>
        <h1>Earnings Dashboard</h1>
        <p>Track and analyze platform revenue performance</p>
      </div>
      <div className={styles.dashboardContainer}>
        <EarningsDashboard />
      </div>
    </div>
  );
};

export default EarningsPage;