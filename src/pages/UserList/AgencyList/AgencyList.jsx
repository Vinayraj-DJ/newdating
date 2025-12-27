// import React, { useState } from "react";
// import styles from "./AgencyList.module.css";
// import SearchBar from "../../../components/SearchBar/SearchBar";
// import DynamicTable from "../../../components/DynamicTable/DynamicTable";
// import PaginationTable from "../../../components/PaginationTable/PaginationTable";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// /* -------- API BASED STATIC DATA (FROM YOUR RESPONSE) -------- */
// const STATIC_AGENCIES = [
//   // {
//   //   id: "694f8cb408f1917b67eab9f3",
//   //   name: "AgencyTop ag",
//   //   email: "tdeekshith46@gmail.com",
//   //   mobile: "9966338855",
//   //   joinDate: "2025-12-27T07:37:24.222Z",
//   //   active: true,
//   //   subscribed: false,
//   //   plan: "Not Subscribe",
//   //   startDate: null,
//   //   expiryDate: null,
//   //   verified: true,
//   //   image:
//   //     "https://res.cloudinary.com/dqtasamcu/image/upload/v1766821255/admin_uploads/vcpqlrklbqcvy5vqelw3.jpg",
//   // },
//   {
//     id: "694f991badd2151db762264c",
//     name: "AgencyTop agent",
//     email: "agency@gmail.com",
//     mobile: "9999999999",
//     joinDate: "2025-12-27T08:30:19.924Z",
//     active: true,
//     subscribed: false,
//     plan: "Not Subscribe",
//     startDate: null,
//     expiryDate: null,
//     verified: true,
//     image:
//       "https://res.cloudinary.com/dqtasamcu/image/upload/v1766824387/admin_uploads/xmstvdrsmaqeyyzpbdoi.png",
//   },
// ];

// const AgencyList = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [agencies, setAgencies] = useState(STATIC_AGENCIES);
//   const [savingIds, setSavingIds] = useState({});

//   /* -------- STATUS TOGGLE -------- */
//   const handleStatusToggle = (agency) => {
//     setSavingIds((prev) => ({ ...prev, [agency.id]: true }));

//     setTimeout(() => {
//       setAgencies((prev) =>
//         prev.map((a) =>
//           a.id === agency.id ? { ...a, active: !a.active } : a
//         )
//       );

//       setSavingIds((prev) => {
//         const clone = { ...prev };
//         delete clone[agency.id];
//         return clone;
//       });
//     }, 800);
//   };

//   /* -------- SEARCH -------- */
//   const filtered = agencies.filter((a) => {
//     const term = searchTerm.toLowerCase();
//     if (!term) return true;
//     return (
//       a.name.toLowerCase().includes(term) ||
//       a.email.toLowerCase().includes(term) ||
//       a.mobile.includes(term)
//     );
//   });

//   /* -------- PAGINATION -------- */
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Agency Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Join Date", accessor: "joinDate" },
//     { title: "Status", accessor: "status" },
//     { title: "Is Subscribe?", accessor: "subscribed" },
//     { title: "Plan", accessor: "plan" },
//     { title: "Start Date", accessor: "startDate" },
//     { title: "Expiry Date", accessor: "expiryDate" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((agency, index) => ({
//     sr: startIdx + index + 1,
//     name: agency.name,
//     email: agency.email,
//     mobile: agency.mobile,
//     joinDate: new Date(agency.joinDate).toLocaleString(),

//     status: (
//       <button
//         onClick={() => handleStatusToggle(agency)}
//         disabled={!!savingIds[agency.id]}
//         className={`${styles.statusButton} ${
//           agency.active ? styles.active : styles.inactive
//         }`}
//       >
//         {savingIds[agency.id]
//           ? "Updating..."
//           : agency.active
//           ? "Active"
//           : "Inactive"}
//       </button>
//     ),

//     subscribed: (
//       <span
//         className={
//           agency.subscribed ? styles.badgeGreen : styles.badgeRed
//         }
//       >
//         {agency.subscribed ? "Subscribe" : "Not Subscribe"}
//       </span>
//     ),

//     plan: (
//       <span
//         className={
//           agency.plan !== "Not Subscribe"
//             ? styles.badgeGreen
//             : styles.badgeRed
//         }
//       >
//         {agency.plan}
//       </span>
//     ),

//     startDate: agency.startDate
//       ? new Date(agency.startDate).toLocaleString()
//       : "—",

//     expiryDate: agency.expiryDate
//       ? new Date(agency.expiryDate).toLocaleString()
//       : "—",

//     verified: agency.verified ? (
//       <span className={styles.green}>Approved</span>
//     ) : (
//       <span className={styles.red}>Pending</span>
//     ),

//     info: (
//       <span
//         className={styles.infoIcon}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//       >
//         {agency.image ? (
//           <img src={agency.image} alt="Agency" />
//         ) : (
//           <FaUserCircle size={26} color="purple" />
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
//             placeholder="Search agencies..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <DynamicTable
//           headings={headings}
//           columnData={columnData}
//           noDataMessage="No agencies found"
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
//   const [savingIds, setSavingIds] = useState({});
//   const [loading, setLoading] = useState(true);

//   /* -------- FETCH AGENCIES -------- */
//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchAgencies = async () => {
//       try {
//         setLoading(true);
//         const data = await getAgencyUsers({ signal: controller.signal });

