
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























import React, { useEffect, useState } from "react";
import styles from "./AgencyList.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DynamicTable from "../../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../../components/PaginationTable/PaginationTable";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAgencyUsers } from "../../../services/usersService";
import { reviewAgencyRegistration } from "../../../services/adminReviewService";
import { showCustomToast } from "../../../components/CustomToast/CustomToast";

const AgencyList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openReviewId, setOpenReviewId] = useState(null);
  const [openKycId, setOpenKycId] = useState(null);
  const [reviewLoadingId, setReviewLoadingId] = useState(null);

  /* -------- FETCH AGENCIES -------- */
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const data = await getAgencyUsers();

        setAgencies(
          data.map((a) => ({
            id: a._id,
            name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
            email: a.email,
            mobile: a.mobileNumber,
            aadhar: a.aadharNumber || "—",
            status: a.status,
            reviewStatus: a.reviewStatus || "pending",
            kycStatus: a.kycStatus || "pending",
            verified: a.isVerified,
            image: a.image,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch agencies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  /* -------- STATUS TOGGLE (UNCHANGED) -------- */
  const toggleStatus = (id) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "inactive" : "active" }
          : a
      )
    );
  };

  /* -------- REVIEW STATUS (API INTEGRATED) -------- */
  const updateReviewStatus = async (id, status) => {
    try {
      setReviewLoadingId(id);

      await reviewAgencyRegistration({
        userId: id,
        reviewStatus: status,
      });

      setAgencies((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, reviewStatus: status } : a
        )
      );

      showCustomToast(
        "success",
        `Review ${status === "accepted" ? "approved" : "rejected"}`
      );
    } catch (err) {
      showCustomToast("error", "Failed to update review status");
    } finally {
      setReviewLoadingId(null);
      setOpenReviewId(null);
    }
  };

  /* -------- KYC ACTION (UNCHANGED) -------- */
  const updateKycStatus = (id, status) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, kycStatus: status } : a
      )
    );
    setOpenKycId(null);
  };

  /* -------- SEARCH -------- */
  const filtered = agencies.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.mobile.includes(term) ||
      a.aadhar.includes(term)
    );
  });

  /* -------- PAGINATION -------- */
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

  /* -------- TABLE HEADINGS (UNCHANGED) -------- */
  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Agency Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Aadhaar", accessor: "aadhar" },
    { title: "Status", accessor: "status" },
    { title: "Review Status", accessor: "reviewStatus" },
    { title: "Verified", accessor: "verified" },
    { title: "KYC Status", accessor: "kycStatus" },
    { title: "Is Active", accessor: "isActive" },
    { title: "Info", accessor: "info" },
  ];

  /* -------- TABLE DATA -------- */
  const columnData = currentData.map((agency, index) => ({
    sr: startIdx + index + 1,
    name: agency.name,
    email: agency.email,
    mobile: agency.mobile,
    aadhar: agency.aadhar,

    status: (
      <button
        className={`${styles.statusButton} ${
          agency.status === "active" ? styles.active : styles.inactive
        }`}
        onClick={() => toggleStatus(agency.id)}
      >
        {agency.status}
      </button>
    ),

    reviewStatus:
      agency.reviewStatus === "pending" ? (
        openReviewId === agency.id ? (
          <div className={styles.reviewActions}>
            <button
              className={styles.approveBtn}
              disabled={reviewLoadingId === agency.id}
              onClick={() =>
                updateReviewStatus(agency.id, "accepted")
              }
            >
              ✔
            </button>
            <button
              className={styles.rejectBtn}
              disabled={reviewLoadingId === agency.id}
              onClick={() =>
                updateReviewStatus(agency.id, "rejected")
              }
            >
              ✖
            </button>
          </div>
        ) : (
          <span
            className={styles.orange}
            onClick={() => setOpenReviewId(agency.id)}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            agency.reviewStatus === "accepted"
              ? styles.green
              : styles.red
          }
        >
          {agency.reviewStatus}
        </span>
      ),

    verified: agency.verified ? (
      <span className={styles.green}>Verified</span>
    ) : (
      <span className={styles.red}>Not Verified</span>
    ),

    kycStatus:
      agency.kycStatus === "pending" ? (
        openKycId === agency.id ? (
          <div className={styles.reviewActions}>
            <button
              className={styles.approveBtn}
              onClick={() =>
                updateKycStatus(agency.id, "approved")
              }
            >
              ✔
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() =>
                updateKycStatus(agency.id, "rejected")
              }
            >
              ✖
            </button>
          </div>
        ) : (
          <span
            className={styles.orange}
            onClick={() => setOpenKycId(agency.id)}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            agency.kycStatus === "approved"
              ? styles.green
              : styles.red
          }
        >
          {agency.kycStatus}
        </span>
      ),

    isActive:
      agency.status === "active" ? (
        <span className={styles.green}>Yes</span>
      ) : (
        <span className={styles.red}>No</span>
      ),

    info: (
      <span
        className={styles.infoIcon}
        onClick={() => navigate(`/agency-info/${agency.id}`)}
      >
        {agency.image ? (
          <img src={agency.image} alt="Agency" />
        ) : (
          <FaUserCircle size={26} />
        )}
      </span>
    ),
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Agency List</h2>

      <div className={styles.tableCard}>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Agencies..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DynamicTable
          headings={headings}
          columnData={columnData}
          noDataMessage={loading ? "Loading..." : "No agencies found"}
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

export default AgencyList;
