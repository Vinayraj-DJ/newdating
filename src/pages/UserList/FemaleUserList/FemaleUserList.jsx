// import React, { useEffect, useState } from "react";
// import styles from "./FemaleUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getFemaleUsers } from "../../../services/usersService";
// import { toggleUserStatus } from "../../../services/adminStatusService";
// import { reviewFemaleUserRegistration } from "../../../services/adminReviewService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// const FemaleUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [savingIds, setSavingIds] = useState({});
//   const [openReviewId, setOpenReviewId] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const data = await getFemaleUsers();

//         setUsers(
//           (data || []).map((u) => ({
//             id: u._id,
//             name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || "—",
//             joinDate: u.createdAt,
//             userType: "female",
//             active: Boolean(u.isActive),
//             reviewStatus: u.reviewStatus || "pending",
//             verified: Boolean(u.isVerified),
//             subscribed: !!u.subscribed,
//             plan: u.plan || "Not Subscribe",
//             startDate: u.startDate || null,
//             expiryDate: u.expiryDate || null,
//             identity: u.identity || "not upload",
//             image:
//               Array.isArray(u.images) && u.images.length
//                 ? u.images[0]
//                 : null,
//             balance: u.balance,
//             walletBalance: u.walletBalance,
//             coinBalance: u.coinBalance,
//             interests: u.interests,
//             languages: u.languages,
//             relationshipGoals: u.relationshipGoals,
//             searchPreferences: u.searchPreferences,
//             favourites: u.favourites,
//             following: u.femalefollowing,
//             followers: u.femalefollowers,
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
//           }))
//         );
//       } catch {
//         showCustomToast("Failed to load female users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleStatusToggle = async (user) => {
//     const id = user.id;
//     const newStatus = user.active ? "inactive" : "active";

//     setSavingIds((p) => ({ ...p, [id]: true }));
//     try {
//       const updated = await toggleUserStatus({
//         userType: "female",
//         userId: id,
//         status: newStatus,
//       });

//       setUsers((p) =>
//         p.map((u) =>
//           u.id === id
//             ? {
//                 ...u,
//                 active:
//                   updated?.status?.toLowerCase() === "active" ||
//                   updated?.isActive === true ||
//                   newStatus === "active",
//               }
//             : u
//         )
//       );

//       showCustomToast(
//         `${user.name} ${newStatus === "active" ? "activated" : "deactivated"}`
//       );
//     } catch (err) {
//       showCustomToast(
//         err?.response?.data?.message || "Failed to update status"
//       );
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[id];
//         return c;
//       });
//     }
//   };

//   const handleReviewStatus = async (userId, status) => {
//     setSavingIds((p) => ({ ...p, [`review_${userId}`]: true }));
//     try {
//       await reviewFemaleUserRegistration({
//         userId,
//         reviewStatus: status,
//       });

//       setUsers((p) =>
//         p.map((u) =>
//           u.id === userId ? { ...u, reviewStatus: status } : u
//         )
//       );

//       showCustomToast(
//         `User review ${status === "accepted" ? "approved" : "rejected"} successfully`
//       );
//       setOpenReviewId(null);
//     } catch (err) {
//       showCustomToast(
//         err?.response?.data?.message || "Failed to update review status"
//       );
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[`review_${userId}`];
//         return c;
//       });
//     }
//   };



//   const filtered = users.filter((u) => {
//     const t = searchTerm.toLowerCase();
//     return (
//       u.name.toLowerCase().includes(t) ||
//       u.email.toLowerCase().includes(t) ||
//       u.mobile.includes(t)
//     );
//   });

//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "reviewStatus" },

//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((user, index) => ({
//     sr: startIdx + index + 1,
//     name: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/female/${user.id}`)}
//         title="View user info"
//       >
//         {user.name}
//       </span>
//     ),
//     email: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/female/${user.id}`)}
//         title="View user info"
//       >
//         {user.email}
//       </span>
//     ),
//     mobile: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/female/${user.id}`)}
//         title="View user info"
//       >
//         {user.mobile}
//       </span>
//     ),

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           user.active ? styles.active : styles.inactive
//         }`}
//         disabled={!!savingIds[user.id]}
//         onClick={() => handleStatusToggle(user)}
//       >
//         {savingIds[user.id]
//           ? "Updating..."
//           : user.active
//           ? "Active"
//           : "Inactive"}
//       </button>
//     ),

