// src/sections/TopBar/TopBar.jsx
import React, { useState } from "react";
import styles from "./TopBar.module.css";
import {
  FiSun,
  FiMoon,
  FiMaximize2,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../utils/auth";

function TopBar({ onMobileMenuToggle, isMobileMenuOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleLogout = () => {
    clearAuth(); // ⬅️ remove token + flags
    navigate("/login", { replace: true }); // ⬅️ go to login
  };

  return (
    <div className={styles.TopBarWrapper}>
      <div className={styles.leftSection}>
        <div 
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.menuOpen : ''}`}
          onClick={onMobileMenuToggle}
          title="Toggle Menu"
        >
          <FiMenu size={24} />
        </div>
      </div>
      <div className={styles.actionIcons}>
        <div
          onClick={toggleDarkMode}
          className={styles.iconButton}
          title="Toggle Theme"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </div>

        <div
          onClick={toggleFullScreen}
          className={styles.iconButton}
          title="Fullscreen"
        >
          <FiMaximize2 size={20} />
        </div>

        <div 
          className={styles.profileSection}
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          <div
            className={styles.profileIcon}
            onClick={() => setProfileOpen(!profileOpen)}
            title="User Menu"
          >
            <FiUser size={22} />
          </div>
          {(profileOpen || isProfileHovered) && (
            <ul className={styles.profileDropdown}>
              <li>
                <FiUser />
                <a href="/profile">Account</a>
              </li>
              <li>
                <FiSettings />
                <a href="/setting">Settings</a>
              </li>
              <li onClick={handleLogout}>
                <FiLogOut />
                <span>Log out</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
