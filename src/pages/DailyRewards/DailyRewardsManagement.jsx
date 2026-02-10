// src/pages/DailyRewards/DailyRewardsManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import styles from "./DailyRewardsManagement.module.css";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import Button from "../../components/Button/Button";
import {
  triggerDailyRewards,
  getPendingDailyRewards,
  approvePendingReward,
  rejectPendingReward,
  getRewardHistory,
  getRejectedRewards
} from "../../services/rewardService";

import {
  showCustomToast,
  ToastContainerCustom,
} from "../../components/CustomToast/CustomToast";



const DailyRewardsManagement = () => {
  const [activeTab, setActiveTab] = useState("pending"); // pending, history, rejected
  const [pendingRewards, setPendingRewards] = useState([]);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [rejectedRewards, setRejectedRewards] = useState([]);
  const [loading, setLoading] = useState({
    pending: false,
    history: false,
    rejected: false,
    trigger: false
  });
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Load initial data on component mount
  useEffect(() => {
    fetchPendingRewards();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingRewards();
    } else if (activeTab === "history") {
      fetchRewardHistory();
    } else if (activeTab === "rejected") {
      fetchRejectedRewards();
    }
  }, [activeTab]);

  const fetchData = async () => {
    await fetchPendingRewards();
    await fetchRewardHistory();
    await fetchRejectedRewards();
  };

  const fetchPendingRewards = async () => {
    setLoading(prev => ({ ...prev, pending: true }));
    setError("");
    try {
      const response = await getPendingDailyRewards();
      // Handle different response formats
      let data;
      if (response && response.data && Array.isArray(response.data)) {
        // API returns data in a nested structure { success: true, data: [...] }
        data = response.data;
      } else if (Array.isArray(response)) {
        // API returns data directly as an array
        data = response;
      } else {
        // Fallback to empty array
        data = [];
      }
      setPendingRewards(data.reverse());
    } catch (err) {
      setError(err.message || "Failed to fetch pending rewards");
      console.error("Error fetching pending rewards:", err);
    } finally {
      setLoading(prev => ({ ...prev, pending: false }));
    }
  };

  const fetchRewardHistory = async () => {
    setLoading(prev => ({ ...prev, history: true }));
    setError("");
    try {
      const response = await getRewardHistory();
      // Handle different response formats
      let data;
      if (response && response.data && Array.isArray(response.data)) {
        // API returns data in a nested structure { success: true, data: [...] }
        data = response.data;
      } else if (Array.isArray(response)) {
        // API returns data directly as an array
        data = response;
      } else {
        // Fallback to empty array
        data = [];
      }
      setRewardHistory(data.reverse());
    } catch (err) {
      setError(err.message || "Failed to fetch reward history");
      console.error("Error fetching reward history:", err);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  const fetchRejectedRewards = async () => {
    setLoading(prev => ({ ...prev, rejected: true }));
    setError("");
    try {
      const response = await getRejectedRewards();
      // Handle different response formats
      let data;
      if (response && response.data && Array.isArray(response.data)) {
        // API returns data in a nested structure { success: true, data: [...] }
        data = response.data;
      } else if (Array.isArray(response)) {
        // API returns data directly as an array
        data = response;
      } else {
        // Fallback to empty array
        data = [];
      }
      setRejectedRewards(data.reverse());
    } catch (err) {
      setError(err.message || "Failed to fetch rejected rewards");
      console.error("Error fetching rejected rewards:", err);
    } finally {
      setLoading(prev => ({ ...prev, rejected: false }));
    }
  };

  const handleTriggerDailyRewards = async () => {
    setLoading(prev => ({ ...prev, trigger: true }));
    setError("");
    try {
      await triggerDailyRewards();
      // Refresh all data after triggering
      await fetchData();
      showCustomToast("Daily rewards triggered successfully!");
    } catch (err) {
      setError(err.message || "Failed to trigger daily rewards");
      console.error("Error triggering daily rewards:", err);
    } finally {
      setLoading(prev => ({ ...prev, trigger: false }));
    }
  };

  const handleApproveReward = async (rewardId) => {
    setActionLoading(prev => ({ ...prev, [rewardId]: 'approve' }));
    setError("");
    try {
      await approvePendingReward({ rewardId });
      // Refresh pending rewards after approval
      await fetchPendingRewards();
      await fetchRewardHistory();
    } catch (err) {
      setError(err.message || "Failed to approve reward");
      console.error("Error approving reward:", err);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[rewardId];
        return newState;
      });
    }
  };

  const handleRejectReward = async (rewardId) => {
    setActionLoading(prev => ({ ...prev, [rewardId]: 'reject' }));
    setError("");
    try {
      await rejectPendingReward({ rewardId });
      // Refresh pending rewards after rejection
      await fetchPendingRewards();
      await fetchRejectedRewards();
    } catch (err) {
      setError(err.message || "Failed to reject reward");
      console.error("Error rejecting reward:", err);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[rewardId];
        return newState;
      });
    }
  };

  // Calculate pagination indices for pending rewards
  const startIdxPending = (currentPage - 1) * itemsPerPage;
  const currentPendingData = pendingRewards.slice(startIdxPending, startIdxPending + itemsPerPage);

  // Prepare table data for pending rewards
  const pendingTableData = useMemo(() => {
    return currentPendingData.map((reward, index) => ({
      sr: startIdxPending + index + 1,
      userName: (reward.userId && reward.userId.name) || "-",
      email: (reward.userId && reward.userId.email) || "-",
      walletBalance: (reward.userId && reward.userId.walletBalance) || reward.walletBalance || "-",
      earningValue: reward.earningValue || reward.amount || reward.reward || "-",
      rewardAmount: reward.rewardAmount || reward.amount || reward.earningValue || reward.reward || "-",
      action: (
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionBtn} ${styles.approveBtn}`}
            onClick={() => handleApproveReward(reward._id || reward.id)}
            disabled={actionLoading[reward._id || reward.id] === 'approve'}
          >
            {actionLoading[reward._id || reward.id] === 'approve' ? 'Approving...' : 'Approve'}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.rejectBtn}`}
            onClick={() => handleRejectReward(reward._id || reward.id)}
            disabled={actionLoading[reward._id || reward.id] === 'reject'}
          >
            {actionLoading[reward._id || reward.id] === 'reject' ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      )
    }));
  }, [currentPendingData, actionLoading, startIdxPending]);

  // Calculate pagination indices for history rewards
  const startIdxHistory = (currentPage - 1) * itemsPerPage;
  const currentHistoryData = rewardHistory.slice(startIdxHistory, startIdxHistory + itemsPerPage);

  // Prepare table data for reward history
  const historyTableData = useMemo(() => {
    return currentHistoryData.map((reward, index) => ({
      sr: startIdxHistory + index + 1,
      userName: (reward.userId && reward.userId.name) || "-",
      email: (reward.userId && reward.userId.email) || "-",
      walletBalance: (reward.userId && reward.userId.walletBalance) || reward.walletBalance || "-",
      earningValue: reward.earningValue || reward.amount || reward.reward || "-",
      rewardAmount: reward.rewardAmount || reward.amount || reward.earningValue || reward.reward || "-",
      status: reward.status || "processed",
      date: reward.createdAt ? new Date(reward.createdAt).toLocaleDateString() : "-"
    }));
  }, [currentHistoryData, startIdxHistory]);

  // Calculate pagination indices for rejected rewards
  const startIdxRejected = (currentPage - 1) * itemsPerPage;
  const currentRejectedData = rejectedRewards.slice(startIdxRejected, startIdxRejected + itemsPerPage);

  // Prepare table data for rejected rewards
  const rejectedTableData = useMemo(() => {
    return currentRejectedData.map((reward, index) => ({
      sr: startIdxRejected + index + 1,
      userName: (reward.userId && reward.userId.name) || "-",
      email: (reward.userId && reward.userId.email) || "-",
      walletBalance: (reward.userId && reward.userId.walletBalance) || reward.walletBalance || "-",
      earningValue: reward.earningValue || reward.amount || reward.reward || "-",
      rewardAmount: reward.rewardAmount || reward.amount || reward.earningValue || reward.reward || "-",
      status: reward.status || "rejected",
      date: reward.updatedAt ? new Date(reward.updatedAt).toLocaleDateString() : "-"
    }));
  }, [currentRejectedData, startIdxRejected]);

  const pendingTableHeaders = [
    { title: "Sr No.", accessor: "sr" },
    { title: "User Name", accessor: "userName" },
    { title: "Email", accessor: "email" },
    { title: "Wallet Balance", accessor: "walletBalance" },
    { title: "Earning Value", accessor: "earningValue" },
    { title: "Reward Amount", accessor: "rewardAmount" },
    { title: "Actions", accessor: "action" }
  ];

  const historyTableHeaders = [
    { title: "Sr No.", accessor: "sr" },
    { title: "User Name", accessor: "userName" },
    { title: "Email", accessor: "email" },
    { title: "Wallet Balance", accessor: "walletBalance" },
    { title: "Earning Value", accessor: "earningValue" },
    { title: "Reward Amount", accessor: "rewardAmount" },
    { title: "Status", accessor: "status" },
    { title: "Date", accessor: "date" }
  ];

  const rejectedTableHeaders = [
    { title: "Sr No.", accessor: "sr" },
    { title: "User Name", accessor: "userName" },
    { title: "Email", accessor: "email" },
    { title: "Wallet Balance", accessor: "walletBalance" },
    { title: "Earning Value", accessor: "earningValue" },
    { title: "Reward Amount", accessor: "rewardAmount" },
    { title: "Status", accessor: "status" },
    { title: "Date", accessor: "date" }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Daily Rewards Management</h2>
        <Button
          variant="primary"
          onClick={handleTriggerDailyRewards}
          disabled={loading.trigger}
          className={styles.triggerBtn}
        >
          {loading.trigger ? "Processing..." : "Trigger Daily Rewards"}
        </Button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}

      <div className={styles.tabsContainer}>
        <div className={styles.tabHeader}>
          <button
            className={`${styles.tabBtn} ${activeTab === "pending" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Rewards
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "history" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Reward History
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "rejected" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Rewards
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "pending" && (
            <div className={styles.section}>
              {loading.pending ? (
                <div className={styles.loading}>Loading pending rewards...</div>
              ) : pendingRewards.length === 0 ? (
                <div className={styles.emptyState}>No pending daily rewards found.</div>
              ) : (
                <>
                  <DynamicTable
                    headings={pendingTableHeaders}
                    columnData={pendingTableData}
                    noDataMessage="No pending rewards available."
                  />
                  <PaginationTable
                    data={pendingRewards}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className={styles.section}>
              {loading.history ? (
                <div className={styles.loading}>Loading reward history...</div>
              ) : rewardHistory.length === 0 ? (
                <div className={styles.emptyState}>No reward history found.</div>
              ) : (
                <>
                  <DynamicTable
                    headings={historyTableHeaders}
                    columnData={historyTableData}
                    noDataMessage="No reward history available."
                  />
                  <PaginationTable
                    data={rewardHistory}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "rejected" && (
            <div className={styles.section}>
              {loading.rejected ? (
                <div className={styles.loading}>Loading rejected rewards...</div>
              ) : rejectedRewards.length === 0 ? (
                <div className={styles.emptyState}>No rejected rewards found.</div>
              ) : (
                <>
                  <DynamicTable
                    headings={rejectedTableHeaders}
                    columnData={rejectedTableData}
                    noDataMessage="No rejected rewards available."
                  />
                  <PaginationTable
                    data={rejectedRewards}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainerCustom />
    </div>
  );
};

export default DailyRewardsManagement;