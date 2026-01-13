import React, { useState, useEffect } from "react";
import { showCustomToast } from '../../../components/CustomToast/CustomToast';
import styles from "./AdminConfigurations.module.css";
import { updateAdminSharePercentage } from "../../../services/adminConfigurationService";

const AdminConfigurations = () => {
  const [adminShare, setAdminShare] = useState("");
  const [loading, setLoading] = useState(false);



  const handleAdminShareSubmit = async (e) => {
    e.preventDefault();

    if (adminShare === "" || adminShare < 0 || adminShare > 100) {
      showCustomToast("Admin share percentage must be between 0 and 100");
      return;
    }

    try {
      setLoading(true);
      const res = await updateAdminSharePercentage(Number(adminShare));

      if (res?.success) {
        showCustomToast(res.message || "Admin share updated successfully");
        setAdminShare(res.data.adminSharePercentage);
      } else {
        showCustomToast(res.message || "Failed to update admin share percentage");
      }
    } catch (error) {
      showCustomToast(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Configuration</h2>
      
      <form className={styles.card} onSubmit={handleAdminShareSubmit}>
        <label className={styles.label}>
          Admin Share Percentage (%)
        </label>

        <input
          type="number"
          min="0"
          max="100"
          value={adminShare}
          onChange={(e) => setAdminShare(e.target.value)}
          className={styles.input}
          placeholder="Enter admin share percentage"
        />

        

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default AdminConfigurations;