//         const mapped = data.map((a) => ({
//           id: a._id,
//           name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
//           email: a.email,
//           mobile: a.mobileNumber,
//           joinDate: a.createdAt,
//           active: a.status === "active",
//           subscribed: false,
//           plan: "Not Subscribe",
//           startDate: null,
//           expiryDate: null,
//           verified: a.isVerified,
//           image: a.image,
//         }));

//         setAgencies(mapped);
//       } catch (err) {
//         console.error("Failed to fetch agencies", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgencies();
//     return () => controller.abort();
//   }, []);

//   /* -------- STATUS TOGGLE (UI ONLY) -------- */
//   const handleStatusToggle = (agency) => {
//     setSavingIds((prev) => ({ ...prev, [agency.id]: true }));

//     setTimeout(() => {
//       setAgencies((prev) =>
//         prev.map((a) =>
//           a.id === agency.id ? { ...a, active: !a.active } : a
//         )
//       );

//       setSavingIds((prev) => {
//         const clone = { ...prev };
//         delete clone[agency.id];
//         return clone;
//       });
//     }, 600);
//   };

//   /* -------- SEARCH -------- */
//   const filtered = agencies.filter((a) => {
//     const term = searchTerm.toLowerCase();
//     if (!term) return true;
//     return (
//       a.name.toLowerCase().includes(term) ||
//       a.email.toLowerCase().includes(term) ||
//       a.mobile.includes(term)
//     );
//   });

//   /* -------- PAGINATION -------- */
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

//   const headings = [
//     { title: "Sr No.", accessor: "sr" },
//     { title: "Agency Name", accessor: "name" },
//     { title: "Email", accessor: "email" },
//     { title: "Mobile", accessor: "mobile" },
//     { title: "Join Date", accessor: "joinDate" },
//     { title: "Status", accessor: "status" },
//     { title: "Is Subscribe?", accessor: "subscribed" },
//     { title: "Plan", accessor: "plan" },
//     { title: "Start Date", accessor: "startDate" },
//     { title: "Expiry Date", accessor: "expiryDate" },
//     { title: "Verification", accessor: "verified" },
//     { title: "Info", accessor: "info" },
//   ];

//   const columnData = currentData.map((agency, index) => ({
//     sr: startIdx + index + 1,
//     name: agency.name,
//     email: agency.email,
//     mobile: agency.mobile,
//     joinDate: new Date(agency.joinDate).toLocaleString(),

//     status: (
//       <button
//         onClick={() => handleStatusToggle(agency)}
//         disabled={!!savingIds[agency.id]}
//         className={`${styles.statusButton} ${
//           agency.active ? styles.active : styles.inactive
//         }`}
//       >
//         {savingIds[agency.id]
//           ? "Updating..."
//           : agency.active
//           ? "Active"
//           : "Inactive"}
//       </button>
//     ),

//     subscribed: (
//       <span
//         className={
//           agency.subscribed ? styles.badgeGreen : styles.badgeRed
//         }
//       >
//         {agency.subscribed ? "Subscribe" : "Not Subscribe"}
//       </span>
//     ),

//     plan: (
//       <span
//         className={
//           agency.plan !== "Not Subscribe"
//             ? styles.badgeGreen
//             : styles.badgeRed
//         }
//       >
//         {agency.plan}
//       </span>
//     ),

//     startDate: "—",
//     expiryDate: "—",

//     verified: agency.verified ? (
//       <span className={styles.green}>Approved</span>
//     ) : (
//       <span className={styles.red}>Pending</span>
//     ),

//     info: (
//       <span
//         className={styles.infoIcon}
//         onClick={() => navigate(`/agency-info/${agency.id}`)}
//       >
//         {agency.image ? (
//           <img src={agency.image} alt="Agency" />
//         ) : (
//           <FaUserCircle size={26} color="purple" />
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
//             placeholder="Search agencies..."
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

const AgencyList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReviewId, setOpenReviewId] = useState(null);

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
            status: a.status, // active / inactive
            reviewStatus: a.reviewStatus, // pending / approved / rejected
            verified: a.isVerified,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
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

  /* -------- STATUS TOGGLE -------- */
  const toggleStatus = (id) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "active" ? "inactive" : "active",
            }
          : a
      )
    );
  };

  /* -------- REVIEW ACTION -------- */
  const updateReviewStatus = (id, status) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, reviewStatus: status } : a
      )
    );
    setOpenReviewId(null);
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

  /* -------- TABLE HEADINGS -------- */
  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "ID", accessor: "id" },
    { title: "Agency Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Aadhaar", accessor: "aadhar" },
    { title: "Status", accessor: "status" },
    { title: "Review Status", accessor: "reviewStatus" },
    { title: "Verified", accessor: "verified" },
    { title: "Created At", accessor: "createdAt" },
    { title: "Updated At", accessor: "updatedAt" },
    { title: "Info", accessor: "info" },
  ];

  /* -------- TABLE DATA -------- */
  const columnData = currentData.map((agency, index) => ({
    sr: startIdx + index + 1,
    id: agency.id,
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
              onClick={() =>
                updateReviewStatus(agency.id, "approved")
              }
            >
              ✔
            </button>
            <button
              className={styles.rejectBtn}
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
            style={{ cursor: "pointer" }}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            agency.reviewStatus === "approved"
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

    createdAt: new Date(agency.createdAt).toLocaleString(),
    updatedAt: new Date(agency.updatedAt).toLocaleString(),

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
        <SearchBar
          placeholder="Search agencies..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
