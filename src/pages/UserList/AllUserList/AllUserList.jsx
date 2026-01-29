




// import React, { useEffect, useState } from "react";
// import styles from "./AllUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAllUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// const AllUserList = () => {
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

//     async function loadUsers() {
//       setLoading(true);
//       setError(null);
//       try {
//         const resp = await getAllUsers({ signal: controller.signal });
//         const payload = resp?.data ?? resp;
//         const males = payload?.males || [];
//         const females = payload?.females || [];
//         const agencies = payload?.agencies || [];

//         const normalize = (u, typeFallback) => {
//           const first = u?.firstName || u?.first_name || "";
//           const last = u?.lastName || u?.last_name || "";
//           const name =
//             first || last ? `${first} ${last}`.trim() : u?.name || "—";

//           return {
//             id: u._id || u.id,
//             name,
//             email: u.email || "—",
//             mobile: u.mobileNumber || u.mobile || "—",
//             joinDate: u.createdAt || u.joinDate || null,
//             active:
//               typeof u.isActive === "boolean"
//                 ? u.isActive
//                 : String(u.status || "").toLowerCase() === "active",
//             userType: typeFallback || u.gender || "unknown",
//             verified: Boolean(u.isVerified),
//             subscribed: !!u.subscribed,
//             plan: u.plan || "Not Subscribe",
//             startDate: u.startDate || null,
//             expiryDate: u.expiryDate || null,
//             identity: u.identity || "not upload",
//             image:
//               Array.isArray(u.images) && u.images.length
//                 ? u.images[0]
//                 : u.image || null,
//             raw: u,
//             balance: u.balance,
//             walletBalance: u.walletBalance,
//             coinBalance: u.coinBalance,
//             interests: u.interests,
//             languages: u.languages,
//             relationshipGoals: u.relationshipGoals,
//             searchPreferences: u.searchPreferences,
//             favourites: u.favourites,
//             following: u.malefollowing || u.femalefollowing,
//             followers: u.malefollowers || u.femalefollowers,
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
//         };

//         const combined = [
//           ...males.map((m) => normalize(m, "male")),
//           ...females.map((f) => normalize(f, "female")),
//           ...agencies.map((a) => normalize(a, "agency")),
//         ];

//         if (mounted) setUsers(combined);
//       } catch (err) {
//         if (!controller.signal.aborted)
//           setError(err.message || "Failed to load users");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     loadUsers();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);

//   /** 🔁 Toggle Active <-> Inactive */
//   async function handleStatusToggle(user) {
//     const id = user.id;
//     const userType = user.userType || "male";
//     const newStatus = user.active ? "inactive" : "active";

//     setSavingIds((prev) => ({ ...prev, [id]: true }));

//     try {
//       const updatedUser = await toggleUserStatus({
//         userType,
//         userId: id,
//         status: newStatus,
//       });

//       showCustomToast(
//         `${user.name || "User"} ${
//           newStatus === "active" ? "activated" : "deactivated"
//         } successfully!`
//       );

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === id
//             ? {
//                 ...u,
//                 active:
//                   updatedUser?.status?.toLowerCase() === "active" ||
//                   updatedUser?.isActive === true ||
//                   newStatus === "active",
//                 raw: { ...u.raw, ...updatedUser },
//               }
//             : u
//         )
//       );
//     } catch (err) {
//       console.error("Status toggle failed:", err);
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to update user status.";
//       showCustomToast(message);
//     } finally {
//       setSavingIds((prev) => {
//         const clone = { ...prev };
//         delete clone[id];
//         return clone;
//       });
//     }
//   }

//   // 🔍 Filter by search term
//   const filtered = users.filter((u) => {
//     const term = searchTerm.trim().toLowerCase();
//     if (!term) return true;
//     return (
//       u.name?.toLowerCase().includes(term) ||
//       u.email?.toLowerCase().includes(term) ||
//       u.mobile?.includes(term)
//     );
//   });

//   // 📄 Pagination
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Type", accessor: "type" },
//     { title: "Status", accessor: "status" },

