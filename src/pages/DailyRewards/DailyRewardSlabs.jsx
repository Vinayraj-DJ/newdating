// // src/pages/DailyRewards/DailyRewardSlabs.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import styles from "./DailyRewardSlabs.module.css";
// import DynamicTable from "../../components/DynamicTable/DynamicTable";
// import Button from "../../components/Button/Button";
// import InputField from "../../components/InputField/InputField";
// import CustomToast from "../../components/CustomToast/CustomToast";
// import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
// import { dailyRewardSlabsService } from "../../services/dailyRewardSlabsService";

// const DailyRewardSlabs = () => {
//   const [slabs, setSlabs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingSlab, setEditingSlab] = useState(null);
//   const [formData, setFormData] = useState({
//     minWalletBalance: "",
//     rewardAmount: ""
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [actionLoading, setActionLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [slabToDelete, setSlabToDelete] = useState(null);

//   // Fetch all daily reward slabs
//   const fetchSlabs = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await dailyRewardSlabsService.getAllDailyRewardSlabs();
//       setSlabs(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching daily reward slabs:", err);
//       setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to fetch daily reward slabs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSlabs();
//   }, []);

//   // Validate form data
//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.minWalletBalance || isNaN(formData.minWalletBalance) || Number(formData.minWalletBalance) < 0) {
//       errors.minWalletBalance = "Minimum wallet balance must be a valid number";
//     }
    
//     if (!formData.rewardAmount || isNaN(formData.rewardAmount) || Number(formData.rewardAmount) <= 0) {
//       errors.rewardAmount = "Reward amount must be a valid positive number";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   // Handle form submission (create/update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setActionLoading(true);
//     try {
//       if (editingSlab) {
//         // Update existing slab
//         await dailyRewardSlabsService.updateDailyRewardSlab(editingSlab._id, {
//           minWalletBalance: Number(formData.minWalletBalance),
//           rewardAmount: Number(formData.rewardAmount)
//         });
//         showCustomToast("Daily reward slab updated successfully!");
//       } else {
//         // Create new slab
//         await dailyRewardSlabsService.createDailyRewardSlab({
//           minWalletBalance: Number(formData.minWalletBalance),
//           rewardAmount: Number(formData.rewardAmount)
//         });
//         showCustomToast("Daily reward slab created successfully!");
//       }
      
//       // Reset form and fetch updated data
//       setFormData({ minWalletBalance: "", rewardAmount: "" });
//       setEditingSlab(null);
//       setShowForm(false);
//       await fetchSlabs();
//     } catch (err) {
//       console.error("Error saving daily reward slab:", err);
//       setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to save daily reward slab");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle edit action
//   const handleEdit = (slab) => {
//     setFormData({
//       minWalletBalance: slab.minWalletBalance.toString(),
//       rewardAmount: slab.rewardAmount.toString()
//     });
//     setEditingSlab(slab);
//     setShowForm(true);
//     setError("");
//   };

//   // Handle delete action
//   const handleDelete = (slab) => {
//     setSlabToDelete(slab);
//     setShowDeleteModal(true);
//   };

//   // Confirm delete action
//   const confirmDelete = async () => {
//     if (!slabToDelete) return;
    
//     setActionLoading(true);
//     setShowDeleteModal(false);
    
//     try {
//       await dailyRewardSlabsService.deleteDailyRewardSlab(slabToDelete._id);
//       showCustomToast("Daily reward slab deleted successfully!");
//       await fetchSlabs();
//     } catch (err) {
//       console.error("Error deleting daily reward slab:", err);
//       setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to delete daily reward slab");
//     } finally {
//       setActionLoading(false);
//       setSlabToDelete(null);
//     }
//   };

//   // Cancel delete action
//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setSlabToDelete(null);
//   };

//   // Handle cancel form
//   const handleCancel = () => {
//     setFormData({ minWalletBalance: "", rewardAmount: "" });
//     setFormErrors({});
//     setEditingSlab(null);
//     setShowForm(false);
//     setError("");
//   };

//   // Prepare table data
//   const tableData = useMemo(() => {
//     return slabs.map((slab, index) => ({
//       sr: index + 1,
//       minWalletBalance: slab.minWalletBalance || "-",
//       rewardAmount: slab.rewardAmount || "-",
//       createdAt: slab.createdAt ? (() => {
//         try {
//           return new Date(slab.createdAt).toLocaleDateString();
//         } catch {
//           return "-";
//         }
//       })() : "-",
//       updatedAt: slab.updatedAt ? (() => {
//         try {
//           return new Date(slab.updatedAt).toLocaleDateString();
//         } catch {
//           return "-";
//         }
//       })() : "-",
//       action: (
//         <div className={styles.actionButtons}>
//           <Button 
//             variant="outline" 
//             size="small"
//             onClick={() => handleEdit(slab)}
//             disabled={actionLoading}
//           >
//             Edit
//           </Button>
//           <Button 
//             variant="danger" 
//             size="small"
//             onClick={() => handleDelete(slab)}
//             disabled={actionLoading}
//           >
//             Delete
//           </Button>
//         </div>
//       )
//     }));
//   }, [slabs, actionLoading]);

//   // Show custom toast
//   const showCustomToast = (message, type = "success") => {
//     setToast({ type, message });
//     setTimeout(() => setToast(null), 3000); // Auto-hide after 3 seconds
//   };

//   const tableHeaders = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Min Wallet Balance", accessor: "minWalletBalance" },
//     { title: "Reward Amount", accessor: "rewardAmount" },
//     { title: "Created At", accessor: "createdAt" },
//     { title: "Updated At", accessor: "updatedAt" },
//     { title: "Actions", accessor: "action" }
//   ];

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h2 className={styles.title}>Daily Reward Slabs Management</h2>
//         <Button
//           variant="primary"
//           onClick={() => {
//             setFormData({ minWalletBalance: "", rewardAmount: "" });
//             setEditingSlab(null);
//             setShowForm(true);
//             setError("");
//           }}
//           disabled={actionLoading}
//         >
//           Add New Slab
//         </Button>
//       </div>

//       {error && (
//         <div className={styles.errorBanner}>
//           {error}
//         </div>
//       )}

//       {toast && (
//         <CustomToast
//           type={toast.type}
//           message={toast.message}
//           onClose={() => setToast(null)}
//         />
//       )}

//       {showForm && (
//         <div className={styles.formSection}>
//           <form onSubmit={handleSubmit}>
//             <div className={styles.formRow}>
//               <div className={styles.formCol}>
//                 <InputField
//                   label="Minimum Wallet Balance"
//                   name="minWalletBalance"
//                   type="number"
//                   value={formData.minWalletBalance}
//                   onChange={handleInputChange}
//                   error={formErrors.minWalletBalance}
//                   placeholder="Enter minimum wallet balance"
//                 />
//               </div>
//             </div>
            
//             <div className={styles.formRow}>
//               <div className={styles.formCol}>
//                 <InputField
//                   label="Reward Amount"
//                   name="rewardAmount"
//                   type="number"
//                   value={formData.rewardAmount}
//                   onChange={handleInputChange}
//                   error={formErrors.rewardAmount}
//                   placeholder="Enter reward amount"
//                 />
//               </div>
//             </div>
            
//             <div className={styles.formActions}>
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleCancel}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? "Saving..." : (editingSlab ? "Update Slab" : "Create Slab")}
//               </Button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className={styles.section}>
//         {loading ? (
//           <div className={styles.loading}>Loading daily reward slabs...</div>
//         ) : slabs.length === 0 ? (
//           <div className={styles.emptyState}>No daily reward slabs found.</div>
//         ) : (
//           <DynamicTable
//             headings={tableHeaders}
//             columnData={tableData}
//             noDataMessage="No daily reward slabs available."
//           />
//         )}
//       </div>

