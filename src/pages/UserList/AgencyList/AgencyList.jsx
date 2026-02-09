
import React, { useEffect, useState } from "react";
import styles from "./AgencyList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAgencyUsers, deleteUser, toggleUserStatus, updateUserVerificationStatus } from "../../../services/usersService";
import { reviewAgencyRegistration } from "../../../services/adminReviewService";
import { showCustomToast } from "../../../components/CustomToast/CustomToast";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";

/* =====================================================
   Helpers
===================================================== */
const getFullName = (first, last) => {
  const f = first?.trim() || "";
  const l = last?.trim() || "";
  return `${f} ${l}`.trim() || "—";
};

const UserAvatar = ({ src }) => {
  const [err, setErr] = useState(false);
  if (!src || err) return <FaUserCircle size={26} color="purple" />;
  return <img src={src} className={styles.image} onError={() => setErr(true)} />;
};

const AgencyList = () => {
  const navigate = useNavigate();

  const [agencies, setAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState(null);

  const [openReviewId, setOpenReviewId] = useState(null);
  const [openKycId, setOpenKycId] = useState(null);
  const [reviewLoadingId, setReviewLoadingId] = useState(null);
  const [openVerifyId, setOpenVerifyId] = useState(null); // State to track which user's verification is open

  /* =====================================================
     FETCH AGENCIES
  ===================================================== */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAgencyUsers();
        const mappedAgencies = (data || []).map((a) => ({
          id: a._id,
          name: getFullName(a.firstName, a.lastName),
          email: a.email || "—",
          mobile: a.mobileNumber || "—",
          aadhar: a.aadharOrPanNum || "—",
          status: a.status || "inactive",
          reviewStatus: a.reviewStatus || "pending",
          kycStatus: a.kycStatus || "pending",
          verified: Boolean(a.isVerified),
          isActive: Boolean(a.isActive),
          image: a.image || null,
          // Include creation date for sorting
          createdAt: a.createdAt || a.created_at || a.dateCreated || a.createdDate || a.timestamp,
        }));

        // Sort agencies by creation date (newest first), fallback to ID if no date
        const sortedAgencies = mappedAgencies.sort((a, b) => {
          // Try to get creation date from agency object - common field names
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Default to epoch if no date
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0); // Default to epoch if no date

          // Compare dates (newest first)
          return dateB - dateA;
        });

        setAgencies(sortedAgencies);
      } catch {
        showCustomToast("error", "Failed to load agencies");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* =====================================================
     REVIEW STATUS (API)
  ===================================================== */
  const updateReviewStatus = async (id, status) => {
    try {
      setReviewLoadingId(id);
      await reviewAgencyRegistration({ userId: id, reviewStatus: status });

      setAgencies((p) =>
        p.map((a) => (a.id === id ? { ...a, reviewStatus: status } : a))
      );

      showCustomToast(
        "success",
        `Review ${status === "accepted" ? "approved" : "rejected"}`
      );
    } finally {
      setReviewLoadingId(null);
      setOpenReviewId(null);
    }
  };

  /* =====================================================
     STATUS TOGGLE (API INTEGRATED WITH TOAST)
  ===================================================== */
  const toggleStatus = async (agency) => {
    const newStatus = agency.status === "active" ? "inactive" : "active";

    // Ensure valid values
    const validUserId = agency.id;
    const validUserType = "agency";
    const validStatus = newStatus;

    try {
      const updated = await toggleUserStatus({
        userType: validUserType,
        userId: validUserId,
        status: validStatus
      });

      setAgencies((prev) =>
        prev.map((a) =>
          a.id === agency.id
            ? {
              ...a,
              status: validStatus,
              isActive: validStatus === "active" // Update isActive to match status
            }
            : a
        )
      );

      showCustomToast("success", `Agency ${agency.name} has been ${validStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating agency status:", error);
      console.error("Error response:", error.response?.data);

      // Revert the UI change if API call fails
      setAgencies((prev) =>
        prev.map((a) =>
          a.id === agency.id
            ? { ...a, status: agency.status } // revert to original status
            : a
        )
      );

      // Show more specific error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update agency status";
      showCustomToast("error", errorMessage);
    }
  };

  /* =====================================================
     KYC STATUS (UI ONLY)
  ===================================================== */
  const updateKycStatus = (id, status) => {
    setAgencies((p) =>
      p.map((a) => (a.id === id ? { ...a, kycStatus: status } : a))
    );
    setOpenKycId(null);
  };

  /* =====================================================
     VERIFICATION STATUS (API)
  ===================================================== */
  const handleVerificationToggle = async (id, currentVerified) => {
    const newVerifiedStatus = !currentVerified;
    try {
      await updateUserVerificationStatus({
        userId: id,
        userType: "agency",
        isVerified: newVerifiedStatus
      });

      setAgencies((p) =>
        p.map((a) => (a.id === id ? { ...a, verified: newVerifiedStatus } : a))
      );

      showCustomToast(
        `Agency verification ${newVerifiedStatus ? "approved" : "revoked"} successfully`
      );
      setOpenVerifyId(null);
    } catch (err) {
      showCustomToast(err.message || "Failed to update verification status");
    }
  };



  /* =====================================================
     DELETE USER
  ===================================================== */
  const handleDelete = async (agency) => {
    setAgencyToDelete(agency);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (agencyToDelete) {
      try {
        await deleteUser({ userType: "agency", userId: agencyToDelete.id });
        setAgencies(prevAgencies => prevAgencies.filter(a => a.id !== agencyToDelete.id));
        showCustomToast("success", "Agency deleted successfully");
      } catch (error) {
        showCustomToast("error", error.message || "Failed to delete agency");
      } finally {
        setShowDeleteModal(false);
        setAgencyToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAgencyToDelete(null);
  };

  /* =====================================================
     SEARCH + PAGINATION
  ===================================================== */
  const filtered = agencies.filter((a) => {
    const t = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(t) ||
      a.email.toLowerCase().includes(t) ||
      a.mobile.includes(t) ||
      a.aadhar.includes(t)
    );
  });

  const start = (currentPage - 1) * itemsPerPage;
  const rows = filtered.slice(start, start + itemsPerPage);

  /* =====================================================
     TABLE HEADINGS
  ===================================================== */
  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Agency Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Aadhaar", accessor: "aadhar" },
    { title: "Status", accessor: "status" },
    { title: "Review Status", accessor: "review" },
    { title: "Verification", accessor: "verified" },
    { title: "KYC Status", accessor: "kyc" },
    { title: "Info", accessor: "info" },
    { title: "Delete", accessor: "delete" },
  ];

  /* =====================================================
     TABLE DATA
  ===================================================== */
  const columnData = rows.map((a, i) => ({
    sr: start + i + 1,

    name: (
      <span
        className={styles.clickableCell}
        onClick={() => navigate(`/agency-info/${a.id}`)}
      >
        {a.name}
      </span>
    ),

    email: a.email,
    mobile: a.mobile,

    aadhar: a.aadhar && a.aadhar !== "—" ? a.aadhar.replace(/(\d{4})(?=\d)/g, '$1 ') : a.aadhar,

    review:
      a.reviewStatus === "pending" ? (
        openReviewId === a.id ? (
          <div className={styles.reviewActions}>
            <button
              className={styles.approveBtn}
              onClick={() => updateReviewStatus(a.id, "accepted")}
            >
              ✔
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => updateReviewStatus(a.id, "rejected")}
            >
              ✖
            </button>
          </div>
        ) : (
          <span className={styles.orange} onClick={() => setOpenReviewId(a.id)}>
            Pending
          </span>
        )
      ) : (
        <span className={a.reviewStatus === "accepted" ? styles.green : styles.red}>
          {a.reviewStatus}
        </span>
      ),

    verified:
      a.verified ? (
        <span
          className={styles.verifiedApproved}
          onClick={() => setOpenVerifyId(a.id)}
          style={{ cursor: "pointer" }}
        >
          Yes
        </span>
      ) : (
        openVerifyId === a.id ? (
          <div className={styles.verifyActions}>
            <button
              className={styles.verifyBtn}
              onClick={() => handleVerificationToggle(a.id, a.verified)}
            >
              Verify
            </button>
          </div>
        ) : (
          <span
            className={styles.verifiedPending}
            onClick={() => setOpenVerifyId(a.id)}
            style={{ cursor: "pointer" }}
          >
            No
          </span>
        )
      ),

    kyc:
      a.kycStatus === "pending" ? (
        openKycId === a.id ? (
          <div className={styles.reviewActions}>
            <button
              className={styles.approveBtn}
              onClick={() => updateKycStatus(a.id, "approved")}
            >
              ✔
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => updateKycStatus(a.id, "rejected")}
            >
              ✖
            </button>
          </div>
        ) : (
          <span className={styles.orange} onClick={() => setOpenKycId(a.id)}>
            Pending
          </span>
        )
      ) : (
        <span className={a.kycStatus === "approved" ? styles.green : styles.red}>
          {a.kycStatus}
        </span>
      ),

    status: (
      <button
        className={`${styles.statusButton} ${a.status === "active" ? styles.active : styles.inactive
          }`}
        onClick={() => toggleStatus(a)}
      >
        {a.status}
      </button>
    ),

    info: (
      <span
        className={styles.clickableCell}
        onClick={() => navigate(`/agency-info/${a.id}`)}
      >
        <UserAvatar src={a.image} />
      </span>
    ),

    delete: (
      <FaTrash
        className={styles.deleteIcon}
        title="Delete agency"
        onClick={() => handleDelete(a)}
      />
    ),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2 className={styles.heading}>Agency List</h2>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Agencies..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Agency"
        message={`Are you sure you want to delete agency {}? This action cannot be undone.`}
        highlightContent={agencyToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className={styles.tableCard}>

        <div className={styles.tableScrollWrapper}>
          <DynamicTable
            headings={headings}
            columnData={columnData}
            noDataMessage={loading ? "Loading..." : "No agencies found"}
          />
        </div>

        <PaginationTable
          data={filtered}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default AgencyList;