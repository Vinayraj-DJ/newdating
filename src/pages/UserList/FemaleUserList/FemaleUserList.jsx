
import React, { useEffect, useState } from "react";
import styles from "./FemaleUserList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle, FaVideo, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFemaleUsers, deleteUser } from "../../../services/usersService";
import { toggleUserStatus } from "../../../services/adminStatusService";
import { reviewFemaleUserRegistration } from "../../../services/adminReviewService";
import { showCustomToast } from "../../../components/CustomToast/CustomToast";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";

const CACHE_KEY = "admin_female_users_list";

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

const FemaleUserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState({});
  const [openReviewId, setOpenReviewId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    async function load() {
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

      try {
        const data = await getFemaleUsers();

        const mappedUsers = (data || []).map((u) => ({
          id: u._id,
          name:
            u.name ||
            `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
            "—",
          email: u.email || "—",
          mobile: u.mobileNumber || "—",
          active: Boolean(u.isActive),
          verified: Boolean(u.isVerified),
          reviewStatus: u.reviewStatus || "pending",
          userType: "female",
          identity: u.identity || "not upload",
          image: u.images?.[0]?.imageUrl || null,
          // Include creation date for sorting
          createdAt: u.createdAt || u.created_at || u.dateCreated || u.createdDate || u.timestamp,
        }));

        // Sort users by creation date (newest first), fallback to ID if no date
        const sortedUsers = mappedUsers.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });

        setUsers(sortedUsers);

        // Update cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(sortedUsers));
        } catch (e) { }

      } catch (e) {
        if (!hasCache) showCustomToast("error", "Failed to load female users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusToggle = async (user) => {
    const newStatus = user.active ? "inactive" : "active";
    setSavingIds((p) => ({ ...p, [user.id]: true }));

    try {
      await toggleUserStatus({
        userType: "female",
        userId: user.id,
        status: newStatus,
      });

      setUsers((prev) => {
        const next = prev.map((u) =>
          u.id === user.id ? { ...u, active: newStatus === "active" } : u
        );
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch (e) { }
        return next;
      });
      showCustomToast("success", `${user.name} updated`);
    } catch (e) {
      showCustomToast("error", e.message || "Failed to update status");
    } finally {
      setSavingIds((p) => {
        const c = { ...p };
        delete c[user.id];
        return c;
      });
    }
  };

  const handleReview = async (id, status) => {
    setSavingIds((p) => ({ ...p, [`review_${id}`]: true }));
    try {
      await reviewFemaleUserRegistration({ userId: id, reviewStatus: status });
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === id ? { ...u, reviewStatus: status } : u));
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch (e) { }
        return next;
      });
      setOpenReviewId(null);
    } catch (e) {
      showCustomToast("error", e.message || "Failed to review user");
    } finally {
      setSavingIds((p) => {
        const c = { ...p };
        delete c[`review_${id}`];
        return c;
      });
    }
  };

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser({ userType: "female", userId: userToDelete.id });
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

  const filtered = users.filter((u) => {
    const t = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t) ||
      u.mobile.includes(t)
    );
  });

  const start = (currentPage - 1) * itemsPerPage;
  const rows = filtered.slice(start, start + itemsPerPage);

  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Status", accessor: "status" },
    { title: "Review Status", accessor: "review" },
    { title: "Identity", accessor: "identity" },
    { title: "Verification", accessor: "verified" },
    { title: "Info", accessor: "info" },
    { title: "Delete", accessor: "delete" },
  ];

  const columnData = rows.map((u, i) => ({
    sr: start + i + 1,

    name: (
      <span
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/female/${u.id}`)}
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
        onClick={() => handleStatusToggle(u)}
      >
        {u.active ? "Active" : "Inactive"}
      </button>
    ),

    review:
      u.reviewStatus === "pending" ? (
        openReviewId === u.id ? (
          <>
            <button onClick={() => handleReview(u.id, "accepted")}>✔</button>
            <button onClick={() => handleReview(u.id, "rejected")}>✖</button>
          </>
        ) : (
          <span
            className={styles.orange}
            onClick={() => setOpenReviewId(u.id)}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            u.reviewStatus === "accepted" ? styles.green : styles.red
          }
        >
          {u.reviewStatus}
        </span>
      ),

    /* ✅ IDENTITY FIX */
    identity: (
      <span className={styles.identityBadge}>
        {u.identity || "not upload"}
      </span>
    ),

    /* ✅ VERIFICATION FIX */
    verified: u.verified ? (
      <span className={styles.verifiedApproved}>Approved</span>
    ) : (
      <span className={styles.verifiedPending}>Waiting</span>
    ),

    /* ✅ INFO CLICK FIX */
    info: (
      <div
        className={styles.infoClickable}
        onClick={() => navigate(`/user-info/female/${u.id}`)}
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
        <h2 className={styles.heading}>Female Users</h2>
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

export default FemaleUserList;
