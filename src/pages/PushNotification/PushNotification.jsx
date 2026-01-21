import React, { useState } from "react";
import styles from "./PushNotification.module.css";
import { sendPushNotification } from "../../services/api";
import { ToastContainerCustom as CustomToast } from "../../components/CustomToast/CustomToast";

const PushNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !message || !url) {
      setToast({
        type: "error",
        message: "Please fill in all fields.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Send notification via API
      await sendPushNotification({
        title,
        message,
        url,
      });

      // Show success message
      setToast({
        type: "success",
        message: "✅ Notification sent successfully!",
      });

      // Reset form
      setTitle("");
      setMessage("");
      setUrl("");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send notification";
      setToast({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
      console.error("Error sending notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Notification Management</h2>

      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.field}>
          <label htmlFor="title">Enter Notification Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message">Enter Notification Message</label>
          <input
            type="text"
            id="message"
            placeholder="Enter Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="url">Enter Notification Url</label>
          <input
            type="text"
            id="url"
            placeholder="Enter Notification Url (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>

      {toast && (
        <CustomToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PushNotification;
