import React, { isValidElement } from "react";
import { motion } from "framer-motion";
import styles from "./DashboardCard.module.css";





const DashboardCard = ({ label, value, icon, isLoading }) => {
  // Show skeleton loading if value is "..." or isLoading is true
  const isSkeleton = isLoading || value === "...";

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.6
      }
    }
  };

  if (isSkeleton) {
    return (
      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
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
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 12px 25px rgba(0,0,0,0.08)",
        transition: { type: "spring", stiffness: 150, damping: 20 }
      }}
      style={{
        background: "var(--White_Color)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "130px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        cursor: "pointer"
      }}
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
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        style={{
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.4)",
          backdropFilter: "blur(12px)"
        }}
      >
        {(() => {
          if (typeof icon === 'string') {
            return <img src={icon} alt={label} style={{ width: "60px", height: "60px" }} />;
          } else if (isValidElement(icon)) {
            return (
              <motion.div
                whileHover={{ filter: "brightness(1.15)" }}
                style={{
                  width: "40px",
                  height: "40px",
                  filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.2))"
                }}
              >
                {icon}
              </motion.div>
            );
          }
          return null;
        })()}
      </motion.div>
    </motion.div>
  );
};


export default DashboardCard;
