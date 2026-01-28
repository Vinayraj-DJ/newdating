
// import React, { useEffect, useState } from "react";
// import styles from "./AgencyList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAgencyUsers } from "../../../services/usersService";

// const AgencyList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openReviewId, setOpenReviewId] = useState(null);

//   /* -------- FETCH AGENCIES -------- */
//   useEffect(() => {
//     const fetchAgencies = async () => {
//       try {
//         setLoading(true);
//         const data = await getAgencyUsers();

//         setAgencies(
//           data.map((a) => ({
//             id: a._id,
//             name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
//             email: a.email,
//             mobile: a.mobileNumber,
//             aadhar: a.aadharNumber || "—",
//             status: a.status, // active / inactive
//             reviewStatus: a.reviewStatus, // pending / approved / rejected
//             verified: a.isVerified,
//             createdAt: a.createdAt,
//             updatedAt: a.updatedAt,
//             image: a.image,
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to fetch agencies", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgencies();
//   }, []);

//   /* -------- STATUS TOGGLE -------- */
//   const toggleStatus = (id) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? {
//               ...a,
//               status: a.status === "active" ? "inactive" : "active",
//             }
//           : a
//       )
//     );
//   };

//   /* -------- REVIEW ACTION -------- */
//   const updateReviewStatus = (id, status) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id ? { ...a, reviewStatus: status } : a
//       )
//     );
//     setOpenReviewId(null);
//   };

//   /* -------- SEARCH -------- */
//   const filtered = agencies.filter((a) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       a.name.toLowerCase().includes(term) ||
//       a.email.toLowerCase().includes(term) ||
//       a.mobile.includes(term) ||
//       a.aadhar.includes(term)
//     );
//   });

//   /* -------- PAGINATION -------- */
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   /* -------- TABLE HEADINGS -------- */
//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "ID", accessor: "id" },
//     { title: "Agency Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Aadhaar", accessor: "aadhar" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "reviewStatus" },
//     { title: "Verified", accessor: "verified" },
//     { title: "Created At", accessor: "createdAt" },
//     { title: "Updated At", accessor: "updatedAt" },
//     { title: "Info", accessor: "info" },
//   ];

//   /* -------- TABLE DATA -------- */
//   const columnData = currentData.map((agency, index) => ({
//     sr: startIdx + index + 1,
//     id: agency.id,
//     name: agency.name,
//     email: agency.email,
//     mobile: agency.mobile,
//     aadhar: agency.aadhar,

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           agency.status === "active" ? styles.active : styles.inactive
//         }`}
//         onClick={() => toggleStatus(agency.id)}
//       >
//         {agency.status}
//       </button>
//     ),

//     reviewStatus:
//       agency.reviewStatus === "pending" ? (
//         openReviewId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               onClick={() =>
//                 updateReviewStatus(agency.id, "approved")
//               }
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               onClick={() =>
//                 updateReviewStatus(agency.id, "rejected")
//               }
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenReviewId(agency.id)}
//             style={{ cursor: "pointer" }}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.reviewStatus === "approved"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.reviewStatus}
//         </span>
//       ),

//     verified: agency.verified ? (
//       <span className={styles.green}>Verified</span>
//     ) : (
//       <span className={styles.red}>Not Verified</span>
//     ),

//     createdAt: new Date(agency.createdAt).toLocaleString(),
//     updatedAt: new Date(agency.updatedAt).toLocaleString(),

//     info: (
//       <span
//         className={styles.infoIcon}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//       >
//         {agency.image ? (
//           <img src={agency.image} alt="Agency" />
//         ) : (
//           <FaUserCircle size={26} />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Agency List</h2>

//       <div className={styles.tableCard}>
//         <SearchBar
//           placeholder="Search agencies..."
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <DynamicTable
//           headings={headings}
//           columnData={columnData}
//           noDataMessage={loading ? "Loading..." : "No agencies found"}
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

// export default AgencyList;











// import React, { useEffect, useState } from "react";
// import styles from "./AgencyList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAgencyUsers } from "../../../services/usersService";

// const AgencyList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openReviewId, setOpenReviewId] = useState(null);
//   const [openKycId, setOpenKycId] = useState(null);

//   /* -------- FETCH AGENCIES -------- */
//   useEffect(() => {
//     const fetchAgencies = async () => {
//       try {
//         setLoading(true);
//         const data = await getAgencyUsers();

