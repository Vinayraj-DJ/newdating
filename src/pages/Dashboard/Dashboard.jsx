import React from "react";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import useDashboardData from "../../hooks/useDashboardData";

import icon1 from "../../assets/icons/one.svg";
import icon2 from "../../assets/icons/two.svg";
import icon3 from "../../assets/icons/three.svg";
import icon4 from "../../assets/icons/four.svg";

const Dashboard = () => {
  const icons = [icon1, icon2, icon3, icon4];
  const { cardsData, loading, error, refresh } = useDashboardData(icons);

  return (
    <div
      className="dashboard-wrapper"
      style={{
        background: "transparent",
        padding: "20px",
        minHeight: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "700" }}>Report Data</h2>

      {error && (
        <div
          style={{
            padding: "10px 15px",
            marginBottom: "15px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading && cardsData.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
            fontSize: "16px",
          }}
        >
          ⏳ Loading dashboard data...
        </div>
      )}

      {cardsData.length > 0 && (
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
          }}
        >
          {loading && (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "right",
                color: "#666",
                fontSize: "13px",
              }}
            >
              Updating...
            </div>
          )}
          {cardsData.map((card, index) => (
            <DashboardCard
              key={`${card.label}-${index}`}
              label={card.label}
              value={card.value}
              icon={card.icon}
              isLoading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
