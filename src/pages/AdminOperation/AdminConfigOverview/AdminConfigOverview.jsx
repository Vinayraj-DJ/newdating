import React, { useEffect, useState } from "react";
import styles from "./AdminConfigOverview.module.css";
import { getAllAdminConfig } from "../../../services/adminConfigService";

const AdminConfigOverview = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (!config) return <p>No configuration data found</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Configuration Overview</h2>

      <div className={styles.grid}>
        <ConfigItem label="Min Call Coins" value={config.minCallCoins} />
        <ConfigItem label="Admin Share (%)" value={config.adminSharePercentage} />
        <ConfigItem label="Coin → Rupee Rate" value={config.coinToRupeeConversionRate} />
        <ConfigItem label="Min Withdrawal (₹)" value={config.minWithdrawalAmount} />
        <ConfigItem label="Female Referral Bonus" value={config.femaleReferralBonus} />
        <ConfigItem label="Male Referral Bonus" value={config.maleReferralBonus} />
        <ConfigItem label="Agency Referral Bonus" value={config.agencyReferralBonus} />
        <ConfigItem
          label="Nearby Distance"
          value={`${config.nearbyDistanceValue} ${config.nearbyDistanceUnit}`}
        />
        <ConfigItem label="New User Window (Days)" value={config.newUserWindowDays} />
      </div>
    </div>
  );
};

const ConfigItem = ({ label, value }) => (
  <div className={styles.card}>
    <p className={styles.label}>{label}</p>
    <p className={styles.value}>{value ?? "-"}</p>
  </div>
);

export default AdminConfigOverview;