//         setAgencies(
//           data.map((a) => ({
//             id: a._id,
//             name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
//             email: a.email,
//             mobile: a.mobileNumber,
//             aadhar: a.aadharNumber || "—",
//             status: a.status,
//             reviewStatus: a.reviewStatus,
//             kycStatus: a.kycStatus || "pending",
//             verified: a.isVerified,
//             image: a.image,
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to fetch agencies", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgencies();
//   }, []);

//   /* -------- STATUS TOGGLE -------- */
//   const toggleStatus = (id) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: a.status === "active" ? "inactive" : "active" }
//           : a
//       )
//     );
//   };

//   /* -------- REVIEW ACTION -------- */
//   const updateReviewStatus = (id, status) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id ? { ...a, reviewStatus: status } : a
//       )
//     );
//     setOpenReviewId(null);
//   };

//   /* -------- KYC ACTION -------- */
//   const updateKycStatus = (id, status) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id ? { ...a, kycStatus: status } : a
//       )
//     );
//     setOpenKycId(null);
//   };

//   /* -------- SEARCH -------- */
//   const filtered = agencies.filter((a) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       a.name.toLowerCase().includes(term) ||
//       a.email.toLowerCase().includes(term) ||
//       a.mobile.includes(term) ||
//       a.aadhar.includes(term)
//     );
//   });

//   /* -------- PAGINATION -------- */
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   /* -------- TABLE HEADINGS -------- */
//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Agency Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Aadhaar", accessor: "aadhar" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "reviewStatus" },
//     { title: "Verified", accessor: "verified" },
//     { title: "KYC Status", accessor: "kycStatus" },
//     { title: "Is Active", accessor: "isActive" },
//     { title: "Info", accessor: "info" },
//   ];

//   /* -------- TABLE DATA -------- */
//   const columnData = currentData.map((agency, index) => ({
//     sr: startIdx + index + 1,
//     name: agency.name,
//     email: agency.email,
//     mobile: agency.mobile,
//     aadhar: agency.aadhar,

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           agency.status === "active" ? styles.active : styles.inactive
//         }`}
//         onClick={() => toggleStatus(agency.id)}
//       >
//         {agency.status}
//       </button>
//     ),

//     reviewStatus:
//       agency.reviewStatus === "pending" ? (
//         openReviewId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               onClick={() => updateReviewStatus(agency.id, "approved")}
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               onClick={() => updateReviewStatus(agency.id, "rejected")}
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenReviewId(agency.id)}
//             style={{ cursor: "pointer" }}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.reviewStatus === "approved"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.reviewStatus}
//         </span>
//       ),

//     verified: agency.verified ? (
//       <span className={styles.green}>Verified</span>
//     ) : (
//       <span className={styles.red}>Not Verified</span>
//     ),

//     kycStatus:
//       agency.kycStatus === "pending" ? (
//         openKycId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               onClick={() => updateKycStatus(agency.id, "approved")}
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               onClick={() => updateKycStatus(agency.id, "rejected")}
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenKycId(agency.id)}
//             style={{ cursor: "pointer" }}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.kycStatus === "approved"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.kycStatus}
//         </span>
//       ),

//     isActive:
//       agency.status === "active" ? (
//         <span className={styles.green}>Yes</span>
//       ) : (
//         <span className={styles.red}>No</span>
//       ),

//     info: (
//       <span
//         className={styles.infoIcon}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//       >
//         {agency.image ? (
//           <img src={agency.image} alt="Agency" />
//         ) : (
//           <FaUserCircle size={26} />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Agency List</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search Agencies..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <DynamicTable
//           headings={headings}
//           columnData={columnData}
//           noDataMessage={loading ? "Loading..." : "No agencies found"}
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

// export default AgencyList;























// import React, { useEffect, useState } from "react";
// import styles from "./AgencyList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAgencyUsers } from "../../../services/usersService";
// import { reviewAgencyRegistration } from "../../../services/adminReviewService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// const AgencyList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [openReviewId, setOpenReviewId] = useState(null);
//   const [openKycId, setOpenKycId] = useState(null);
//   const [reviewLoadingId, setReviewLoadingId] = useState(null);

//   /* -------- FETCH AGENCIES -------- */
//   useEffect(() => {
//     const fetchAgencies = async () => {
//       try {
//         setLoading(true);
//         const data = await getAgencyUsers();