//     reviewStatus:
//       user.reviewStatus === "pending" ? (
//         openReviewId === user.id ? (
//           <div className={styles.reviewActions}>
//             <button 
//               className={styles.approveBtn}
//               onClick={() => handleReviewStatus(user.id, "accepted")}
//               disabled={!!savingIds[`review_${user.id}`]}
//             >
//               {savingIds[`review_${user.id}`] ? "..." : "✔"}
//             </button>
//             <button 
//               className={styles.rejectBtn}
//               onClick={() => handleReviewStatus(user.id, "rejected")}
//               disabled={!!savingIds[`review_${user.id}`]}
//             >
//               {savingIds[`review_${user.id}`] ? "..." : "✖"}
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenReviewId(user.id)}
//             style={{ cursor: "pointer" }}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             user.reviewStatus === "accepted"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {user.reviewStatus === "accepted" ? "Approved" : "Rejected"}
//         </span>
//       ),


//     identity: (
//       <span 
//         className={`${styles.badgeGray} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/female/${user.id}`)}
//         title="View user info"
//       >
//         {user.identity}
//       </span>
//     ),

//     verified: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/female/${user.id}`)}
//         title="View user info"
//       >
//         {user.verified ? (
//           <span className={styles.green}>Approved</span>
//         ) : (
//           <span className={styles.gray}>Waiting</span>
//         )}
//       </span>
//     ),

//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/female/${user.id}`)}
//         title="View user info"
//       >
//         {user.image ? (
//           <img src={user.image} alt="User" className={styles.image} onError={(e) => {
//             e.currentTarget.style.display = "none";
//             e.currentTarget.onerror = null; // prevent infinite loop if fallback also fails
//           }} />
//         ) : (
//           <FaUserCircle size={24} />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Female Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search Female Users..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <DynamicTable
//           headings={headings}
//           columnData={columnData}
//           noDataMessage={loading ? "Loading..." : "No users found"}
//         />

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

// export default FemaleUserList;












// import React, { useEffect, useState } from "react";
// import styles from "./FemaleUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getFemaleUsers } from "../../../services/usersService";
// import { toggleUserStatus } from "../../../services/adminStatusService";
// import { reviewFemaleUserRegistration } from "../../../services/adminReviewService";
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

// const FemaleUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [savingIds, setSavingIds] = useState({});
//   const [openReviewId, setOpenReviewId] = useState(null);

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         setLoading(true);
//         const data = await getFemaleUsers();

//         setUsers(
//           (data || []).map((u) => ({
//             id: u._id,
//             name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || "—",
//             active: Boolean(u.isActive),
//             reviewStatus: u.reviewStatus || "pending",
//             verified: Boolean(u.isVerified),
//             identity: u.identity || "not upload",
//             image:
//               Array.isArray(u.images) && u.images.length > 0
//                 ? u.images[0]?.imageUrl
//                 : null,
//           }))
//         );
//       } catch {
//         showCustomToast("error", "Failed to load female users");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchUsers();
//   }, []);

//   const handleStatusToggle = async (user) => {
//     const newStatus = user.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [user.id]: true }));

//     try {
//       await toggleUserStatus({
//         userType: "female",
//         userId: user.id,
//         status: newStatus,
//       });

//       setUsers((p) =>
//         p.map((u) =>
//           u.id === user.id ? { ...u, active: newStatus === "active" } : u
//         )
//       );
//       showCustomToast("success", `${user.name} updated`);
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[user.id];
//         return c;
//       });
//     }
//   };

//   const handleReviewStatus = async (id, status) => {
//     setSavingIds((p) => ({ ...p, [`review_${id}`]: true }));
//     try {
//       await reviewFemaleUserRegistration({ userId: id, reviewStatus: status });
//       setUsers((p) =>
//         p.map((u) => (u.id === id ? { ...u, reviewStatus: status } : u))
//       );
//       setOpenReviewId(null);
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[`review_${id}`];
//         return c;
//       });
//     }
//   };

//   const filtered = users.filter((u) => {
//     const t = searchTerm.toLowerCase();
//     return (
//       u.name.toLowerCase().includes(t) ||
//       u.email.toLowerCase().includes(t) ||
//       u.mobile.includes(t)
//     );
//   });

