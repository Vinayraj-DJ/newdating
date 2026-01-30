// import React, { useEffect, useState } from "react";
// import styles from "./MaleUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getMaleUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// const MaleUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [savingIds, setSavingIds] = useState({});

//   useEffect(() => {
//     const controller = new AbortController();
//     let mounted = true;

//     async function load() {
//       setLoading(true);
//       setError(null);
//       try {
//         const resp = await getMaleUsers({ signal: controller.signal });
//         // normalize returned shapes: array or { data: [...] }
//         const arr = Array.isArray(resp) ? resp : resp?.data ?? resp ?? [];
//         const normalized = (arr || []).map((u) => {
//           const first = u?.firstName || u?.first_name || "";
//           const last = u?.lastName || u?.last_name || "";
//           const name = first || last ? `${first} ${last}`.trim() : u?.name || "—";
//           const image =
//             Array.isArray(u.images) && u.images.length
//               ? (u.images.find((i) => typeof i === "string" && i.startsWith("http")) || u.images[0])
//               : u.image || null;

//           return {
//             id: u._id || u.id,
//             name,
//             email: u.email || "—",
//             mobile: u.mobileNumber || u.mobile || "—",
//             joinDate: u.createdAt || u.joinDate || null,
//             userType: u.gender || "male",
//             active:
//               typeof u.isActive === "boolean"
//                 ? u.isActive
//                 : String(u.status || "").toLowerCase() === "active",
//             verified: Boolean(u.isVerified),
//             subscribed: !!u.subscribed,
//             plan: u.plan || "Not Subscribe",
//             startDate: u.startDate || null,
//             expiryDate: u.expiryDate || null,
//             identity: u.identity || "not upload",
//             image,
//             raw: u,
//             balance: u.balance,
//             walletBalance: u.walletBalance,
//             coinBalance: u.coinBalance,
//             interests: u.interests,
//             languages: u.languages,
//             relationshipGoals: u.relationshipGoals,
//             searchPreferences: u.searchPreferences,
//             favourites: u.favourites,
//             following: u.malefollowing,
//             followers: u.malefollowers,
//             hobbies: u.hobbies,
//             sports: u.sports,
//             film: u.film,
//             music: u.music,
//             travel: u.travel,
//             bio: u.bio,
//             dateOfBirth: u.dateOfBirth,
//             height: u.height,
//             religion: u.religion,
//             profileCompleted: u.profileCompleted,
//             referralCode: u.referralCode,
//           };
//         });

//         if (mounted) setUsers(normalized);
//       } catch (err) {
//         if (!controller.signal.aborted) setError(err?.message || "Failed to load male users");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);

//   async function handleStatusToggle(user) {
//     const id = user.id;
//     const userType = "male";
//     const newStatus = user.active ? "inactive" : "active";

//     setSavingIds((prev) => ({ ...prev, [id]: true }));

//     try {
//       const updated = await toggleUserStatus({ userType, userId: id, status: newStatus });
//       showCustomToast(
//         `${user.name || "User"} ${newStatus === "active" ? "activated" : "deactivated"} successfully!`
//       );

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === id
//             ? {
//                 ...u,
//                 active:
//                   updated?.status?.toLowerCase() === "active" ||
//                   updated?.isActive === true ||
//                   newStatus === "active",
//                 raw: { ...u.raw, ...updated },
//               }
//             : u
//         )
//       );
//     } catch (err) {
//       console.error("Status toggle failed:", err);
//       const message =
//         err?.response?.data?.message || err?.message || "Failed to update user status.";
//       showCustomToast(message);
//     } finally {
//       setSavingIds((prev) => {
//         const clone = { ...prev };
//         delete clone[id];
//         return clone;
//       });
//     }
//   }

//   // filter/search
//   const filtered = users.filter((u) => {
//     const term = searchTerm.trim().toLowerCase();
//     if (!term) return true;
//     return (
//       u.name?.toLowerCase().includes(term) ||
//       u.email?.toLowerCase().includes(term) ||
//       (u.mobile || "").includes(term)
//     );
//   });

//   // pagination
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Status", accessor: "status" },

//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((user, index) => ({
//     sr: startIdx + index + 1,
//     name: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/male/${user.id}`)}
//         title="View user info"
//       >
//         {user.name}
//       </span>
//     ),
//     email: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/male/${user.id}`)}
//         title="View user info"
//       >
//         {user.email}
//       </span>
//     ),
//     mobile: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/male/${user.id}`)}
//         title="View user info"
//       >
//         {user.mobile}
//       </span>
//     ),
//     status: (
//       <button
//         onClick={() => handleStatusToggle(user)}
//         disabled={!!savingIds[user.id]}
//         className={`${styles.statusButton} ${user.active ? styles.active : styles.inactive}`}
//       >
//         {savingIds[user.id] ? "Updating..." : user.active ? "Active" : "Inactive"}
//       </button>
//     ),
//     identity: (
//       <span 
//         className={`${styles.badgeGray} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/male/${user.id}`)}
//         title="View user info"
//       >
//         {user.identity || "not upload"}
//       </span>
//     ),
//     verified: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/male/${user.id}`)}
//         title="View user info"
//       >
//         {user.verified ? <span className={styles.green}>Approved</span> : "Wait For Upload"}
//       </span>
//     ),
//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/male/${user.id}`)}
//         title="View user info"
//       >
//         {user.image ? (
//           // eslint-disable-next-line
//           <img src={user.image} alt="User" className={styles.image} onError={(e) => {
//             e.currentTarget.style.display = "none";
//             e.currentTarget.onerror = null; // prevent infinite loop if fallback also fails
//           }} />
//         ) : (
//           <FaUserCircle color="purple" size={24} />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Male Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar placeholder="Search Male Users..." onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>

