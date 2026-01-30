// src/components/CustomToast/CustomToast.jsx
import React from "react";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiBell } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import styles from "./CustomToast.module.css";

/**
 * showCustomToast(message, onClose?) or showCustomToast(type, message, onClose?)
 * - type: string - "success", "error", "warning", "info" (optional)
 * - message: string to show
 * - onClose: optional callback (fires after toast fully closes)
 *
 * This version will collapse multiple trailing "!" characters into a single "!"
 * so you won't see double exclamation marks.
 */
export const showCustomToast = (type, message, onClose) => {
  // Handle both calling patterns: 
  // 1. showCustomToast(message, onClose) - backward compatibility
  // 2. showCustomToast(type, message, onClose) - new enhanced version
  let toastType = "default";
  let toastMessage = type;
  let toastOnClose = message;
  
  // If third parameter exists, it's the new format with type
  if (onClose !== undefined) {
    toastType = type;
    toastMessage = message;
    toastOnClose = onClose;
  } else if (typeof message === "function") {
    // If message is a function, it's the onClose callback
    toastMessage = type;
    toastOnClose = message;
  }
  // Ensure message is a string
  const raw = toastMessage == null ? "" : String(toastMessage);

  // Collapse trailing exclamation marks to a single one.
  // Examples:
  //  "Saved!!" -> "Saved!"
  //  "Saved!!!" -> "Saved!"
  //  "Saved!" -> "Saved!"
  //  "Saved" -> "Saved" (unchanged)
  const sanitized = raw.replace(/!+$/, (m) => (m.length > 0 ? "!" : ""));

  // Determine icon and colors based on toast type
  let iconComponent = <FiBell className={styles.toastBell} />;
  let containerClass = styles.toastContainer;
  let progressClass = styles.toastProgress;

  switch (toastType.toLowerCase()) {
    case "success":
      iconComponent = <span className={styles.successIcon}>✓</span>;
      containerClass = `${styles.toastContainer} ${styles.successToast}`;
      progressClass = styles.successProgress;
      break;
    case "error":
      iconComponent = <span className={styles.errorIcon}>✕</span>;
      containerClass = `${styles.toastContainer} ${styles.errorToast}`;
      progressClass = styles.errorProgress;
      break;
    case "warning":
      iconComponent = <span className={styles.warningIcon}>⚠</span>;
      containerClass = `${styles.toastContainer} ${styles.warningToast}`;
      progressClass = styles.warningProgress;
      break;
    case "info":
    default:
      // Keep default purple styling
      break;
  }

  toast(
    ({ closeToast }) => (
      <div className={styles.toastLayout}>
        <div className={styles.left}>
          {iconComponent}
        </div>

        <div className={styles.center}>
          <div className={styles.toastMessage}>{sanitized}</div>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.toastClose}
            onClick={() => {
              closeToast();
            }}
            aria-label="close"
          >
            <RxCross2 />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      autoClose: 1500, // Reduced from 3000ms to 1500ms for faster feedback
      closeButton: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false, // Disable pause on hover for faster dismissal
      draggable: false, // Disable dragging for better performance
      progressClassName: progressClass,
      className: containerClass,
      transition: Slide,
      onClose: typeof toastOnClose === 'function' ? toastOnClose : undefined,
    }
  );
};

// ToastContainer wrapper (add once per app or per page)
export const ToastContainerCustom = () => (
  <ToastContainer
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable={false}
  />
);

export default { showCustomToast, ToastContainerCustom };