//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((user, index) => ({
//     sr: startIdx + index + 1,
//     name: user.name,
//     email: user.email,
//     mobile: user.mobile,
//     type: user.userType || "unknown",
//     status: (
//       <button
//         onClick={() => handleStatusToggle(user)}
//         disabled={!!savingIds[user.id]}
//         className={`${styles.statusButton} ${
//           user.active ? styles.active : styles.inactive
//         }`}
//       >
//         {savingIds[user.id]
//           ? "Updating..."
//           : user.active
//           ? "Active"
//           : "Inactive"}
//       </button>
//     ),
//     identity: (
//       <span className={styles.badgeGray}>
//         {user.identity || "not upload"}
//       </span>
//     ),
//     verified: user.verified ? (
//       <span className={styles.green}>Approved</span>
//     ) : (
//       "Wait For Upload"
//     ),
//    info: (
//   <span
//     className={styles.infoIcon}
//     onClick={() =>
//       navigate(`/user-info/${user.userType}/${user.id}`)

//     }
//     title="View Info"
//     style={{ cursor: "pointer" }}
//   >
//     {user.image ? (
//       <img src={user.image} alt="User" className={styles.image} />
//     ) : (
//       <FaUserCircle color="purple" size={24} />
//     )}
//   </span>
// ),

//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>All Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search users..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
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

// export default AllUserList;










// import React, { useEffect, useState } from "react";
// import styles from "./AllUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAllUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// const AllUserList = () => {
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

//     const loadUsers = async () => {
//       setLoading(true);
//       try {
//         const resp = await getAllUsers({ signal: controller.signal });
//         const payload = resp?.data ?? resp;

//         const normalize = (u, type) => {
//           let image = null;
//           if (Array.isArray(u.images) && u.images.length) {
//             image =
//               typeof u.images[0] === "string"
//                 ? u.images[0]
//                 : u.images[0]?.url || null;
//           } else if (typeof u.image === "string") {
//             image = u.image;
//           }

//           return {
//             id: u._id || u.id,
//             name:
//               `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
//               u.name ||
//               "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || u.mobile || "—",
//             userType: type,
//             active:
//               typeof u.isActive === "boolean"
//                 ? u.isActive
//                 : String(u.status).toLowerCase() === "active",
//             verified: Boolean(u.isVerified),
//             identity: u.identity || "not upload",
//             image,
//           };
//         };

//         const combined = [
//           ...(payload?.males || []).map((u) => normalize(u, "male")),
//           ...(payload?.females || []).map((u) => normalize(u, "female")),
//           ...(payload?.agencies || []).map((u) => normalize(u, "agency")),
//         ];

//         if (mounted) setUsers(combined);
//       } catch (err) {
//         setError("Failed to load users");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadUsers();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);

//   const handleStatusToggle = async (user) => {
//     const newStatus = user.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [user.id]: true }));

//     try {
//       await toggleUserStatus({
//         userType: user.userType,
//         userId: user.id,
//         status: newStatus,
//       });

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === user.id ? { ...u, active: newStatus === "active" } : u
//         )
//       );

//       showCustomToast(
//         `${user.name} ${
//           newStatus === "active" ? "activated" : "deactivated"
//         }`
//       );
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[user.id];
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
//     { title: "Type", accessor: "type" },
//     { title: "Status", accessor: "status" },
//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((user, index) => ({
//     sr: startIdx + index + 1,
//     name: user.name,
//     email: user.email,
//     mobile: user.mobile,
//     type: user.userType,

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           user.active ? styles.active : styles.inactive
//         }`}
//         onClick={() => handleStatusToggle(user)}
//         disabled={!!savingIds[user.id]}
//       >
//         {savingIds[user.id]
//           ? "Updating..."
//           : user.active
//           ? "Active"
//           : "Inactive"}
//       </button>
//     ),

//     identity: <span className={styles.badgeGray}>{user.identity}</span>,

//     /* ✅ VERIFICATION — SAME STYLE AS STATUS */
//    verified: user.verified ? (
//       <span className={styles.green}>Approved</span>
//     ) : (
//       "Wait For Upload"
//     ),