//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "reviewStatus" },
//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((u, i) => ({
//     sr: startIdx + i + 1,
//     name: <span className={styles.clickableCell} onClick={() => navigate(`/user-info/female/${u.id}`)}>{u.name}</span>,
//     email: <span className={styles.clickableCell}>{u.email}</span>,
//     mobile: <span className={styles.clickableCell}>{u.mobile}</span>,
//     status: (
//       <button
//         onClick={() => handleStatusToggle(u)}
//         className={`${styles.statusButton} ${u.active ? styles.active : styles.inactive}`}
//       >
//         {u.active ? "Active" : "Inactive"}
//       </button>
//     ),
//     reviewStatus:
//       u.reviewStatus === "pending" ? (
//         openReviewId === u.id ? (
//           <>
//             <button onClick={() => handleReviewStatus(u.id, "accepted")}>✔</button>
//             <button onClick={() => handleReviewStatus(u.id, "rejected")}>✖</button>
//           </>
//         ) : (
//           <span onClick={() => setOpenReviewId(u.id)} className={styles.orange}>Pending</span>
//         )
//       ) : (
//         <span className={u.reviewStatus === "accepted" ? styles.green : styles.red}>
//           {u.reviewStatus}
//         </span>
//       ),
//     identity: <span>{u.identity}</span>,
//     verified: <span>{u.verified ? "Approved" : "Waiting"}</span>,
//     info: <UserAvatar src={u.image} />,
//   }));

//   return (
//     <div className={styles.container}>
//       <h2>Female Users</h2>

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

// export default FemaleUserList;










// import React, { useEffect, useState } from "react";
// import styles from "./FemaleUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getFemaleUsers } from "../../../services/usersService";
// import { toggleUserStatus } from "../../../services/adminStatusService";
// import { reviewFemaleUserRegistration } from "../../../services/adminReviewService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// /* Avatar */
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

// const FemaleUserList = () => {
//   const navigate = useNavigate();

