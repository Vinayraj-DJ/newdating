import React, { useEffect, useState } from "react";
import styles from "./AllAdminOperation.module.css";
import { getAllAdminConfig } from "../../services/adminConfigService";
import { useNavigate } from "react-router-dom";

const AllAdminOperation = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getAllAdminConfig();
        if (res?.success) {
          setConfig(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) return <p className={styles.loading}>Loading admin operations…</p>;
  if (!config) return <p>No admin operation data found</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Admin Operations</h2>

      <div className={styles.grid}>
        <ConfigCard
          title="Minimum Call Coins"
          value={config.minCallCoins}
          onEdit={() => navigate("/admin-operation/min-call-coins")}
        />

        <ConfigCard
          title="Admin Share Percentage"
          value={`${config.adminSharePercentage}%`}
          onEdit={() => navigate("/admin-operation/configurations")}
        />

        <ConfigCard
          title="Coin to Rupee Conversion"
          value={config.coinToRupeeConversionRate}
          onEdit={() => navigate("/admin-operation/coin-to-rupees")}
        />

        <ConfigCard
          title="Minimum Withdrawal Amount"
          value={`₹ ${config.minWithdrawalAmount}`}
          onEdit={() => navigate("/admin-operation/min-withdrawal")}
        />

        <ConfigCard
          title="Female Referral Bonus"
          value={config.femaleReferralBonus}
          onEdit={() => navigate("/admin-operation/referral-bonus")}
        />

        <ConfigCard
          title="Male Referral Bonus"
          value={config.maleReferralBonus}
          onEdit={() => navigate("/admin-operation/referral-bonus")}
        />

        <ConfigCard
          title="Agency Referral Bonus"
          value={config.agencyReferralBonus}
          onEdit={() => navigate("/admin-operation/referral-bonus")}
        />

        <ConfigCard
          title="Nearby Distance"
          value={`${config.nearbyDistanceValue} ${config.nearbyDistanceUnit}`}
        />

        <ConfigCard
          title="New User Window (Days)"
          value={config.newUserWindowDays}
          onEdit={() => navigate("/admin-operation/new-user-duration")}
        />
      </div>
    </div>
  );
};

const ConfigCard = ({ title, value, onEdit }) => (
  <div className={styles.card}>
    <p className={styles.cardTitle}>{title}</p>
    <p className={styles.cardValue}>{value ?? "-"}</p>
    {onEdit && (
      <button className={styles.editBtn} onClick={onEdit}>
        Edit
      </button>
    )}
  </div>
);

export default AllAdminOperation;