//         setAgencies(
//           data.map((a) => ({
//             id: a._id,
//             name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
//             email: a.email,
//             mobile: a.mobileNumber,
//             aadhar: a.aadharOrPanNum || "—",
//             status: a.status,
//             reviewStatus: a.reviewStatus || "pending",
//             kycStatus: a.kycStatus || "pending",
//             verified: a.isVerified,
//             isActive: a.isActive,
//             balance: a.balance,
//             walletBalance: a.walletBalance,
//             coinBalance: a.coinBalance,
//             image: a.image,
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to fetch agencies", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgencies();
//   }, []);

//   /* -------- STATUS TOGGLE (UNCHANGED) -------- */
//   const toggleStatus = (id) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: a.status === "active" ? "inactive" : "active" }
//           : a
//       )
//     );
//   };

//   /* -------- REVIEW STATUS (API INTEGRATED) -------- */
//   const updateReviewStatus = async (id, status) => {
//     try {
//       setReviewLoadingId(id);

//       await reviewAgencyRegistration({
//         userId: id,
//         reviewStatus: status,
//       });

//       setAgencies((prev) =>
//         prev.map((a) =>
//           a.id === id ? { ...a, reviewStatus: status } : a
//         )
//       );

//       showCustomToast(
//         "success",
//         `Review ${status === "accepted" ? "approved" : "rejected"}`
//       );
//     } catch (err) {
//       showCustomToast("error", "Failed to update review status");
//     } finally {
//       setReviewLoadingId(null);
//       setOpenReviewId(null);
//     }
//   };

//   /* -------- KYC ACTION (UNCHANGED) -------- */
//   const updateKycStatus = (id, status) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id ? { ...a, kycStatus: status } : a
//       )
//     );
//     setOpenKycId(null);
//   };

//   /* -------- SEARCH -------- */
//   const filtered = agencies.filter((a) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       a.name.toLowerCase().includes(term) ||
//       a.email.toLowerCase().includes(term) ||
//       a.mobile.includes(term) ||
//       a.aadhar.includes(term)
//     );
//   });

//   /* -------- PAGINATION -------- */
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   /* -------- TABLE HEADINGS (UNCHANGED) -------- */
//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Agency Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Aadhaar", accessor: "aadhar" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "reviewStatus" },
//     { title: "Verified", accessor: "verified" },
//     { title: "KYC Status", accessor: "kycStatus" },
//     { title: "Is Active", accessor: "isActive" },

//     { title: "Info", accessor: "info" },
//   ];

//   /* -------- TABLE DATA -------- */
//   const columnData = currentData.map((agency, index) => ({
//     sr: startIdx + index + 1,
//     name: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.name}
//       </span>
//     ),
//     email: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.email}
//       </span>
//     ),
//     mobile: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.mobile}
//       </span>
//     ),
//     aadhar: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.aadhar && agency.aadhar !== "—" ? `${agency.aadhar.slice(0, 4)} **** ****` : agency.aadhar}
//       </span>
//     ),

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           agency.status === "active" ? styles.active : styles.inactive
//         }`}
//         onClick={() => toggleStatus(agency.id)}
//       >
//         {agency.status}
//       </button>
//     ),

//     reviewStatus:
//       agency.reviewStatus === "pending" ? (
//         openReviewId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               disabled={reviewLoadingId === agency.id}
//               onClick={() =>
//                 updateReviewStatus(agency.id, "accepted")
//               }
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               disabled={reviewLoadingId === agency.id}
//               onClick={() =>
//                 updateReviewStatus(agency.id, "rejected")
//               }
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenReviewId(agency.id)}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.reviewStatus === "accepted"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.reviewStatus}
//         </span>
//       ),

//     verified: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.verified ? (
//           <span className={styles.green}>Verified</span>
//         ) : (
//           <span className={styles.red}>Not Verified</span>
//         )}
//       </span>
//     ),

//     kycStatus:
//       agency.kycStatus === "pending" ? (
//         openKycId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               onClick={() =>
//                 updateKycStatus(agency.id, "approved")
//               }
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               onClick={() =>
//                 updateKycStatus(agency.id, "rejected")
//               }
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenKycId(agency.id)}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.kycStatus === "approved"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.kycStatus}
//         </span>
//       ),

//     isActive: (
//       <span 
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.isActive ? "Yes" : "No"}
//       </span>
//     ),


//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//         title="View agency info"
//       >
//         {agency.image ? (
//           <img src={agency.image} alt="Agency" />
//         ) : (
//           <FaUserCircle size={26} />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Agency List</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search Agencies..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <DynamicTable
//           headings={headings}
//           columnData={columnData}
//           noDataMessage={loading ? "Loading..." : "No agencies found"}
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