//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState({});
//   const [openReviewId, setOpenReviewId] = useState(null);

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       try {
//         const data = await getFemaleUsers();
//         setUsers(
//           (data || []).map((u) => ({
//             id: u._id,
//             name:
//               u.name ||
//               `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
//               "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || "—",
//             active: Boolean(u.isActive),
//             verified: Boolean(u.isVerified),
//             reviewStatus: u.reviewStatus || "pending",
//             identity: u.identity || "not upload",
//             image: u.images?.[0]?.imageUrl || null,
//           }))
//         );
//       } catch {
//         showCustomToast("error", "Failed to load female users");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const handleStatusToggle = async (u) => {
//     const status = u.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [u.id]: true }));
//     await toggleUserStatus({ userType: "female", userId: u.id, status });
//     setUsers((p) =>
//       p.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
//     );
//     setSavingIds((p) => ({ ...p, [u.id]: false }));
//     showCustomToast("success", "Status updated");
//   };

//   const handleReview = async (id, status) => {
//     setSavingIds((p) => ({ ...p, [`review_${id}`]: true }));
//     await reviewFemaleUserRegistration({ userId: id, reviewStatus: status });
//     setUsers((p) =>
//       p.map((x) => (x.id === id ? { ...x, reviewStatus: status } : x))
//     );
//     setOpenReviewId(null);
//     setSavingIds((p) => ({ ...p, [`review_${id}`]: false }));
//   };

//   const filtered = users.filter((u) => {
//     const t = searchTerm.toLowerCase();
//     return (
//       u.name.toLowerCase().includes(t) ||
//       u.email.toLowerCase().includes(t) ||
//       u.mobile.includes(t)
//     );
//   });

//   const start = (currentPage - 1) * itemsPerPage;
//   const rows = filtered.slice(start, start + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "review" },
//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = rows.map((u, i) => ({
//     sr: start + i + 1,

//     name: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/female/${u.id}`)}
//       >
//         {u.name}
//       </span>
//     ),

//     email: u.email,
//     mobile: u.mobile,

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           u.active ? styles.active : styles.inactive
//         }`}
//         onClick={() => handleStatusToggle(u)}
//       >
//         {u.active ? "Active" : "Inactive"}
//       </button>
//     ),

//     review:
//       u.reviewStatus === "pending" ? (
//         openReviewId === u.id ? (
//           <>
//             <button onClick={() => handleReview(u.id, "accepted")}>✔</button>
//             <button onClick={() => handleReview(u.id, "rejected")}>✖</button>
//           </>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenReviewId(u.id)}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             u.reviewStatus === "accepted" ? styles.green : styles.red
//           }
//         >
//           {u.reviewStatus}
//         </span>
//       ),

//     /* ✅ IDENTITY FIX */
//     identity: (
//       <span className={styles.identityBadge}>
//         {u.identity || "not upload"}
//       </span>
//     ),

//     /* ✅ VERIFICATION FIX */
//     verified: u.verified ? (
//       <span className={styles.verifiedApproved}>Approved</span>
//     ) : (
//       <span className={styles.verifiedPending}>Waiting</span>
//     ),

//     /* ✅ INFO CLICK FIX */
//     info: (
//       <div
//         className={styles.infoClickable}
//         onClick={() => navigate(`/user-info/female/${u.id}`)}
//       >
//         <UserAvatar src={u.image} />
//       </div>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Female Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className={styles.tableScrollWrapper}>
//           <DynamicTable
//             headings={headings}
//             columnData={columnData}
//             noDataMessage={loading ? "Loading..." : "No users"}
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

// export default FemaleUserList;










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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState({});
  const [openReviewId, setOpenReviewId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  /* ✅ REQUIRED FOR KYC */
  const [openKycId, setOpenKycId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getFemaleUsers();
        setUsers(
          (data || []).map((u) => ({
            id: u._id,
            name:
              u.name ||
              u.fullName ||
              `${u.firstName || u.first_name || ""} ${u.lastName || u.last_name || ""}`.trim() ||
              "—",
            email: u.email || "—",
            mobile: u.mobileNumber || u.mobile || "—",
            active: u.isActive === true || u.status?.toLowerCase() === "active",
            verified: Boolean(u.isVerified),
            reviewStatus: u.reviewStatus || "pending",
            image: u.images?.[0]?.imageUrl || u.image || null,

            /* ✅ FROM API */
            kycStatus: u.kycStatus || "pending",
            videoUrl: u.videoUrl || null,
          }))
        );
      } catch {
        showCustomToast("error", "Failed to load female users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusToggle = async (u) => {
    const status = u.active ? "inactive" : "active";
    console.log("🔍 Toggling user status:", { 
      userId: u.id, 
      currentStatus: u.active ? "active" : "inactive", 
      newStatus: status,
      userType: "female" 
    });
    
    setSavingIds((p) => ({ ...p, [u.id]: true }));
    
    try {
      const result = await toggleUserStatus({ userType: "female", userId: u.id, status });
      console.log("✅ API Response:", result);
      
      setUsers((p) =>
        p.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
      );
      showCustomToast("success", `${u.name} has been ${status === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("❌ Status toggle failed:", error);
      showCustomToast("error", error.message || "Failed to update status");
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
        await deleteUser({ userType: "female", userId: userToDelete.id });
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

  const handleReview = async (id, status) => {
    setSavingIds((p) => ({ ...p, [`review_${id}`]: true }));
    await reviewFemaleUserRegistration({ userId: id, reviewStatus: status });
    setUsers((p) =>
      p.map((x) => (x.id === id ? { ...x, reviewStatus: status } : x))
    );
    setOpenReviewId(null);
    setSavingIds((p) => ({ ...p, [`review_${id}`]: false }));
  };

  /* ✅ KYC UI ONLY (same as Agency) */
  const updateKycStatus = (id, status) => {
    setUsers((p) =>
      p.map((x) => (x.id === id ? { ...x, kycStatus: status } : x))
    );
    setOpenKycId(null);
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
    { title: "Verification", accessor: "verified" },
    { title: "KYC Status", accessor: "kyc" },
    { title: "Video", accessor: "video" },
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
        className={`${styles.statusButton} ${
          u.active ? styles.active : styles.inactive
        }`}
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
              onClick={() => handleReview(u.id, "accepted")}
            >
              ✔
            </button>
            <button 
              className={styles.rejectBtn}
              onClick={() => handleReview(u.id, "rejected")}
            >
              ✖
            </button>
          </div>
        ) : (
          <span className={styles.orange} onClick={() => setOpenReviewId(u.id)}>
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

    verified: u.verified ? (
      <span className={styles.verifiedApproved}>Yes</span>
    ) : (
      <span className={styles.verifiedPending}>No</span>
    ),





    /* ✅ KYC (APPLIED INLINE) */
    kyc:
      u.kycStatus === "pending" ? (
        openKycId === u.id ? (
          <div className={styles.kycActions}>
            <button
              className={styles.approveBtn}
              onClick={() => updateKycStatus(u.id, "approved")}
            >
              ✔
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => updateKycStatus(u.id, "rejected")}
            >
              ✖
            </button>
          </div>
        ) : (
          <span
            className={styles.kycPending}
            onClick={() => setOpenKycId(u.id)}
          >
            Pending
          </span>
        )
      ) : (
        <span
  className={
    u.kycStatus === "approved"
      ? styles.kycApproved
      : styles.kycRejected
  }
>
  {u.kycStatus}
</span>

      ),

    video: u.videoUrl ? (
      <a
        href={u.videoUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.videoLink}
      >
        <FaVideo /> View
      </a>
    ) : (
      <span className={styles.gray}>No Video</span>
    ),

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
        message={`Are you sure you want to delete user {}? This action cannot be undone.`}
        highlightContent={userToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className={styles.tableCard}>

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

export default FemaleUserList;
