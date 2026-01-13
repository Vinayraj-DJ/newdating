import React, { useState } from "react";
import styles from "./MinCallCoins.module.css";
import { updateMinCallCoins } from "../../../services/minCallCoinsService";

const MinCallCoins = () => {
  const [minCoins, setMinCoins] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!minCoins || Number(minCoins) <= 0) {
      setErrorMsg("Minimum call coins must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await updateMinCallCoins(Number(minCoins));

      if (res?.success) {
        setSuccessMsg(res.message);
        setMinCoins(res.data.minCallCoins);
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
      <h2 className={styles.heading}>Minimum Call Coins</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Minimum Coins Required for Call
        </label>

        <input
          type="number"
          min="1"
          value={minCoins}
          onChange={(e) => setMinCoins(e.target.value)}
          className={styles.input}
          placeholder="Enter minimum call coins"
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

export default MinCallCoins;