//     info: (
//       <span
//         className={styles.infoIcon}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.image ? (
//           <img src={user.image} className={styles.image} alt="User" />
//         ) : (
//           <FaUserCircle size={28} color="purple" />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>All Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search users..."
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

// export default AllUserList;









// import React, { useEffect, useState } from "react";
// import styles from "./AllUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAllUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// const AllUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState({});

//   useEffect(() => {
//     const controller = new AbortController();
//     let mounted = true;

//     const loadUsers = async () => {
//       setLoading(true);
//       try {
//         const resp = await getAllUsers({ signal: controller.signal });
//         const payload = resp?.data ?? resp;

//         /* ✅ ROBUST IMAGE NORMALIZER */
//         const normalize = (u, type) => {
//           let image = null;

//           if (Array.isArray(u.images) && u.images.length > 0) {
//             const img = u.images[0];

//             if (typeof img === "string") {
//               image = img;
//             } else if (img?.url) {
//               image = img.url;
//             } else if (img?.secure_url) {
//               image = img.secure_url;
//             } else if (img?.path) {
//               image = img.path.startsWith("http")
//                 ? img.path
//                 : `${process.env.REACT_APP_API_BASE_URL}${img.path}`;
//             }
//           } else if (typeof u.image === "string") {
//             image = u.image;
//           }

//           return {
//             id: u._id || u.id,
//             name:
//               `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
//               u.name ||
//               "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || u.mobile || "—",
//             userType: type,
//             active:
//               typeof u.isActive === "boolean"
//                 ? u.isActive
//                 : String(u.status || "").toLowerCase() === "active",
//             verified: Boolean(u.isVerified),
//             identity: u.identity || "not upload",
//             image,
//           };
//         };

//         const combined = [
//           ...(payload?.males || []).map((u) => normalize(u, "male")),
//           ...(payload?.females || []).map((u) => normalize(u, "female")),
//           ...(payload?.agencies || []).map((u) => normalize(u, "agency")),
//         ];

//         if (mounted) setUsers(combined);
//       } catch {
//         showCustomToast("Failed to load users");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadUsers();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);

//   const handleStatusToggle = async (user) => {
//     const newStatus = user.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [user.id]: true }));

//     try {
//       await toggleUserStatus({
//         userType: user.userType,
//         userId: user.id,
//         status: newStatus,
//       });

//       setUsers((p) =>
//         p.map((u) =>
//           u.id === user.id ? { ...u, active: newStatus === "active" } : u
//         )
//       );

//       showCustomToast(
//         `${user.name} ${newStatus === "active" ? "activated" : "deactivated"}`
//       );
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[user.id];
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
//     { title: "Type", accessor: "type" },
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
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.name}
//       </span>
//     ),
//     email: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.email}
//       </span>
//     ),
//     mobile: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.mobile}
//       </span>
//     ),
//     type: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.userType}
//       </span>
//     ),

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           user.active ? styles.active : styles.inactive
//         }`}
//         onClick={() => handleStatusToggle(user)}
//       >
//         {user.active ? "Active" : "Inactive"}
//       </button>
//     ),

//     identity: (
//       <span 
//         className={`${styles.badgeGray} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.identity}
//       </span>
//     ),

//     verified: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.verified ? "Approved" : "Waiting"}
//       </span>
//     ),

//     /* ✅ IMAGE WILL NOW SHOW */
//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//         title="View user info"
//       >
//         {user.image ? (
//           <img
//             src={user.image}
//             className={styles.image}
//             alt="User"
//             onError={(e) => {
//               e.currentTarget.style.display = "none";
//             }}
//           />
//         ) : (
//           <FaUserCircle size={28} color="purple" />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>All Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search users..."
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

// export default AllUserList;














// import React, { useEffect, useState } from "react";
// import styles from "./AllUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAllUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// /* =====================================================
//    Avatar Component (FIXES INFO COLUMN ISSUE)
// ===================================================== */
// const UserAvatar = ({ src }) => {
//   const [error, setError] = useState(false);

//   if (!src || error) {
//     return <FaUserCircle size={28} color="purple" />;
//   }

