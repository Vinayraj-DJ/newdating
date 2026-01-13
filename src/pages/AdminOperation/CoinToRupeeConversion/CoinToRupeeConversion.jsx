import React, { useState } from "react";
import styles from "./CoinToRupeeConversion.module.css";
import { updateCoinToRupeeConversionRate } from "../../../services/coinConversionService.js";

const CoinToRupeeConversion = () => {
  const [coinRate, setCoinRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!coinRate || coinRate <= 0) {
      setErrorMsg("Conversion rate must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await updateCoinToRupeeConversionRate(Number(coinRate));

      if (res?.success) {
        setSuccessMsg(res.message);
        setCoinRate(res.data.coinToRupeeConversionRate);
      } else {
        setErrorMsg("Failed to update conversion rate");
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Coin to Rupee Conversion</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Coin to Rupee Rate
        </label>

        <input
          type="number"
          min="1"
          value={coinRate}
          onChange={(e) => setCoinRate(e.target.value)}
          className={styles.input}
          placeholder="Enter coin to rupee rate"
        />

        {successMsg && (
          <p className={styles.success}>{successMsg}</p>
        )}
        {errorMsg && (
          <p className={styles.error}>{errorMsg}</p>
        )}

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

export default CoinToRupeeConversion;
