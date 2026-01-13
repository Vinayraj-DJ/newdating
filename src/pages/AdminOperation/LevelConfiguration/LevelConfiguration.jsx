import React, { useEffect, useState, useMemo } from "react";
import styles from "./LevelConfiguration.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { showCustomToast, ToastContainerCustom } from "../../../components/CustomToast/CustomToast";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import PaginationTable from "../../../components/PaginationTable/PaginationTable"; // ✅ SAME AS LIST INTEREST
import {
  getAllLevelConfigs,
  createLevelConfig,
  updateLevelConfig,
  deleteLevelConfig,
} from "../../../services/levelConfigurationService";

const emptyForm = {
  level: "",
  weeklyEarningsMin: "",
  weeklyEarningsMax: "",
  audioRatePerMinute: "",
  videoRatePerMinute: "",
  nonAgency: "",
  agency: "",
};

const LevelConfiguration = () => {
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  /* ✅ SAME STATE AS LIST INTEREST */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // START FROM 5

  const fetchLevels = async () => {
    const res = await getAllLevelConfigs();
    if (res?.success) setLevels(res.data);
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      level: Number(form.level) || 0,
      weeklyEarningsMin: Number(form.weeklyEarningsMin) || 0,
      weeklyEarningsMax: Number(form.weeklyEarningsMax) || 0,
      audioRatePerMinute: Number(form.audioRatePerMinute) || 0,
      videoRatePerMinute: Number(form.videoRatePerMinute) || 0,
      platformMarginPerMinute: {
        nonAgency: Number(form.nonAgency) || 0,
        agency: Number(form.agency) || 0,
      },
    };

    setLoading(true);
    try {
      const response = editId
        ? await updateLevelConfig(editId, payload)
        : await createLevelConfig(payload);

      if (response?.success) {
        showCustomToast(response.message || "Saved successfully!");
        setForm(emptyForm);
        setEditId(null);
        fetchLevels();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      level: item.level || "",
      weeklyEarningsMin: item.weeklyEarningsMin || "",
      weeklyEarningsMax: item.weeklyEarningsMax || "",
      audioRatePerMinute: item.audioRatePerMinute || "",
      videoRatePerMinute: item.videoRatePerMinute || "",
      nonAgency: item.platformMarginPerMinute?.nonAgency || "",
      agency: item.platformMarginPerMinute?.agency || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const level = levels.find((l) => l._id === id);
    setItemToDelete({ id, name: level?.level });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const res = await deleteLevelConfig(itemToDelete.id);
    if (res?.success) {
      showCustomToast(res.message || "Level deleted successfully!");
      fetchLevels();
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  /* ✅ SAME LOGIC AS LIST INTEREST */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = useMemo(
    () => levels.slice(startIndex, startIndex + itemsPerPage),
    [levels, startIndex, itemsPerPage]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Level Configuration</h2>

      {/* FORM */}
      <div className={styles.formCard}>
        <h3 className={styles.subHeading}>
          {editId ? "Edit Level" : "Add New Level"}
        </h3>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <FormField label="Level" name="level" value={form.level} onChange={handleChange} />
          <FormField label="Weekly Earnings Min" name="weeklyEarningsMin" value={form.weeklyEarningsMin} onChange={handleChange} />
          <FormField label="Weekly Earnings Max" name="weeklyEarningsMax" value={form.weeklyEarningsMax} onChange={handleChange} />
          <FormField label="Audio Rate / Minute" name="audioRatePerMinute" value={form.audioRatePerMinute} onChange={handleChange} />
          <FormField label="Video Rate / Minute" name="videoRatePerMinute" value={form.videoRatePerMinute} onChange={handleChange} />
          <FormField label="Platform Margin (Non-Agency)" name="nonAgency" value={form.nonAgency} onChange={handleChange} />
          <FormField label="Platform Margin (Agency)" name="agency" value={form.agency} onChange={handleChange} />

          <button className={editId ? styles.updateBtn : styles.primaryBtn} disabled={loading}>
            {editId ? "Update Level" : "Create Level"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <h3 className={styles.subHeading}>All Levels</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Level</th>
              <th>Weekly Range</th>
              <th>Audio</th>
              <th>Video</th>
              <th>Margins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((l) => (
              <tr key={l._id}>
                <td>{l.level}</td>
                <td>{l.weeklyEarningsMin} – {l.weeklyEarningsMax}</td>
                <td>{l.audioRatePerMinute}</td>
                <td>{l.videoRatePerMinute}</td>
                <td>
                  NA: {l.platformMarginPerMinute.nonAgency}<br />
                  AG: {l.platformMarginPerMinute.agency}
                </td>
                <td className={styles.actions}>
                  <FaEdit className={styles.editIcon} onClick={() => handleEdit(l)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => handleDelete(l._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ SAME PAGINATION COMPONENT AS LIST INTEREST */}
        <PaginationTable
          data={levels}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Level"
        message={`Are you sure you want to delete level {}?`}
        highlightContent={itemToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainerCustom />
    </div>
  );
};

const FormField = ({ label, ...props }) => (
  <div className={styles.field}>
    <label>{label}</label>
    <input type="number" {...props} required />
  </div>
);

export default LevelConfiguration;