//         {loading && <div className={styles.info}>Loading users…</div>}
//         {error && <div className={styles.error}>Error: {error}</div>}

//         <div className={styles.tableWrapper}>
//           <DynamicTable
//             headings={headings}
//             columnData={columnData}
//             noDataMessage={loading ? "Loading..." : "No users found."}
//           />
//         </div>

//         <PaginationTable
//           data={filtered}
//           currentPage={currentPage}
//           itemsPerPage={itemsPerPage}
//           setCurrentPage={setCurrentPage}
//           setItemsPerPage={setItemsPerPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default MaleUserList;


// import React, { useEffect, useState } from "react";
// import styles from "./MaleUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getMaleUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// /* =====================================================
//    AVATAR
// ===================================================== */
// const UserAvatar = ({ src }) => {
//   const [err, setErr] = useState(false);
//   if (!src || err) return <FaUserCircle size={24} color="purple" />;

//   return (
//     <img
//       src={src}
//       alt="User"
//       className={styles.image}
//       onError={() => setErr(true)}
//     />
//   );
// };

// const MaleUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState({});

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       try {
//         const data = await getMaleUsers();
//         setUsers(
//           (data || []).map((u) => ({
//             id: u._id,
//             name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || "—",
//             active: Boolean(u.isActive),
//             verified: Boolean(u.isVerified),
//             identity: u.identity || "not upload",
//             image:
//               Array.isArray(u.images) && u.images.length > 0
//                 ? u.images[0]?.imageUrl
//                 : null,
//           }))
//         );
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const handleStatusToggle = async (u) => {
//     const newStatus = u.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [u.id]: true }));

//     try {
//       await toggleUserStatus({ userType: "male", userId: u.id, status: newStatus });
//       setUsers((p) =>
//         p.map((x) => (x.id === u.id ? { ...x, active: newStatus === "active" } : x))
//       );
//       showCustomToast("success", "Status updated");
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[u.id];
//         return c;
//       });
//     }
//   };

//   const filtered = users.filter((u) =>
//     u.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Status", accessor: "status" },
//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((u, i) => ({
//     sr: startIdx + i + 1,
//     name: <span onClick={() => navigate(`/user-info/male/${u.id}`)}>{u.name}</span>,
//     email: u.email,
//     mobile: u.mobile,
//     status: (
//       <button
//         onClick={() => handleStatusToggle(u)}
//         className={`${styles.statusButton} ${u.active ? styles.active : styles.inactive}`}
//       >
//         {u.active ? "Active" : "Inactive"}
//       </button>
//     ),
//     identity: u.identity,
//     verified: u.verified ? "Approved" : "Waiting",
//     info: <UserAvatar src={u.image} />,
//   }));

//   return (
//     <div className={styles.container}>
//       <h2>Male Users</h2>

//       <SearchBar placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />

//       <DynamicTable
//         headings={headings}
//         columnData={columnData}
//         noDataMessage={loading ? "Loading..." : "No users"}
//       />

//       <PaginationTable
//         data={filtered}
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//         setCurrentPage={setCurrentPage}
//         setItemsPerPage={setItemsPerPage}
//       />
//     </div>
//   );
// };

// export default MaleUserList;


import React, { useEffect, useState } from "react";
import styles from "./MaleUserList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMaleUsers, toggleUserStatus, deleteUser } from "../../../services/usersService";
import { reviewMaleUserRegistration } from "../../../services/adminReviewService"; // Import the service
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

const MaleUserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openReviewId, setOpenReviewId] = useState(null); // State to track which user's review is open


  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getMaleUsers();
      setUsers(
        (data || []).map((u) => ({
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
        }))
      );
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusToggle = async (u) => {
    const status = u.active ? "inactive" : "active";
    setSavingIds((p) => ({ ...p, [u.id]: true }));
    await toggleUserStatus({ userType: "male", userId: u.id, status });
    setUsers((p) =>
      p.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
    );
    setSavingIds((p) => ({ ...p, [u.id]: false }));
    showCustomToast("success", `${u.name} has been ${status === "active" ? "activated" : "deactivated"} successfully`);
  };

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser({ userType: "male", userId: userToDelete.id });
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

  // Handle review status for male users
  const handleReviewStatus = async (userId, status) => {
    setSavingIds((p) => ({ ...p, [`review_${userId}`]: true }));
    try {
      await reviewMaleUserRegistration({
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
        className={`${styles.statusButton} ${
          u.active ? styles.active : styles.inactive
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
      <h2 className={styles.heading}>Male Users</h2>
      
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

export default MaleUserList;