// export default AgencyList;








// import React, { useEffect, useState } from "react";
// import styles from "./AgencyList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getAgencyUsers } from "../../../services/usersService";
// import { reviewAgencyRegistration } from "../../../services/adminReviewService";
// import { showCustomToast } from "../../../components/CustomToast/CustomToast";

// /* =====================================================
//    Helper: Build Full Name safely
// ===================================================== */
// const getFullName = (firstName, lastName) => {
//   const f = firstName?.trim() || "";
//   const l = lastName?.trim() || "";
//   const full = `${f} ${l}`.trim();
//   return full || "—";
// };

// const AgencyList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [openReviewId, setOpenReviewId] = useState(null);
//   const [openKycId, setOpenKycId] = useState(null);
//   const [reviewLoadingId, setReviewLoadingId] = useState(null);

//   /* =====================================================
//      FETCH AGENCIES
//   ===================================================== */
//   useEffect(() => {
//     const fetchAgencies = async () => {
//       try {
//         setLoading(true);
//         const data = await getAgencyUsers();

//         setAgencies(
//           data.map((a) => ({
//             id: a._id,

//             /* ✅ AGENCY NAME = FIRST + LAST ONLY */
//             name: getFullName(a.firstName, a.lastName),

//             email: a.email || "—",
//             mobile: a.mobileNumber || "—",
//             aadhar: a.aadharOrPanNum || "—",
//             status: a.status || "inactive",
//             reviewStatus: a.reviewStatus || "pending",
//             kycStatus: a.kycStatus || "pending",
//             verified: Boolean(a.isVerified),
//             isActive: Boolean(a.isActive),
//             balance: a.balance || 0,
//             walletBalance: a.walletBalance || 0,
//             coinBalance: a.coinBalance || 0,
//             image: a.image || null,
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to fetch agencies", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgencies();
//   }, []);

//   /* =====================================================
//      STATUS TOGGLE (UI ONLY)
//   ===================================================== */
//   const toggleStatus = (id) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: a.status === "active" ? "inactive" : "active" }
//           : a
//       )
//     );
//   };

//   /* =====================================================
//      REVIEW STATUS (API)
//   ===================================================== */
//   const updateReviewStatus = async (id, status) => {
//     try {
//       setReviewLoadingId(id);

//       await reviewAgencyRegistration({
//         userId: id,
//         reviewStatus: status,
//       });

//       setAgencies((prev) =>
//         prev.map((a) =>
//           a.id === id ? { ...a, reviewStatus: status } : a
//         )
//       );

//       showCustomToast(
//         "success",
//         `Review ${status === "accepted" ? "approved" : "rejected"}`
//       );
//     } catch {
//       showCustomToast("error", "Failed to update review status");
//     } finally {
//       setReviewLoadingId(null);
//       setOpenReviewId(null);
//     }
//   };

//   /* =====================================================
//      KYC STATUS (UI ONLY)
//   ===================================================== */
//   const updateKycStatus = (id, status) => {
//     setAgencies((prev) =>
//       prev.map((a) =>
//         a.id === id ? { ...a, kycStatus: status } : a
//       )
//     );
//     setOpenKycId(null);
//   };

//   /* =====================================================
//      SEARCH + PAGINATION
//   ===================================================== */
//   const filtered = agencies.filter((a) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       a.name.toLowerCase().includes(term) ||
//       a.email.toLowerCase().includes(term) ||
//       a.mobile.includes(term) ||
//       a.aadhar.includes(term)
//     );
//   });

//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   /* =====================================================
//      TABLE HEADINGS
//   ===================================================== */
//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Agency Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Aadhaar", accessor: "aadhar" },
//     { title: "Status", accessor: "status" },
//     { title: "Review Status", accessor: "reviewStatus" },
//     { title: "Verified", accessor: "verified" },
//     { title: "KYC Status", accessor: "kycStatus" },
//     { title: "Is Active", accessor: "isActive" },
//     { title: "Info", accessor: "info" },
//   ];

//   /* =====================================================
//      TABLE DATA
//   ===================================================== */
//   const columnData = currentData.map((agency, index) => ({
//     sr: startIdx + index + 1,

//     name: (
//       <span
//         className={styles.clickableCell}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//       >
//         {agency.name}
//       </span>
//     ),

