import React, { useState } from "react";
import styles from "./NewUserWindow.module.css";
import { updateNewUserWindowDays } from "../../../services/newUserWindowService";

const NewUserWindow = () => {
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!days || Number(days) <= 0) {
      setErrorMsg("New user window days must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await updateNewUserWindowDays(Number(days));

      if (res?.success) {
        setSuccessMsg(res.message);
        setDays(res.data.newUserWindowDays);
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>New User Window</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        <label className={styles.label}>
          New User Window (Days)
        </label>

        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={styles.input}
          placeholder="Enter number of days"
        />

        {successMsg && <p className={styles.success}>{successMsg}</p>}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <button className={styles.button} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default NewUserWindow;
