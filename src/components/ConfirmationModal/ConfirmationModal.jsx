import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "OK", cancelText = "Cancel", highlightContent = null }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderMessage = () => {
    if (!highlightContent) return message;
    
    const parts = message.split('{}');
    return (
      <>
        {parts[0]}
        <strong>{highlightContent}</strong>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
        </div>
        <div className={styles.modalBody}>
          <p>{renderMessage()}</p>
        </div>
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`} 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;