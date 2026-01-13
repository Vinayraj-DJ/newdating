import React, { useEffect, useMemo, useState } from "react";
import styles from "./WeeklyRewardRanks.module.css";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { weeklyRewardRanksService } from "../../services/weeklyRewardRanksService";
import { FaEdit, FaTrash } from "react-icons/fa";

import {
  showCustomToast,
  ToastContainerCustom,
} from "../../components/CustomToast/CustomToast";

export default function WeeklyRewardRanks() {
  /* =========================
     STATE
  ========================= */

  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRank, setEditingRank] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rankToDelete, setRankToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    rank: "",
    rewardAmount: "",
  });

  const [formErrors, setFormErrors] = useState({});

  /* =========================
     FETCH
  ========================= */

  const fetchRanks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await weeklyRewardRanksService.getAllWeeklyRewardRanks();
      setRanks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load weekly reward ranks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  /* =========================
     FORM
  ========================= */

  const validateForm = () => {
    const errs = {};
    if (!formData.rank || Number(formData.rank) < 0) {
      errs.rank = "Enter valid rank";
    }
    if (!formData.rewardAmount || Number(formData.rewardAmount) <= 0) {
      errs.rewardAmount = "Enter valid reward amount";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      if (editingRank) {
        await weeklyRewardRanksService.updateWeeklyRewardRank(editingRank._id, {
          rank: Number(formData.rank),
          rewardAmount: Number(formData.rewardAmount),
          // Also include alternative field names in case the API requires them
          Rank: Number(formData.rank),
          amount: Number(formData.rewardAmount),
          reward_amount: Number(formData.rewardAmount),
          rewardAmt: Number(formData.rewardAmount),
        });
        showCustomToast("Weekly Reward Rank Updated Successfully!!");
      } else {
        await weeklyRewardRanksService.createWeeklyRewardRank({
          rank: Number(formData.rank),
          rewardAmount: Number(formData.rewardAmount),
          // Also include alternative field names in case the API requires them
          Rank: Number(formData.rank),
          amount: Number(formData.rewardAmount),
          reward_amount: Number(formData.rewardAmount),
          rewardAmt: Number(formData.rewardAmount),
        });
        showCustomToast("Weekly Reward Rank Added Successfully!!");
      }

      setShowForm(false);
      setEditingRank(null);
      setFormData({ rank: "", rewardAmount: "" });
      // Fetch fresh data to ensure consistency with the backend
      await fetchRanks();
    } catch {
      setError("Failed to save weekly reward rank");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (rank) => {
    setEditingRank(rank);
    setFormData({
      rank: (rank.rank || rank.Rank || rank.position || rank.order || rank.id || rank._id)?.toString() || "",
      rewardAmount: (rank.rewardAmount || rank.amount || rank.reward_amount || rank.rewardAmt || rank.total_reward)?.toString() || "",
    });
    setShowForm(true);
  };

  /* =========================
     DELETE
  ========================= */

  const doDelete = (rank) => {
    setRankToDelete(rank);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!rankToDelete) return;

    setActionLoading(true);
    try {
      await weeklyRewardRanksService.deleteWeeklyRewardRank(rankToDelete._id);
      showCustomToast("Weekly Reward Rank Deleted Successfully!!");
      // Fetch fresh data to ensure consistency with the backend
      await fetchRanks();
    } catch {
      setError("Failed to delete weekly reward rank");
    } finally {
      setShowDeleteModal(false);
      setRankToDelete(null);
      setActionLoading(false);
    }
  };

  /* =========================
     PAGINATION
  ========================= */

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = ranks.slice(startIdx, startIdx + itemsPerPage);

  /* =========================
     TABLE
  ========================= */

  const headings = useMemo(
    () => [
      { title: "Sr No.", accessor: "sr" },
      { title: "Rank", accessor: "rank" },
      { title: "Reward Amount", accessor: "rewardAmount" },
      { title: "Action", accessor: "action" },
    ],
    []
  );

  const columnData = useMemo(
    () =>
      currentData.map((rank, i) => ({
        sr: startIdx + i + 1,
        rank: rank.rank || rank.Rank || rank.position || rank.order || rank.id || "-",
        rewardAmount: rank.rewardAmount || rank.amount || rank.reward_amount || rank.rewardAmt || "-",
        action: (
          <div className={styles.actions}>
            <FaEdit
              className={styles.editIcon}
              title="Edit"
              onClick={() => handleEdit(rank)}
            />
            <FaTrash
              className={styles.deleteIcon}
              title="Delete"
              onClick={() => doDelete(rank)}
            />
          </div>
        ),
      })),
    [currentData, startIdx]
  );

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.heading}>Weekly Reward Ranks Management</h2>
        <Button
          variant="primary"
          onClick={() => {
            setEditingRank(null);
            setFormData({ rank: "", rewardAmount: "" });
            setShowForm(true);
          }}
        >
          Add New Rank
        </Button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.block}>
              <label className={styles.label}>Rank</label>
              <InputField
                type="number"
                name="rank"
                value={formData.rank}
                placeholder="Enter rank"
                onChange={(e) =>
                  setFormData({ ...formData, rank: e.target.value })
                }
                error={formErrors.rank}
              />
            </div>

            <div className={styles.block}>
              <label className={styles.label}>Reward Amount</label>
              <InputField
                type="number"
                name="rewardAmount"
                value={formData.rewardAmount}
                placeholder="Enter reward amount"
                onChange={(e) =>
                  setFormData({ ...formData, rewardAmount: e.target.value })
                }
                error={formErrors.rewardAmount}
              />
            </div>

            <div className={styles.formActions}>
              <Button variant="outlined" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" disabled={actionLoading}>
                {editingRank ? "Update Rank" : "Create Rank"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loading}>Loading…</div>
        ) : (
          <>
            <DynamicTable
              headings={headings}
              columnData={columnData}
              noDataMessage="No weekly reward ranks found."
            />

            <PaginationTable
              data={ranks}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Weekly Reward Rank"
        message="Are you sure you want to delete this rank? This action cannot be undone."
        highlightContent={rankToDelete?.rank}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainerCustom />
    </div>
  );
}