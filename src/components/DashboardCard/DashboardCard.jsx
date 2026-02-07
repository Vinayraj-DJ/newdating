import React from "react";
import { motion } from "framer-motion";
import styles from "./DashboardCard.module.css";





const DashboardCard = ({ label, value, icon, isLoading }) => {
  // Show skeleton loading if value is "..." or isLoading is true
  const isSkeleton = isLoading || value === "...";
  
  if (isSkeleton) {
    return (
      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "var(--White_Color)",
          borderRadius: "20px",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "130px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div className={`${styles.skeleton} ${styles["skeleton-text"]}`} style={{ width: "80px" }} />
          <div className={`${styles.skeleton} ${styles["skeleton-value"]}`} />
        </div>
        <div className={`${styles.skeleton} ${styles["skeleton-icon"]}`} />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="dashboard-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        background: "var(--White_Color)",
        borderRadius: "20px",
        padding: "20px",
      
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "transform 0.2s ease",
        minHeight: "130px",
      }}
      whileHover={{ scale: 1.03 }}
    >
      <div>
        <div
          style={{
            fontSize: "var(--Font_Size_2)",
            fontWeight: 600,
            color: "var(--Primary_Color)",
            backgroundColor: "#f3e8ff",
            padding: "2px 8px",
            borderRadius: "6px",
            display: "inline-block",
            marginBottom: "10px",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "var(--Font_Size_5)", fontWeight: 700 }}>
          {value}
        </div>
      </div>
      <div style={{ 
        width: "60px", 
        height: "60px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
        borderRadius: "15px",
        border: "1px solid rgba(255,255,255,0.4)",
        backdropFilter: "blur(12px)"
      }}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={label} style={{ width: "60px", height: "60px" }} />
        ) : (
          <div style={{ 
            width: "40px", 
            height: "40px",
            filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.3)) brightness(1.1)",
            transition: "transform 0.3s ease, filter 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
            e.currentTarget.style.filter = "drop-shadow(4px 4px 8px rgba(0,0,0,0.4)) brightness(1.2) saturate(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.filter = "drop-shadow(3px 3px 6px rgba(0,0,0,0.3)) brightness(1.1)";
          }}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