//     email: agency.email,
//     mobile: agency.mobile,

//     aadhar:
//       agency.aadhar !== "—"
//         ? `${agency.aadhar.slice(0, 4)} **** ****`
//         : "—",

//     status: (
//       <button
//         className={`${styles.statusButton} ${
//           agency.status === "active" ? styles.active : styles.inactive
//         }`}
//         onClick={() => toggleStatus(agency.id)}
//       >
//         {agency.status}
//       </button>
//     ),

//     reviewStatus:
//       agency.reviewStatus === "pending" ? (
//         openReviewId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               disabled={reviewLoadingId === agency.id}
//               onClick={() =>
//                 updateReviewStatus(agency.id, "accepted")
//               }
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               disabled={reviewLoadingId === agency.id}
//               onClick={() =>
//                 updateReviewStatus(agency.id, "rejected")
//               }
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenReviewId(agency.id)}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.reviewStatus === "accepted"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.reviewStatus}
//         </span>
//       ),

//     verified: agency.verified ? (
//       <span className={styles.green}>Verified</span>
//     ) : (
//       <span className={styles.red}>Not Verified</span>
//     ),

//     kycStatus:
//       agency.kycStatus === "pending" ? (
//         openKycId === agency.id ? (
//           <div className={styles.reviewActions}>
//             <button
//               className={styles.approveBtn}
//               onClick={() =>
//                 updateKycStatus(agency.id, "approved")
//               }
//             >
//               ✔
//             </button>
//             <button
//               className={styles.rejectBtn}
//               onClick={() =>
//                 updateKycStatus(agency.id, "rejected")
//               }
//             >
//               ✖
//             </button>
//           </div>
//         ) : (
//           <span
//             className={styles.orange}
//             onClick={() => setOpenKycId(agency.id)}
//           >
//             Pending
//           </span>
//         )
//       ) : (
//         <span
//           className={
//             agency.kycStatus === "approved"
//               ? styles.green
//               : styles.red
//           }
//         >
//           {agency.kycStatus}
//         </span>
//       ),

//     isActive: agency.isActive ? "Yes" : "No",

//     info: (
//       <span
//         className={`${styles.infoIcon} ${styles.clickableCell}`}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//       >
//         {agency.image ? (
//           <img src={agency.image} alt="Agency" />
//         ) : (
//           <FaUserCircle size={26} />
//         )}
//       </span>
//     ),
//   }));

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Agency List</h2>

//       <div className={styles.tableCard}>
//         <div className={styles.searchWrapper}>
//           <SearchBar
//             placeholder="Search Agencies..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <DynamicTable
//           headings={headings}
//           columnData={columnData}
//           noDataMessage={loading ? "Loading..." : "No agencies found"}
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

// export default AgencyList;









import React, { useEffect, useState } from "react";
import styles from "./AgencyList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAgencyUsers, deleteUser, toggleUserStatus } from "../../../services/usersService";
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

  /* =====================================================
     FETCH AGENCIES
  ===================================================== */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAgencyUsers();
        setAgencies(
          (data || []).map((a) => ({
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
            identity: a.identity || "not upload",
          }))
        );
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
    const validStatus = newStatus === "active" ? "active" : "inactive";
    
    // Log for debugging
    console.log("Toggling agency status:", { validUserId, validUserType, validStatus });
    
    try {
      const updated = await toggleUserStatus({
        userType: validUserType,
        userId: validUserId,
        status: validStatus
      });
      
      setAgencies((prev) =>
        prev.map((a) =>
          a.id === agency.id
            ? { ...a, status: validStatus }
            : a
        )
      );
      
      showCustomToast("success", `Agency status updated to ${validStatus}`);
      console.log("Agency status updated successfully:", updated);
    } catch (error) {
      console.error("Error updating agency status:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
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
    { title: "Identity", accessor: "identity" },
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

    aadhar: a.aadhar !== "—" ? `${a.aadhar.slice(0, 4)} **** ****` : "—",

    identity: (
      <span className={styles.identityBadge}>
        {a.identity || "not upload"}
      </span>
    ),

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

    verified: a.verified ? (
      <span className={styles.verifiedApproved}>Approved</span>
    ) : (
      <span className={styles.verifiedPending}>Waiting</span>
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
        className={`${styles.statusButton} ${
          a.status === "active" ? styles.active : styles.inactive
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
      <h2 className={styles.heading}>Agency List</h2>
      
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
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Agencies..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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