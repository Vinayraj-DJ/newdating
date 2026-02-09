
import React, { useEffect, useState } from "react";
import styles from "./MaleUserList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMaleUsers, toggleUserStatus, deleteUser } from "../../../services/usersService";
import { reviewMaleUserRegistration } from "../../../services/adminReviewService";
import { showCustomToast } from "../../../components/CustomToast/CustomToast";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";

const CACHE_KEY = "admin_male_users_list";

/* Avatar */
const UserAvatar = ({ src }) => {
  const [err, setErr] = useState(false);
  if (!src || err) return <FaUserCircle size={24} color="purple" />;
  return (
    <img
      src={src}
      alt="User"
      className={styles.image}
      onError={() => setErr(true)}
    />
  );
};

const MaleUserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openReviewId, setOpenReviewId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const load = async () => {
      // 1. Try to load from cache
      const cached = sessionStorage.getItem(CACHE_KEY);
      let hasCache = false;

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
            hasCache = true;
          }
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }

      if (!hasCache) setLoading(true);
      setError(null);

      try {
        const data = await getMaleUsers({ signal: controller.signal });
        if (!mounted) return;

        const mappedUsers = (data || []).map((u) => ({
          id: u._id,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.email || "—",
          mobile: u.mobileNumber || "—",
          active: Boolean(u.isActive),
          verified: Boolean(u.isVerified),
          image: u.images?.[0]?.imageUrl || null,
          // Add all data fields that were fetched from the API
          password: u.password,
          favourites: u.favourites,
          following: u.malefollowing,
          followers: u.malefollowers,
          balance: u.balance,
          walletBalance: u.walletBalance,
          coinBalance: u.coinBalance,
          isVerified: u.isVerified,
          isActive: u.isActive,
          profileCompleted: u.profileCompleted,
          reviewStatus: u.reviewStatus || "pending",
          referralCode: u.referralCode,
          referredBy: u.referredBy,
          gender: u.gender,
          height: u.height,
          mobileNumber: u.mobileNumber,
          // Include creation date for sorting
          createdAt: u.createdAt || u.created_at || u.dateCreated || u.createdDate || u.timestamp,
        }));

        // Sort users by creation date (newest first), fallback to ID if no date
        const sortedUsers = mappedUsers.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });

        if (mounted) setUsers(sortedUsers);

        // Update cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(sortedUsers));
        } catch (e) { }

      } catch (err) {
        if (!controller.signal.aborted && mounted) {
          if (!hasCache) {
            setError(err?.message || "Failed to load male users");
            showCustomToast("error", err?.message || "Failed to load male users");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleStatusToggle = async (u) => {
    const status = u.active ? "inactive" : "active";
    setSavingIds((p) => ({ ...p, [u.id]: true }));

    try {
      await toggleUserStatus({ userType: "male", userId: u.id, status });
      setUsers((prev) => {
        const next = prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x));
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch (e) { }
        return next;
      });
      showCustomToast("success", `${u.name} has been ${status === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Status toggle failed:", error);
      showCustomToast("error", error.message || "Failed to update user status");
    } finally {
      setSavingIds((p) => ({ ...p, [u.id]: false }));
    }
  };

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser({ userType: "male", userId: userToDelete.id });
        setUsers(prevUsers => {
          const next = prevUsers.filter(u => u.id !== userToDelete.id);
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch (e) { }
          return next;
        });
        showCustomToast("success", "User deleted successfully");
      } catch (error) {
        showCustomToast("error", error.message || "Failed to delete user");
      } finally {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Handle review status for male users
  const handleReviewStatus = async (userId, status) => {
    setSavingIds((p) => ({ ...p, [`review_${userId}`]: true }));
    try {
      await reviewMaleUserRegistration({
        userId,
        reviewStatus: status,
      });
      setUsers((prev) => {
        const next = prev.map((u) =>
          u.id === userId ? { ...u, reviewStatus: status } : u
        );
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch (e) { }
        return next;
      });
      showCustomToast(
        `User review ${status === "accepted" ? "approved" : "rejected"} successfully`
      );
      setOpenReviewId(null);
    } catch (err) {
      showCustomToast(
        err?.response?.data?.message || "Failed to update review status"
      );
    } finally {
      setSavingIds((p) => {
        const c = { ...p };
        delete c[`review_${userId}`];
        return c;
      });
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (currentPage - 1) * itemsPerPage;
  const rows = filtered.slice(start, start + itemsPerPage);

  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Status", accessor: "status" },
    { title: "Review Status", accessor: "review" },

    { title: "Verification", accessor: "verified", className: styles.tableHeaderPurple },
    { title: "Info", accessor: "info" },
    { title: "Delete", accessor: "delete" },
  ];

  const columnData = rows.map((u, i) => ({
    sr: start + i + 1,

    name: (
      <span
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/male/${u.id}`)}
      >
        {u.name}
      </span>
    ),

    email: u.email,
    mobile: u.mobile,

    status: (
      <button
        className={`${styles.statusButton} ${u.active ? styles.active : styles.inactive
          }`}
        disabled={savingIds[u.id]}
        onClick={() => handleStatusToggle(u)}
      >
        {u.active ? "Active" : "Inactive"}
      </button>
    ),

    review:
      u.reviewStatus === "pending" ? (
        openReviewId === u.id ? (
          <div className={styles.reviewActions}>
            <button
              className={styles.approveBtn}
              onClick={() => handleReviewStatus(u.id, "accepted")}
              disabled={!!savingIds[`review_${u.id}`]}
            >
              {savingIds[`review_${u.id}`] ? "..." : "✔"}
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => handleReviewStatus(u.id, "rejected")}
              disabled={!!savingIds[`review_${u.id}`]}
            >
              {savingIds[`review_${u.id}`] ? "..." : "✖"}
            </button>
          </div>
        ) : (
          <span
            className={styles.orange}
            onClick={() => setOpenReviewId(u.id)}
            style={{ cursor: "pointer" }}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            u.reviewStatus === "accepted"
              ? styles.green
              : styles.red
          }
        >
          {u.reviewStatus === "accepted" ? "Approved" : "Rejected"}
        </span>
      ),

    verified: (
      <span className={styles.verifiedApproved}>
        {u.verified ? "Yes" : "No"}
      </span>
    ),

    info: (
      <div
        className={styles.infoClickable}
        onClick={() => navigate(`/user-info/male/${u.id}`)}
      >
        <UserAvatar src={u.image} />
      </div>
    ),

    delete: (
      <FaTrash
        className={styles.deleteIcon}
        title="Delete user"
        onClick={() => handleDelete(u)}
      />
    ),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2 className={styles.heading}>Male Users</h2>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user ${userToDelete?.name}? This action cannot be undone.`}
        highlightContent={userToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className={styles.tableCard}>

        <div className={styles.tableScrollWrapper}>
          {error && <div className={styles.error}>Error: {error}</div>}
          {loading ? (
            <DynamicTable loading={true} />
          ) : (
            <DynamicTable
              headings={headings}
              columnData={columnData}
              noDataMessage="No users"
            />
          )}
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

export default MaleUserList;