//   return (
//     <img
//       src={src}
//       alt="User"
//       className={styles.image}
//       onError={() => setError(true)}
//     />
//   );
// };

// const AllUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState({});

//   /* =====================================================
//      FETCH ALL USERS
//   ===================================================== */
//   useEffect(() => {
//     const controller = new AbortController();
//     let mounted = true;

//     const loadUsers = async () => {
//       setLoading(true);
//       try {
//         const resp = await getAllUsers({ signal: controller.signal });
//         const payload = resp?.data ?? resp;

//         const normalize = (u, type) => {
//           let image = null;

//           if (Array.isArray(u.images) && u.images.length > 0) {
//             const img = u.images[0];
//             image =
//               img?.secure_url ||
//               img?.url ||
//               (typeof img === "string" ? img : null);
//           } else if (typeof u.image === "string") {
//             image = u.image;
//           }

//           return {
//             id: u._id || u.id,
//             name:
//               `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
//               u.name ||
//               "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || u.mobile || "—",
//             userType: type,
//             active:
//               typeof u.isActive === "boolean"
//                 ? u.isActive
//                 : String(u.status || "").toLowerCase() === "active",
//             verified: Boolean(u.isVerified),
//             identity: u.identity || "not upload",
//             image: image || null, // IMPORTANT
//           };
//         };

//         const combined = [
//           ...(payload?.males || []).map((u) => normalize(u, "male")),
//           ...(payload?.females || []).map((u) => normalize(u, "female")),
//           ...(payload?.agencies || []).map((u) => normalize(u, "agency")),
//         ];

//         if (mounted) setUsers(combined);
//       } catch (err) {
//         showCustomToast("error", "Failed to load users");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadUsers();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);

//   /* =====================================================
//      STATUS TOGGLE
//   ===================================================== */
//   const handleStatusToggle = async (user) => {
//     const newStatus = user.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [user.id]: true }));

//     try {
//       await toggleUserStatus({
//         userType: user.userType,
//         userId: user.id,
//         status: newStatus,
//       });

//       setUsers((p) =>
//         p.map((u) =>
//           u.id === user.id ? { ...u, active: newStatus === "active" } : u
//         )
//       );

//       showCustomToast(
//         "success",
//         `${user.name} ${newStatus === "active" ? "activated" : "deactivated"}`
//       );
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[user.id];
//         return c;
//       });
//     }
//   };

//   /* =====================================================
//      SEARCH + PAGINATION
//   ===================================================== */
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

//   /* =====================================================
//      TABLE HEADINGS
//   ===================================================== */
//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Type", accessor: "type" },
//     { title: "Status", accessor: "status" },
//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   /* =====================================================
//      TABLE DATA
//   ===================================================== */
//   const columnData = currentData.map((user, index) => ({
//     sr: startIdx + index + 1,

//     name: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.name}
//       </span>
//     ),

//     email: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.email}
//       </span>
//     ),

//     mobile: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.mobile}
//       </span>
//     ),

//     type: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.userType}
//       </span>
//     ),

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           user.active ? styles.active : styles.inactive
//         }`}
//         disabled={savingIds[user.id]}
//         onClick={() => handleStatusToggle(user)}
//       >
//         {user.active ? "Active" : "Inactive"}
//       </button>
//     ),

//     identity: (
//       <span
//         className={`${styles.badgeGray} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.identity}
//       </span>
//     ),

//     verified: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.verified ? "Approved" : "Waiting"}
//       </span>
//     ),

//     /* ✅ FIXED INFO COLUMN */
//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         <UserAvatar src={user.image} />
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>All Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search users..."
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

// export default AllUserList;













// import React, { useEffect, useState } from "react";
// import styles from "./AllUserList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAllUsers, toggleUserStatus } from "../../../services/usersService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// /* =====================================================
//    AVATAR COMPONENT
// ===================================================== */
// const UserAvatar = ({ src }) => {
//   const [error, setError] = useState(false);

//   if (!src || error) {
//     return <FaUserCircle size={28} color="purple" />;
//   }

