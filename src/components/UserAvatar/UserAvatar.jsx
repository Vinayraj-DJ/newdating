import React from "react";
import styles from "./UserAvatar.module.css";

export const UserAvatar = ({ src, size = 40, className = "", alt = "User Avatar" }) => {
  return (
    <div 
      className={`${styles.avatarContainer} ${className}`} 
      style={{ width: size, height: size }}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className={styles.avatarImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={styles.avatarFallback} style={{ width: size, height: size }}>
        <span className={styles.avatarInitial}>U</span>
      </div>
    </div>
  );
};

export default UserAvatar;