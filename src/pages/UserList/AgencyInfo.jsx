import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getAgencyUsers } from "../../services/usersService";

const AgencyInfo = () => {
  const { id: agencyId } = useParams();
  const navigate = useNavigate();

  const [agencyInfo, setAgencyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAgency() {
      try {
        setLoading(true);
        setError("");

        // Get all agencies and find the specific one
        const agencies = await getAgencyUsers({ signal: controller.signal });
        const agency = agencies.find(a => a._id === agencyId);

        if (!agency) {
          throw new Error("Agency not found");
        }

        // Process the agency data to match the expected format
        const processedData = {
          id: agency._id,
          name: `${agency.firstName || ''} ${agency.lastName || ''}`.trim() || 'N/A',
          firstName: agency.firstName || '',
          lastName: agency.lastName || '',
          email: agency.email || 'N/A',
          mobileNumber: agency.mobileNumber || 'N/A',
          aadharOrPanNum: agency.aadharOrPanNum || 'N/A',
          status: agency.status || 'N/A',
          reviewStatus: agency.reviewStatus || 'N/A',
          kycStatus: agency.kycStatus || 'N/A',
          isVerified: agency.isVerified || false,
          isActive: agency.isActive || false,
          profileCompleted: agency.profileCompleted || false,
          referralCode: agency.referralCode || 'N/A',
          referredByAgency: agency.referredByAgency || [],
          walletBalance: agency.walletBalance || 0,
          createdAt: agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A',
          updatedAt: agency.updatedAt ? new Date(agency.updatedAt).toLocaleDateString() : 'N/A',
          image: agency.image || null,
          kycDetails: agency.kycDetails || {},
          otp: agency.otp || null,
        };

        setAgencyInfo(processedData);
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          setError(err.message || "Failed to load agency information");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAgency();

    return () => controller.abort();
  }, [agencyId]);

  if (loading) {
    return <div className={styles.loading}>Loading agency information…</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!agencyInfo) {
    return <div className={styles.error}>No agency data found</div>;
  }

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className={styles.pageTitle}>Agency Info Manager</h2>
        <button 
          onClick={() => navigate(-1)} 
          style={{ padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Back
        </button>
      </div>

      {/* ROW 1 - Main Profile and Actions */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Agency Profile</h4>
          <div className={styles.profileBox}>
            <img
              src={agencyInfo.image || "https://via.placeholder.com/150"}
              alt="profile"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>{agencyInfo.name}</span>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p><strong>Name:</strong> {agencyInfo.name}</p>
            <p><strong>Email:</strong> {agencyInfo.email}</p>
            <p><strong>Mobile Number:</strong> {agencyInfo.mobileNumber}</p>
            <p><strong>Aadhar/PAN Number:</strong> {agencyInfo.aadharOrPanNum && agencyInfo.aadharOrPanNum !== "—" ? agencyInfo.aadharOrPanNum.replace(/(\d{4})(?=\d)/g, '$1 ') : agencyInfo.aadharOrPanNum || "—"}</p>
            <p><strong>Status:</strong> {agencyInfo.status}</p>
            <p><strong>Active:</strong> {agencyInfo.isActive ? "Yes" : "No"}</p>
            <p><strong>Verified:</strong> {agencyInfo.isVerified ? "Yes" : "No"}</p>
            <p><strong>Profile Completed:</strong> {agencyInfo.profileCompleted ? "Yes" : "No"}</p>
            <p><strong>Review Status:</strong> {agencyInfo.reviewStatus}</p>
            <p><strong>KYC Status:</strong> {agencyInfo.kycStatus}</p>
            <p><strong>Wallet Balance:</strong> ₹{agencyInfo.walletBalance}</p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.otherPictureCard}`}>
          <div className={styles.floatingActions}>
            <button
              className={styles.walletBtn}
              onClick={() => navigate(`/wallet/agency/${agencyId}`)}
            >
              Wallet Operation
            </button>
          </div>

          <h4 className={styles.cardTitle}>KYC Details</h4>
          <div style={{ padding: "10px 0" }}>
            <h5>Bank Verification</h5>
            <p><strong>Status:</strong> {agencyInfo.kycDetails.bank?.status || 'N/A'}</p>
            
            <h5 style={{ marginTop: "15px" }}>UPI Verification</h5>
            <p><strong>Status:</strong> {agencyInfo.kycDetails.upi?.status || 'N/A'}</p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AgencyInfo;