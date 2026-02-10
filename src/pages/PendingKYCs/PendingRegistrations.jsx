import React, { useState, useEffect } from "react";
import { getPendingRegistrations, reviewRegistration } from "../../services/pendingRegistrationsService";
import { showCustomToast } from "../../components/CustomToast/CustomToast";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SearchBar from "../../components/SearchBar/SearchBar";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./PendingRegistrations.module.css";

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

const PendingRegistrations = () => {
  const navigate = useNavigate();
  const [females, setFemales] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState({});
  const [femaleSearchTerm, setFemaleSearchTerm] = useState("");
  const [agencySearchTerm, setAgencySearchTerm] = useState("");

  // Pagination state
  const [femaleCurrentPage, setFemaleCurrentPage] = useState(1);
  const [agencyCurrentPage, setAgencyCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Rejection modal state
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionData, setRejectionData] = useState({ userId: "", userType: "", userName: "" });
  const [rejectionReason, setRejectionReason] = useState("");

  // Load pending registrations
  useEffect(() => {
    loadPendingRegistrations();
  }, []);

  const loadPendingRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getPendingRegistrations();

      setFemales(Array.isArray(data.females) ? [...data.females].reverse() : []);
      setAgencies(Array.isArray(data.agencies) ? [...data.agencies].reverse() : []);
    } catch (error) {
      showCustomToast("error", error.message || "Failed to load pending registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (userId, userType, reviewStatus, userName = "") => {
    try {
      // If rejecting, show modal to get reason
      if (reviewStatus === "rejected") {
        setRejectionData({ userId, userType, userName });
        setShowRejectionModal(true);
        return;
      }

      setSavingIds(prev => ({ ...prev, [`${userId}-${reviewStatus}`]: true }));

      await reviewRegistration({ userId, userType, reviewStatus });

      // Update the local state to remove the processed registration
      if (userType === "female") {
        setFemales(prev => prev.filter(user => user._id !== userId));
      } else if (userType === "agency") {
        setAgencies(prev => prev.filter(user => user._id !== userId));
      }

      showCustomToast("success", `Registration ${reviewStatus} successfully`);
    } catch (error) {
      showCustomToast("error", error.message || `Failed to ${reviewStatus} registration`);
    } finally {
      setSavingIds(prev => ({ ...prev, [`${userId}-${reviewStatus}`]: false }));
    }
  };

  const handleRejectionConfirm = async () => {
    if (!rejectionReason.trim()) {
      showCustomToast("error", "Please provide a rejection reason");
      return;
    }

    try {
      setSavingIds(prev => ({ ...prev, [`${rejectionData.userId}-rejected`]: true }));

      await reviewRegistration({
        userId: rejectionData.userId,
        userType: rejectionData.userType,
        reviewStatus: "rejected",
        rejectionReason
      });

      // Update the local state to remove the processed registration
      if (rejectionData.userType === "female") {
        setFemales(prev => prev.filter(user => user._id !== rejectionData.userId));
      } else if (rejectionData.userType === "agency") {
        setAgencies(prev => prev.filter(user => user._id !== rejectionData.userId));
      }

      showCustomToast("success", `Registration rejected for ${rejectionData.userName}`);
      setShowRejectionModal(false);
      setRejectionReason("");
    } catch (error) {
      showCustomToast("error", error.message || "Failed to reject registration");
    } finally {
      setSavingIds(prev => ({ ...prev, [`${rejectionData.userId}-rejected`]: false }));
    }
  };

  const handleRejectionCancel = () => {
    setShowRejectionModal(false);
    setRejectionReason("");
    setRejectionData({ userId: "", userType: "", userName: "" });
  };

  // Female registrations table
  const femaleHeadings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Age", accessor: "age" },
    { title: "Bio", accessor: "bio" },
    { title: "Created At", accessor: "createdAt" },
    { title: "Info", accessor: "info" },
    { title: "Actions", accessor: "actions" },
  ];

  const filteredFemales = females.filter(user =>
    user.name?.toLowerCase().includes(femaleSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(femaleSearchTerm.toLowerCase()) ||
    user.mobileNumber?.includes(femaleSearchTerm)
  );

  // Calculate pagination for females
  const femaleStartIdx = (femaleCurrentPage - 1) * itemsPerPage;
  const femaleCurrentData = filteredFemales.slice(femaleStartIdx, femaleStartIdx + itemsPerPage);

  const femaleColumnData = femaleCurrentData.map((user, index) => ({
    sr: femaleStartIdx + index + 1,
    name: user.name || "—",
    email: user.email || "—",
    mobile: user.mobileNumber || "—",
    age: user.age || "—",
    bio: user.bio || "—",
    createdAt: new Date(user.createdAt).toLocaleDateString() || "—",
    info: (
      <div
        className={styles.infoClickable}
        onClick={() => navigate(`/user-info/female/${user._id}`)}
        title={user.images?.length > 0 ? "View user profile" : "No profile image"}
      >
        <UserAvatar src={user.images?.[0] || ""} />
      </div>
    ),
    actions: (
      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} ${styles.approveButton}`}
          onClick={() => handleReviewAction(user._id, "female", "accepted")}
          disabled={savingIds[`${user._id}-accepted`]}
        >
          {savingIds[`${user._id}-accepted`] ? "Approving..." : "Approve"}
        </button>
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={() => handleReviewAction(user._id, "female", "rejected", user.name)}
          disabled={savingIds[`${user._id}-rejected`]}
        >
          {savingIds[`${user._id}-rejected`] ? "Rejecting..." : "Reject"}
        </button>
      </div>
    ),
  }));

  // Agency registrations table
  const agencyHeadings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Created At", accessor: "createdAt" },
    { title: "Info", accessor: "info" },
    { title: "Actions", accessor: "actions" },
  ];

  const filteredAgencies = agencies.filter(user =>
    user.firstName?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
    user.mobileNumber?.includes(agencySearchTerm)
  );

  // Calculate pagination for agencies
  const agencyStartIdx = (agencyCurrentPage - 1) * itemsPerPage;
  const agencyCurrentData = filteredAgencies.slice(agencyStartIdx, agencyStartIdx + itemsPerPage);

  const agencyColumnData = agencyCurrentData.map((user, index) => ({
    sr: agencyStartIdx + index + 1,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—",
    email: user.email || "—",
    mobile: user.mobileNumber || "—",
    createdAt: new Date(user.createdAt).toLocaleDateString() || "—",
    info: (
      <div
        className={styles.infoClickable}
        onClick={() => navigate(`/user-info/agency/${user._id}`)}
        title={user.images?.length > 0 ? "View agency profile" : "No profile image"}
      >
        <UserAvatar src={user.images?.[0] || ""} />
      </div>
    ),
    actions: (
      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} ${styles.approveButton}`}
          onClick={() => handleReviewAction(user._id, "agency", "accepted")}
          disabled={savingIds[`${user._id}-accepted`]}
        >
          {savingIds[`${user._id}-accepted`] ? "Approving..." : "Approve"}
        </button>
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={() => handleReviewAction(user._id, "agency", "rejected", `${user.firstName} ${user.lastName}`)}
          disabled={savingIds[`${user._id}-rejected`]}
        >
          {savingIds[`${user._id}-rejected`] ? "Rejecting..." : "Reject"}
        </button>
      </div>
    ),
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Pending Registrations</h2>

      {/* Female Registrations Section */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Female Registrations</h3>
          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="Search female registrations..."
              onChange={(e) => {
                setFemaleSearchTerm(e.target.value);
                setFemaleCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className={styles.tableCard}>
          <DynamicTable
            headings={femaleHeadings}
            columnData={femaleColumnData}
            noDataMessage={loading ? "Loading..." : "No pending female registrations"}
          />
          {filteredFemales.length > 0 && (
            <div className={styles.paginationSection}>
              <PaginationTable
                data={filteredFemales}
                currentPage={femaleCurrentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setFemaleCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Agency Registrations Section */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Agency Registrations</h3>
          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="Search agency registrations..."
              onChange={(e) => {
                setAgencySearchTerm(e.target.value);
                setAgencyCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className={styles.tableCard}>
          <DynamicTable
            headings={agencyHeadings}
            columnData={agencyColumnData}
            noDataMessage={loading ? "Loading..." : "No pending agency registrations"}
          />
          {filteredAgencies.length > 0 && (
            <div className={styles.paginationSection}>
              <PaginationTable
                data={filteredAgencies}
                currentPage={agencyCurrentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setAgencyCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      <ConfirmationModal
        isOpen={showRejectionModal}
        onClose={handleRejectionCancel}
        onConfirm={handleRejectionConfirm}
        title="Reject Registration"
        message={`Please provide a reason for rejecting ${rejectionData.userName}'s registration:`}
        confirmText="Reject"
        cancelText="Cancel"
      >
        <div className={styles.rejectionReasonContainer}>
          <textarea
            className={styles.rejectionReasonInput}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
          />
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default PendingRegistrations;