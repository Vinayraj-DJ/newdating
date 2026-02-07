
import React, { useEffect, useState } from "react";
import styles from "./AllUserList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllUsers, toggleUserStatus, deleteUser } from "../../../services/usersService";
import { showCustomToast } from "../../../components/CustomToast/CustomToast";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";

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

const AllUserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getAllUsers();

      const normalize = (u, type) => ({
        id: u._id,
        name:
          `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
          u.name ||
          "—",
        email: u.email || "—",
        mobile: u.mobileNumber || "—",
        active: Boolean(u.isActive),
        verified: Boolean(u.isVerified),
        userType: type,
        image: u.images?.[0]?.imageUrl || u.image || null,
      });

      const combined = [
        ...(res.males || []).map((u) => normalize(u, "male")),
        ...(res.females || []).map((u) => normalize(u, "female")),
        ...(res.agencies || []).map((u) => normalize(u, "agency")),
      ];

      setUsers(combined);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusToggle = async (u) => {
    const status = u.active ? "inactive" : "active";
    setSavingIds((p) => ({ ...p, [u.id]: true }));
    
    try {
      await toggleUserStatus({ userType: u.userType, userId: u.id, status });
      setUsers((p) =>
        p.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
      );
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
        await deleteUser({ userType: userToDelete.userType, userId: userToDelete.id });
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
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
    { title: "Type", accessor: "type" },
    { title: "Status", accessor: "status" },
    { title: "Verification", accessor: "verified", className: styles.tableHeaderPurple },
    { title: "Info", accessor: "info" },
    { title: "Delete", accessor: "delete" },
  ];

  const columnData = rows.map((u, i) => ({
    sr: start + i + 1,

    name: (
      <span
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/${u.userType}/${u.id}`)}
      >
        {u.name}
      </span>
    ),

    email: u.email,
    mobile: u.mobile,
    type: u.userType,

    status: (
      <button
        className={`${styles.statusButton} ${
          u.active ? styles.active : styles.inactive
        }`}
        onClick={() => handleStatusToggle(u)}
      >
        {u.active ? "Active" : "Inactive"}
      </button>
    ),



    verified: u.verified ? (
      <span className={styles.verifiedApproved}>Yes</span>
    ) : (
      <span className={styles.verifiedPending}>No</span>
    ),

    info: (
      <div
        className={styles.infoClickable}
        onClick={() => navigate(`/user-info/${u.userType}/${u.id}`)}
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
      <h2 className={styles.heading}>All Users</h2>
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user {}? This action cannot be undone.`}
        highlightContent={userToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className={styles.tableCard}>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableScrollWrapper}>
          <DynamicTable
            headings={headings}
            columnData={columnData}
            noDataMessage={loading ? "Loading..." : "No users"}
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

export default AllUserList;
