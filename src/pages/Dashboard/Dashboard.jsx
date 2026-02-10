import React, { useMemo } from "react";
import { motion } from "framer-motion";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import useDashboardData from "../../hooks/useDashboardData";

// Fallback SVG icons
import icon1 from "../../assets/icons/one.svg";
import icon2 from "../../assets/icons/two.svg";
import icon3 from "../../assets/icons/three.svg";
import icon4 from "../../assets/icons/four.svg";

const Dashboard = () => {
  // Ultra-colorful gradient icons with enhanced visual appeal
  const iconComponents = useMemo(() => [
    // Interest - Vibrant rainbow heart with 5 color stops
    <svg key="interest" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraHeart" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="25%" stopColor="#FF9FF3" />
          <stop offset="50%" stopColor="#4ECDC4" />
          <stop offset="75%" stopColor="#45B7D1" />
          <stop offset="100%" stopColor="#96CEB4" />
        </linearGradient>
      </defs>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#ultraHeart)" />
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    </svg>,

    // Language - Rainbow globe with multiple continents
    <svg key="language" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraGlobe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="20%" stopColor="#FF9F43" />
          <stop offset="40%" stopColor="#4ECDC4" />
          <stop offset="60%" stopColor="#45B7D1" />
          <stop offset="80%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#2ECC71" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#ultraGlobe)" />
      <path d="M3 12h18M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      <path d="M8 8c1 2 3 3 4 3s3-1 4-3M6 16c2-1 4-2 6-2s4 1 6 2" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    </svg>,

    // Religion - Prism crystal with rainbow effect
    <svg key="religion" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraCrystal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="16%" stopColor="#3498DB" />
          <stop offset="32%" stopColor="#2ECC71" />
          <stop offset="48%" stopColor="#F1C40F" />
          <stop offset="64%" stopColor="#E67E22" />
          <stop offset="80%" stopColor="#E74C3C" />
          <stop offset="100%" stopColor="#9B59B6" />
        </linearGradient>
      </defs>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#ultraCrystal)" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M12 4L14.5 9L19 9.5L15.5 13L16.5 18L12 16L7.5 18L8.5 13L5 9.5L9.5 9L12 4" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
    </svg>,

    // Relation Goal - Target with concentric rainbow rings
    <svg key="relation" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ultraTarget" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="25%" stopColor="#FFD93D" />
          <stop offset="50%" stopColor="#2ECC71" />
          <stop offset="75%" stopColor="#3498DB" />
          <stop offset="100%" stopColor="#9B59B6" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#ultraTarget)" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
    </svg>,

    // FAQ - Colorful question mark with speech bubble
    <svg key="faq" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraQuestion" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1ABC9C" />
          <stop offset="33%" stopColor="#3498DB" />
          <stop offset="66%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#E74C3C" />
        </linearGradient>
      </defs>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="url(#ultraQuestion)" />
      <path d="M9.09 9C9.32 7.63 10.38 6.5 12 6.5 13.62 6.5 14.68 7.63 14.91 9 15.14 10.37 14.39 11.5 13 11.5 12.5 11.5 12 11.25 12 10.75V10C12 9.5 12.5 9 13 9 13 8.5 12.5 8 12 8 11 8 10 9 10 10V10.75C10 11.75 9.59 12.5 9.09 12.91 8.59 13.32 8 13.5 8 14.5V15 15.5C8 15.78 8.22 16 8.5 16H15.5C15.78 16 16 15.78 16 15.5V14.5C16 13.5 15.41 13.32 14.91 12.91 14.41 12.5 14 11.75 14 10.75V10C14 9.5 14.5 9 15 9 15 8.5 14.5 8 14 8 13 8 12 9 12 10V10.75C12 11.25 11.5 11.5 11 11.5 9.61 11.5 8.86 10.37 9.09 9Z" fill="#FFFFFF" />
      <circle cx="12" cy="19" r="1" fill="#FFFFFF" />
    </svg>,

    // Plan - Rainbow tag with ribbon
    <svg key="plan" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraPlan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9F43" />
          <stop offset="25%" stopColor="#2ECC71" />
          <stop offset="50%" stopColor="#3498DB" />
          <stop offset="75%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#E74C3C" />
        </linearGradient>
      </defs>
      <path d="M21 3H3C2.45 3 2 3.45 2 4V20C2 20.55 2.45 21 3 21H21C21.55 21 22 20.55 22 20V4C22 3.45 21.55 3 21 3ZM20 20H4V4H20V20Z" fill="url(#ultraPlan)" />
      <path d="M12 7L14.5 10L17 7L14.5 4L12 7Z" fill="#FFFFFF" />
      <path d="M8 12L10 14L12 12L10 10L8 12Z" fill="#FFFFFF" opacity="0.8" />
      <path d="M16 12L18 14L20 12L18 10L16 12Z" fill="#FFFFFF" opacity="0.8" />
    </svg>,

    // Total Users - Group of people with rainbow colors
    <svg key="totalusers" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraUsers" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3498DB" />
          <stop offset="33%" stopColor="#2ECC71" />
          <stop offset="66%" stopColor="#F1C40F" />
          <stop offset="100%" stopColor="#E74C3C" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="7" r="3" fill="url(#ultraUsers)" />
      <path d="M17 20V18C17 16.9 16.1 16 15 16H9C7.9 16 7 16.9 7 18V20" stroke="url(#ultraUsers)" strokeWidth="2" fill="none" />
      <circle cx="5" cy="8" r="2.5" fill="#FF6B9D" />
      <circle cx="19" cy="8" r="2.5" fill="#4ECDC4" />
      <path d="M3 20V18C3 17.5 3.2 17 3.5 16.7" stroke="#FF6B9D" strokeWidth="1.5" fill="none" />
      <path d="M21 20V18C21 17.5 20.8 17 20.5 16.7" stroke="#4ECDC4" strokeWidth="1.5" fill="none" />
    </svg>,

    // Total Pages - Rainbow document with tabs
    <svg key="totalpages" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraDocument" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#95A5A6" />
          <stop offset="25%" stopColor="#BDC3C7" />
          <stop offset="50%" stopColor="#ECF0F1" />
          <stop offset="75%" stopColor="#D5D8DC" />
          <stop offset="100%" stopColor="#95A5A6" />
        </linearGradient>
      </defs>
      <path d="M14 2H6C5.45 2 5 2.45 5 3V21C5 21.55 5.45 22 6 22H18C18.55 22 19 21.55 19 21V8L14 2Z" fill="url(#ultraDocument)" stroke="#7F8C8D" strokeWidth="1" />
      <path d="M14 2V8H19" stroke="#7F8C8D" strokeWidth="1" fill="none" />
      <path d="M8 10H16M8 13H16M8 16H13" stroke="#34495E" strokeWidth="1" />
      <rect x="8" y="6" width="3" height="2" rx="0.5" fill="#3498DB" />
      <rect x="12" y="6" width="3" height="2" rx="0.5" fill="#2ECC71" />
    </svg>,

    // Total Gift - Rainbow gift box with bow
    <svg key="totalgift" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraGift" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9FF3" />
          <stop offset="20%" stopColor="#F368E0" />
          <stop offset="40%" stopColor="#FF6B9D" />
          <stop offset="60%" stopColor="#FF9F43" />
          <stop offset="80%" stopColor="#2ECC71" />
          <stop offset="100%" stopColor="#3498DB" />
        </linearGradient>
      </defs>
      <rect x="4" y="9" width="16" height="11" rx="2" fill="url(#ultraGift)" />
      <path d="M12 9V20M4 14H20" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="3" y="7" width="18" height="4" rx="1" fill="#E74C3C" />
      <circle cx="12" cy="5" r="2" fill="#F1C40F" />
      <path d="M10 5H14" stroke="#FFFFFF" strokeWidth="1" />
    </svg>,

    // Total Package - Golden coins with rainbow shine
    <svg key="totalpackage" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ultraPackage" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="30%" stopColor="#FFA500" />
          <stop offset="60%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FF6347" />
        </radialGradient>
        <linearGradient id="coinShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#ultraPackage)" />
      <circle cx="12" cy="12" r="8.5" fill="url(#coinShine)" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#8B4513" strokeWidth="1" />
      <path d="M9 12H15M12 9V15" stroke="#8B4513" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.5" fill="#FFD700" />
      <circle cx="16" cy="16" r="1" fill="#FFA500" />
    </svg>,

    // Total Male - Blue figure with rainbow accent
    <svg key="totalmale" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraMale" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3498DB" />
          <stop offset="50%" stopColor="#2980B9" />
          <stop offset="100%" stopColor="#1F618D" />
        </linearGradient>
        <linearGradient id="accentBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5DADE2" />
          <stop offset="100%" stopColor="#2874A6" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="8" r="4" fill="url(#ultraMale)" />
      <path d="M12 12V18M8 15H16" stroke="url(#accentBlue)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="8" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
      <rect x="10" y="14" width="4" height="6" rx="1" fill="url(#accentBlue)" />
    </svg>,

    // Total Female - Pink figure with rainbow accent
    <svg key="totalfemale" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraFemale" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="50%" stopColor="#FF9FF3" />
          <stop offset="100%" stopColor="#F368E0" />
        </linearGradient>
        <linearGradient id="accentPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8AD8" />
          <stop offset="100%" stopColor="#E84393" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="8" r="4" fill="url(#ultraFemale)" />
      <path d="M12 12V17M10 14H14" stroke="url(#accentPink)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="8" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M8 16L12 13L16 16" stroke="url(#accentPink)" strokeWidth="2" fill="none" />
    </svg>,

    // Total Agency - Rainbow building with windows
    <svg key="totalagency" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ultraBuilding" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2ECC71" />
          <stop offset="25%" stopColor="#27AE60" />
          <stop offset="50%" stopColor="#229954" />
          <stop offset="75%" stopColor="#1E8449" />
          <stop offset="100%" stopColor="#196F3D" />
        </linearGradient>
      </defs>
      <path d="M19 21V9L12 3L5 9V21H19Z" fill="url(#ultraBuilding)" stroke="#186A3B" strokeWidth="1" />
      <rect x="7" y="11" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="10" y="11" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="13" y="11" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="16" y="11" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="7" y="14" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="10" y="14" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="13" y="14" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="16" y="14" width="2" height="2" rx="0.5" fill="#F1C40F" />
      <rect x="9" y="17" width="6" height="3" rx="1" fill="#3498DB" />
    </svg>,

    // Total Earning - Rainbow dollar with shine effect
    <svg key="totalearning" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ultraDollar" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2ECC71" />
          <stop offset="30%" stopColor="#27AE60" />
          <stop offset="60%" stopColor="#229954" />
          <stop offset="100%" stopColor="#1E8449" />
        </radialGradient>
        <linearGradient id="dollarShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#ultraDollar)" />
      <circle cx="12" cy="12" r="9.5" fill="url(#dollarShine)" />
      <path d="M12 6V18M9 9H15M9 15H15" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="12" cy="12" r="8" fill="none" stroke="#186A3B" strokeWidth="1" />
      <circle cx="8" cy="8" r="1" fill="#F1C40F" />
      <circle cx="16" cy="16" r="0.8" fill="#F1C40F" />
    </svg>
  ], []);

  const { cardsData, loading, error, refresh } = useDashboardData(iconComponents);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="dashboard-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: "transparent",
        padding: "20px",
        minHeight: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "700" }}>Report Data</h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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
        </motion.div>
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
        <motion.div
          className="dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
          }}
        >

          {cardsData.map((card, index) => (
            <DashboardCard
              key={`${card.label}-${index}`}
              label={card.label}
              value={card.value}
              icon={card.icon}
              isLoading={loading}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