//       <ConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={cancelDelete}
//         onConfirm={confirmDelete}
//         title="Delete Daily Reward Slab"
//         message={`Are you sure you want to delete daily reward slab with minimum wallet balance ₹${slabToDelete?.minWalletBalance || ''}? This action cannot be undone.`}
//         highlightContent={slabToDelete ? `₹${slabToDelete.minWalletBalance}` : ''}
//         confirmText="Delete"
//         cancelText="Cancel"
//       />
//     </div>
//   );
// };

// export default DailyRewardSlabs;









import React, { useEffect, useMemo, useState } from "react";
import styles from "./DailyRewardSlabs.module.css";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { dailyRewardSlabsService } from "../../services/dailyRewardSlabsService";
import { FaEdit, FaTrash } from "react-icons/fa";

import {
  showCustomToast,
  ToastContainerCustom,
} from "../../components/CustomToast/CustomToast";

export default function DailyRewardSlabs() {
  /* =========================
     STATE
  ========================= */

  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSlab, setEditingSlab] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slabToDelete, setSlabToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    minWalletBalance: "",
    rewardAmount: "",
  });

  const [formErrors, setFormErrors] = useState({});

  /* =========================
     FETCH
  ========================= */

  const fetchSlabs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dailyRewardSlabsService.getAllDailyRewardSlabs();
      setSlabs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load daily reward slabs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlabs();
  }, []);

  /* =========================
     FORM
  ========================= */

  const validateForm = () => {
    const errs = {};
    if (!formData.minWalletBalance || Number(formData.minWalletBalance) < 0) {
      errs.minWalletBalance = "Enter valid minimum wallet balance";
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
      if (editingSlab) {
        await dailyRewardSlabsService.updateDailyRewardSlab(editingSlab._id, {
          minWalletBalance: Number(formData.minWalletBalance),
          rewardAmount: Number(formData.rewardAmount),
        });
        showCustomToast("Daily Reward Slab Updated Successfully!!");
      } else {
        await dailyRewardSlabsService.createDailyRewardSlab({
          minWalletBalance: Number(formData.minWalletBalance),
          rewardAmount: Number(formData.rewardAmount),
        });
        showCustomToast("Daily Reward Slab Added Successfully!!");
      }

      setShowForm(false);
      setEditingSlab(null);
      setFormData({ minWalletBalance: "", rewardAmount: "" });
      fetchSlabs();
    } catch {
      setError("Failed to save daily reward slab");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (slab) => {
    setEditingSlab(slab);
    setFormData({
      minWalletBalance: slab.minWalletBalance.toString(),
      rewardAmount: slab.rewardAmount.toString(),
    });
    setShowForm(true);
  };

  /* =========================
     DELETE
  ========================= */

  const doDelete = (slab) => {
    setSlabToDelete(slab);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!slabToDelete) return;

    setActionLoading(true);
    try {
      await dailyRewardSlabsService.deleteDailyRewardSlab(slabToDelete._id);
      showCustomToast("Daily Reward Slab Deleted Successfully!!");
      setSlabs((prev) => prev.filter((s) => s._id !== slabToDelete._id));
    } catch {
      setError("Failed to delete daily reward slab");
    } finally {
      setShowDeleteModal(false);
      setSlabToDelete(null);
      setActionLoading(false);
    }
  };

  /* =========================
     PAGINATION
  ========================= */

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = slabs.slice(startIdx, startIdx + itemsPerPage);

  /* =========================
     TABLE
  ========================= */

  const headings = useMemo(
    () => [
      { title: "Sr No.", accessor: "sr" },
      { title: "Min Wallet Balance", accessor: "minWalletBalance" },
      { title: "Reward Amount", accessor: "rewardAmount" },
      { title: "Action", accessor: "action" },
    ],
    []
  );

  const columnData = useMemo(
    () =>
      currentData.map((slab, i) => ({
        sr: startIdx + i + 1,
        minWalletBalance: slab.minWalletBalance ?? "-",
        rewardAmount: slab.rewardAmount ?? "-",
        action: (
          <div className={styles.actions}>
            <FaEdit
              className={styles.editIcon}
              title="Edit"
              onClick={() => handleEdit(slab)}
            />
            <FaTrash
              className={styles.deleteIcon}
              title="Delete"
              onClick={() => doDelete(slab)}
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
        <h2 className={styles.heading}>Daily Reward Slabs Management</h2>
        <Button
          variant="primary"
          onClick={() => {
            setEditingSlab(null);
            setFormData({ minWalletBalance: "", rewardAmount: "" });
            setShowForm(true);
          }}
        >
          Add New Slab
        </Button>
      </div>


      {error && <div className={styles.error}>{error}</div>}


      {showForm && (
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.block}>
              <label className={styles.label}>Minimum Wallet Balance</label>
              <InputField
                type="number"
                name="minWalletBalance"
                value={formData.minWalletBalance}
                placeholder="Enter minimum wallet balance"
                onChange={(e) =>
                  setFormData({ ...formData, minWalletBalance: e.target.value })
                }
                error={formErrors.minWalletBalance}
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
                {editingSlab ? "Update Slab" : "Create Slab"}
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
              noDataMessage="No daily reward slabs found."
            />

            <PaginationTable
              data={slabs}
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
        title="Delete Daily Reward Slab"
        message="Are you sure you want to delete this slab? This action cannot be undone."
        highlightContent={slabToDelete?.minWalletBalance}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainerCustom />
    </div>
  );
}
