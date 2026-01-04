import React, { useEffect, useState } from "react";
import styles from "./FemaleUserList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFemaleUsers } from "../../../services/usersService";
import { toggleUserStatus } from "../../../services/adminStatusService";
import { reviewFemaleUserRegistration } from "../../../services/adminReviewService";
import { showCustomToast } from "../../../components/CustomToast/CustomToast";

const FemaleUserList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState({});
  const [openReviewId, setOpenReviewId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getFemaleUsers();

        setUsers(
          (data || []).map((u) => ({
            id: u._id,
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—",
            email: u.email || "—",
            mobile: u.mobileNumber || "—",
            joinDate: u.createdAt,
            userType: "female",
            active: Boolean(u.isActive),
            reviewStatus: u.reviewStatus || "pending",
            verified: Boolean(u.isVerified),
            subscribed: !!u.subscribed,
            plan: u.plan || "Not Subscribe",
            startDate: u.startDate || null,
            expiryDate: u.expiryDate || null,
            identity: u.identity || "not upload",
            image:
              Array.isArray(u.images) && u.images.length
                ? u.images[0]
                : null,
            balance: u.balance,
            walletBalance: u.walletBalance,
            coinBalance: u.coinBalance,
            interests: u.interests,
            languages: u.languages,
            relationshipGoals: u.relationshipGoals,
            searchPreferences: u.searchPreferences,
            favourites: u.favourites,
            following: u.femalefollowing,
            followers: u.femalefollowers,
            hobbies: u.hobbies,
            sports: u.sports,
            film: u.film,
            music: u.music,
            travel: u.travel,
            bio: u.bio,
            dateOfBirth: u.dateOfBirth,
            height: u.height,
            religion: u.religion,
            profileCompleted: u.profileCompleted,
            referralCode: u.referralCode,
          }))
        );
      } catch {
        showCustomToast("Failed to load female users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusToggle = async (user) => {
    const id = user.id;
    const newStatus = user.active ? "inactive" : "active";

    setSavingIds((p) => ({ ...p, [id]: true }));
    try {
      const updated = await toggleUserStatus({
        userType: "female",
        userId: id,
        status: newStatus,
      });

      setUsers((p) =>
        p.map((u) =>
          u.id === id
            ? {
                ...u,
                active:
                  updated?.status?.toLowerCase() === "active" ||
                  updated?.isActive === true ||
                  newStatus === "active",
              }
            : u
        )
      );

      showCustomToast(
        `${user.name} ${newStatus === "active" ? "activated" : "deactivated"}`
      );
    } catch (err) {
      showCustomToast(
        err?.response?.data?.message || "Failed to update status"
      );
    } finally {
      setSavingIds((p) => {
        const c = { ...p };
        delete c[id];
        return c;
      });
    }
  };

  const handleReviewStatus = async (userId, status) => {
    setSavingIds((p) => ({ ...p, [`review_${userId}`]: true }));
    try {
      await reviewFemaleUserRegistration({
        userId,
        reviewStatus: status,
      });

      setUsers((p) =>
        p.map((u) =>
          u.id === userId ? { ...u, reviewStatus: status } : u
        )
      );

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



  const filtered = users.filter((u) => {
    const t = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t) ||
      u.mobile.includes(t)
    );
  });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Status", accessor: "status" },
    { title: "Review Status", accessor: "reviewStatus" },

    { title: "Identity", accessor: "identity" },
    { title: "Verification", accessor: "verified" },
    { title: "Info", accessor: "info" },
  ];

  const columnData = currentData.map((user, index) => ({
    sr: startIdx + index + 1,
    name: (
      <span 
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/female/${user.id}`)}
        title="View user info"
      >
        {user.name}
      </span>
    ),
    email: (
      <span 
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/female/${user.id}`)}
        title="View user info"
      >
        {user.email}
      </span>
    ),
    mobile: (
      <span 
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/female/${user.id}`)}
        title="View user info"
      >
        {user.mobile}
      </span>
    ),

    status: (
      <button
        className={`${styles.statusButton} ${
          user.active ? styles.active : styles.inactive
        }`}
        disabled={!!savingIds[user.id]}
        onClick={() => handleStatusToggle(user)}
      >
        {savingIds[user.id]
          ? "Updating..."
          : user.active
          ? "Active"
          : "Inactive"}
      </button>
    ),

    reviewStatus:
      user.reviewStatus === "pending" ? (
        openReviewId === user.id ? (
          <div className={styles.reviewActions}>
            <button 
              className={styles.approveBtn}
              onClick={() => handleReviewStatus(user.id, "accepted")}
              disabled={!!savingIds[`review_${user.id}`]}
            >
              {savingIds[`review_${user.id}`] ? "..." : "✔"}
            </button>
            <button 
              className={styles.rejectBtn}
              onClick={() => handleReviewStatus(user.id, "rejected")}
              disabled={!!savingIds[`review_${user.id}`]}
            >
              {savingIds[`review_${user.id}`] ? "..." : "✖"}
            </button>
          </div>
        ) : (
          <span
            className={styles.orange}
            onClick={() => setOpenReviewId(user.id)}
            style={{ cursor: "pointer" }}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            user.reviewStatus === "accepted"
              ? styles.green
              : styles.red
          }
        >
          {user.reviewStatus === "accepted" ? "Approved" : "Rejected"}
        </span>
      ),


    identity: (
      <span 
        className={`${styles.badgeGray} ${styles.clickableCell}`}
        onClick={() => navigate(`/user-info/female/${user.id}`)}
        title="View user info"
      >
        {user.identity}
      </span>
    ),

    verified: (
      <span 
        className={styles.clickableCell}
        onClick={() => navigate(`/user-info/female/${user.id}`)}
        title="View user info"
      >
        {user.verified ? (
          <span className={styles.green}>Approved</span>
        ) : (
          <span className={styles.gray}>Waiting</span>
        )}
      </span>
    ),

    info: (
      <span
        className={`${styles.infoIcon} ${styles.clickableCell}`}
        onClick={() => navigate(`/user-info/female/${user.id}`)}
        title="View user info"
      >
        {user.image ? (
          <img src={user.image} alt="User" className={styles.image} onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.onerror = null; // prevent infinite loop if fallback also fails
          }} />
        ) : (
          <FaUserCircle size={24} />
        )}
      </span>
    ),
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Female Users</h2>

      <div className={styles.tableCard}>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Female Users..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DynamicTable
          headings={headings}
          columnData={columnData}
          noDataMessage={loading ? "Loading..." : "No users found"}
        />

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