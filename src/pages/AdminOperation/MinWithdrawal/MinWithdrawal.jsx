import React, { useState } from "react";
import styles from "./MinWithdrawal.module.css";
import { updateMinWithdrawalAmount } from "../../../services/minWithdrawalService";

const MinWithdrawal = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Minimum withdrawal amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await updateMinWithdrawalAmount(Number(amount));

      if (res?.success) {
        setSuccessMsg(res.message);
        setAmount(res.data.minWithdrawalAmount);
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
      <h2 className={styles.heading}>Minimum Withdrawal Amount</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Minimum Withdrawal Amount (₹)
        </label>

        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
          placeholder="Enter minimum withdrawal amount"
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

export default MinWithdrawal;