//   return (
//     <img
//       src={src}
//       alt="User"
//       className={styles.image}
//       onError={() => setError(true)}
//     />
//   );
// };

// const AllUserList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState({});

//   /* =====================================================
//      FETCH ALL USERS
//   ===================================================== */
//   useEffect(() => {
//     const controller = new AbortController();
//     let mounted = true;

//     const loadUsers = async () => {
//       setLoading(true);
//       try {
//         const resp = await getAllUsers({ signal: controller.signal });
//         const payload = resp?.data ?? resp;

//         const normalize = (u, type) => {
//           let image = null;

//           // ✅ Male & Female (images array)
//           if (Array.isArray(u.images) && u.images.length > 0) {
//             image = u.images[0]?.imageUrl || null;
//           }
//           // ✅ Agency (single image string)
//           else if (typeof u.image === "string") {
//             image = u.image;
//           }

//           return {
//             id: u._id || u.id,
//             name:
//               `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
//               u.name ||
//               "—",
//             email: u.email || "—",
//             mobile: u.mobileNumber || u.mobile || "—",
//             userType: type,
//             active:
//               typeof u.isActive === "boolean"
//                 ? u.isActive
//                 : String(u.status || "").toLowerCase() === "active",
//             verified: Boolean(u.isVerified),
//             identity: u.identity || "not upload",
//             image,
//           };
//         };

//         const combined = [
//           ...(payload?.males || []).map((u) => normalize(u, "male")),
//           ...(payload?.females || []).map((u) => normalize(u, "female")),
//           ...(payload?.agencies || []).map((u) => normalize(u, "agency")),
//         ];

//         if (mounted) setUsers(combined);
//       } catch (err) {
//         showCustomToast("error", "Failed to load users");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadUsers();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);

//   /* =====================================================
//      STATUS TOGGLE
//   ===================================================== */
//   const handleStatusToggle = async (user) => {
//     const newStatus = user.active ? "inactive" : "active";
//     setSavingIds((p) => ({ ...p, [user.id]: true }));

//     try {
//       await toggleUserStatus({
//         userType: user.userType,
//         userId: user.id,
//         status: newStatus,
//       });

//       setUsers((p) =>
//         p.map((u) =>
//           u.id === user.id ? { ...u, active: newStatus === "active" } : u
//         )
//       );

//       showCustomToast(
//         "success",
//         `${user.name} ${newStatus === "active" ? "activated" : "deactivated"}`
//       );
//     } finally {
//       setSavingIds((p) => {
//         const c = { ...p };
//         delete c[user.id];
//         return c;
//       });
//     }
//   };

//   /* =====================================================
//      SEARCH + PAGINATION
//   ===================================================== */
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

//   /* =====================================================
//      TABLE HEADINGS
//   ===================================================== */
//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Type", accessor: "type" },
//     { title: "Status", accessor: "status" },
//     { title: "Identity", accessor: "identity" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   /* =====================================================
//      TABLE DATA
//   ===================================================== */
//   const columnData = currentData.map((user, index) => ({
//     sr: startIdx + index + 1,

//     name: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.name}
//       </span>
//     ),

//     email: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.email}
//       </span>
//     ),

//     mobile: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.mobile}
//       </span>
//     ),

//     type: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.userType}
//       </span>
//     ),

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           user.active ? styles.active : styles.inactive
//         }`}
//         disabled={savingIds[user.id]}
//         onClick={() => handleStatusToggle(user)}
//       >
//         {user.active ? "Active" : "Inactive"}
//       </button>
//     ),

//     identity: (
//       <span
//         className={`${styles.badgeGray} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.identity}
//       </span>
//     ),

//     verified: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         {user.verified ? "Approved" : "Waiting"}
//       </span>
//     ),

//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/user-info/${user.userType}/${user.id}`)}
//       >
//         <UserAvatar src={user.image} />
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>All Users</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search users..."
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

// export default AllUserList;











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
    await toggleUserStatus({ userType: u.userType, userId: u.id, status });
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
      <span className={styles.verifiedApproved}>Approved</span>
    ) : (
      <span className={styles.verifiedPending}>Waiting</span>
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
