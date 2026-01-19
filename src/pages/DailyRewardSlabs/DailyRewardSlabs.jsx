import React, { useEffect, useState } from "react";
import dailyRewardService from "../../services/dailyRewardService";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import CustomToast from "../../components/CustomToast/CustomToast";
import FormSection from "../../components/FormSection/FormSection";
import FormActions from "../../components/FormActions/FormActions";
import styles from "./DailyRewardSlabs.module.css";

const DailyRewardSlabs = () => {
  const [slabs, setSlabs] = useState([]);
  const [formData, setFormData] = useState({
    minWalletBalance: "",
    rewardAmount: ""
  });
  const [maxEarningData, setMaxEarningData] = useState({
    maxEarning: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [maxEarningId, setMaxEarningId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slabToDelete, setSlabToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [submitting, setSubmitting] = useState(false);
  const [maxEarningSubmitting, setMaxEarningSubmitting] = useState(false);

  /* ===============================
     FETCH SLABS
  =============================== */
  useEffect(() => {
    const controller = new AbortController();

    const fetchSlabs = async () => {
      try {
        const data = await dailyRewardService.getAllDailyRewards({
          signal: controller.signal
        });

        setSlabs(
          Array.isArray(data)
            ? [...data].sort(
                (a, b) => a.minWalletBalance - b.minWalletBalance
              )
            : []
        );
      } catch {
        showToast("Error fetching daily reward slabs", "error");
      }
    };

    fetchSlabs();
    return () => controller.abort();
  }, []);

  /* ===============================
     INPUT CHANGE
  =============================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // prevent negative numbers
    if (Number(value) < 0) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  /* ===============================
     MAX EARNING INPUT CHANGE
  =============================== */
  const handleMaxEarningChange = (e) => {
    const { name, value } = e.target;

    // prevent negative numbers
    if (Number(value) < 0) return;

    setMaxEarningData((prev) => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  /* ===============================
     CREATE / UPDATE
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.minWalletBalance || !formData.rewardAmount) {
      showToast("Please fill all fields", "error");
      return;
    }

    const payload = {
      minWalletBalance: Number(formData.minWalletBalance),
      rewardAmount: Number(formData.rewardAmount)
    };

    try {
      setSubmitting(true);

      if (editingId) {
        const res = await dailyRewardService.updateDailyReward(
          editingId,
          payload
        );

        if (res?.success && res?.data) {
          setSlabs((prev) =>
            prev
              .map((s) => (s._id === editingId ? res.data : s))
              .sort((a, b) => a.minWalletBalance - b.minWalletBalance)
          );
        }

        showToast(res?.message || "Daily reward slab updated", "success");
      } else {
        const res = await dailyRewardService.createDailyReward(payload);

        if (res?.success && res?.data) {
          setSlabs((prev) =>
            [...prev, res.data].sort(
              (a, b) => a.minWalletBalance - b.minWalletBalance
            )
          );
        }

        showToast(res?.message || "Daily reward slab created", "success");
      }

      resetForm();
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Error saving daily reward slab",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     EDIT
  =============================== */
  const handleEdit = (slab) => {
    setFormData({
      minWalletBalance: slab.minWalletBalance,
      rewardAmount: slab.rewardAmount
    });
    setEditingId(slab._id);
  };

  /* ===============================
     DELETE
  =============================== */
  const handleDeleteClick = (slab) => {
    if (!slab?._id) return;
    setSlabToDelete(slab);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!slabToDelete?._id) return;

    try {
      const res = await dailyRewardService.deleteDailyReward(
        slabToDelete._id
      );

      if (res?.success !== false) {
        setSlabs((prev) =>
          prev.filter((s) => s._id !== slabToDelete._id)
        );
        showToast("Daily reward slab deleted", "success");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Error deleting daily reward slab",
        "error"
      );
    } finally {
      setShowDeleteModal(false);
      setSlabToDelete(null);
    }
  };

  /* ===============================
     UPDATE MAX EARNING
  =============================== */
  const handleMaxEarningSubmit = async (e) => {
    e.preventDefault();
    if (maxEarningSubmitting || !maxEarningId || !maxEarningData.maxEarning) return;

    const payload = {
      maxEarning: Number(maxEarningData.maxEarning)
    };

    try {
      setMaxEarningSubmitting(true);

      const res = await dailyRewardService.updateMaxEarning(
        maxEarningId,
        payload
      );

      if (res?.success) {
        // Update the slab in the list with the new maxEarning
        setSlabs((prev) =>
          prev.map((slab) => 
            slab._id === maxEarningId 
              ? { ...slab, maxEarning: payload.maxEarning } 
              : slab
          )
        );
        showToast(res?.message || "Max earning updated successfully", "success");
      } else {
        showToast(res?.message || "Error updating max earning", "error");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Error updating max earning",
        "error"
      );
    } finally {
      setMaxEarningSubmitting(false);
    }
  };

  /* ===============================
     RESET
  =============================== */
  const resetForm = () => {
    setFormData({ minWalletBalance: "", rewardAmount: "" });
    setEditingId(null);
  };

  const resetMaxEarningForm = () => {
    setMaxEarningData({ maxEarning: "" });
    setMaxEarningId(null);
  };

  /* ===============================
     SET MAX EARNING FOR EDIT
  =============================== */
  const handleSetMaxEarning = (slab) => {
    setMaxEarningData({
      maxEarning: slab.maxEarning || ""
    });
    setMaxEarningId(slab._id);
  };

  /* ===============================
     TOAST
  =============================== */
  const showToast = (message, type) =>
    setToast({ show: true, message, type });

  const hideToast = () =>
    setToast({ show: false, message: "", type: "" });

  /* ===============================
     TABLE CONFIG
  =============================== */
  const headings = [
    { title: "Min Wallet Balance", accessor: "minWalletBalance" },
    { title: "Reward Amount", accessor: "rewardAmount" },
    { title: "Max Earning", accessor: "maxEarning" },
    { title: "Actions", accessor: "actions" },
  ];
  
  const columnData = slabs.map(slab => ({
    ...slab,
    maxEarning: slab.maxEarning || "Not Set",
    actions: (
      <div className={styles.actionButtons}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => handleEdit(slab)}
          disabled={submitting}
        >
          Edit Slab
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={() => handleSetMaxEarning(slab)}
          disabled={maxEarningSubmitting}
        >
          Set Max Earning
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => handleDeleteClick(slab)}
          disabled={submitting}
        >
          Delete
        </Button>
      </div>
    )
  }));

  /* ===============================
     MAX EARNING FORM
  =============================== */
  const maxEarningForm = (
    <FormSection title="Update Max Earning">
      <form onSubmit={handleMaxEarningSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <InputField
            label="Max Earning"
            type="number"
            name="maxEarning"
            value={maxEarningData.maxEarning}
            onChange={handleMaxEarningChange}
            required
          />
        </div>

        <FormActions>
          <Button type="submit" disabled={maxEarningSubmitting}>
            Update Max Earning
          </Button>
          {maxEarningId && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={resetMaxEarningForm}
            >
              Cancel
            </Button>
          )}
        </FormActions>
      </form>
    </FormSection>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daily Reward Slabs</h1>

      <FormSection
        title={editingId ? "Edit Daily Reward Slab" : "Add New Daily Reward Slab"}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <InputField
              label="Min Wallet Balance"
              type="number"
              name="minWalletBalance"
              value={formData.minWalletBalance}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Reward Amount"
              type="number"
              name="rewardAmount"
              value={formData.rewardAmount}
              onChange={handleInputChange}
              required
            />
          </div>

          <FormActions>
            <Button type="submit" disabled={submitting}>
              {editingId ? "Update Slab" : "Add Slab"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </FormActions>
        </form>
      </FormSection>

      {/* Max Earning Form */}
      {maxEarningId && maxEarningForm}

      <FormSection title="Daily Reward Slabs List">
        <DynamicTable
          columns={tableColumns}
          data={slabs}
          emptyMessage="No daily reward slabs found"
        />
      </FormSection>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Daily Reward Slab"
        message="Are you sure you want to delete this slab?"
      />

      {toast.show && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default DailyRewardSlabs;