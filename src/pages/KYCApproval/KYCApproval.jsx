import React, { useState, useEffect } from "react";
import styles from "./KYCApproval.module.css";
import { getPendingKYCs, reviewKYC } from "../../services/kycService";
import { showCustomToast } from "../../components/CustomToast/CustomToast";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import SearchBar from "../../components/SearchBar/SearchBar";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import TableControls from "../../components/TableControls/TableControls";

const KYCApproval = () => {
  const [femaleKYCs, setFemaleKYCs] = useState([]);
  const [agencyKYCs, setAgencyKYCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState({});
  const [femaleSearchTerm, setFemaleSearchTerm] = useState("");
  const [agencySearchTerm, setAgencySearchTerm] = useState("");
  
  // Pagination state
  const [femaleCurrentPage, setFemaleCurrentPage] = useState(1);
  const [agencyCurrentPage, setAgencyCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Smaller page size for document review

  // Load pending KYCs
  useEffect(() => {
    loadPendingKYCs();
  }, []);

  const loadPendingKYCs = async () => {
    try {
      setLoading(true);
      const data = await getPendingKYCs();
      
      setFemaleKYCs(data.female || []);
      setAgencyKYCs(data.agency || []);
    } catch (error) {
      showCustomToast("error", error.message || "Failed to load pending KYCs");
    } finally {
      setLoading(false);
    }
  };

  const handleKYCAction = async (kycId, status, kycType) => {
    try {
      setSavingIds(prev => ({ ...prev, [`${kycId}-${status}`]: true }));
      
      await reviewKYC({ kycId, status, kycType });
      
      // Update the local state to remove the processed KYC
      if (kycType === "female") {
        setFemaleKYCs(prev => prev.filter(kyc => kyc._id !== kycId));
      } else if (kycType === "agency") {
        setAgencyKYCs(prev => prev.filter(kyc => kyc._id !== kycId));
      }
      
      showCustomToast("success", `KYC ${status} successfully`);
    } catch (error) {
      showCustomToast("error", error.message || `Failed to ${status} KYC`);
    } finally {
      setSavingIds(prev => ({ ...prev, [`${kycId}-${status}`]: false }));
    }
  };

  // Female KYCs table
  const femaleHeadings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Identity Document", accessor: "identity" },
    { title: "KYC Document", accessor: "kycDocument" },
    { title: "Actions", accessor: "actions" },
  ];

  const filteredFemaleKYCs = femaleKYCs.filter(kyc =>
    kyc.name?.toLowerCase().includes(femaleSearchTerm.toLowerCase()) ||
    kyc.email?.toLowerCase().includes(femaleSearchTerm.toLowerCase()) ||
    kyc.mobileNumber?.includes(femaleSearchTerm)
  );
  
  // Calculate pagination for female KYCs
  const femaleStartIdx = (femaleCurrentPage - 1) * itemsPerPage;
  const femaleCurrentData = filteredFemaleKYCs.slice(femaleStartIdx, femaleStartIdx + itemsPerPage);

  const femaleColumnData = femaleCurrentData.map((kyc, index) => ({
    sr: femaleStartIdx + index + 1,
    sr: index + 1,
    name: (
      <div className={styles.userInfo}>
        <UserAvatar src={kyc.images?.[0]?.imageUrl || kyc.image || null} />
        <span>{kyc.name || `${kyc.firstName || ""} ${kyc.lastName || ""}`.trim() || "—"}</span>
      </div>
    ),
    email: kyc.email || "—",
    mobile: kyc.mobileNumber || "—",
    identity: kyc.identity ? (
      <a 
        href={kyc.identity} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.documentLink}
      >
        View Identity
      </a>
    ) : (
      "—"
    ),
    kycDocument: kyc.kycDocument ? (
      <a 
        href={kyc.kycDocument} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.documentLink}
      >
        View KYC
      </a>
    ) : (
      "—"
    ),
    actions: (
      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} ${styles.approveButton}`}
          onClick={() => handleKYCAction(kyc._id, "approved", "female")}
          disabled={savingIds[`${kyc._id}-approved`]}
        >
          {savingIds[`${kyc._id}-approved`] ? "Approving..." : "Approve"}
        </button>
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={() => handleKYCAction(kyc._id, "rejected", "female")}
          disabled={savingIds[`${kyc._id}-rejected`]}
        >
          {savingIds[`${kyc._id}-rejected`] ? "Rejecting..." : "Reject"}
        </button>
      </div>
    ),
  }));

  // Agency KYCs table
  const agencyHeadings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Agency Name", accessor: "name" },
    { title: "Email", accessor: "email" },
    { title: "Mobile", accessor: "mobile" },
    { title: "Aadhaar/PAN", accessor: "aadhaar" },
    { title: "Identity Document", accessor: "identity" },
    { title: "KYC Document", accessor: "kycDocument" },
    { title: "Actions", accessor: "actions" },
  ];

  const filteredAgencyKYCs = agencyKYCs.filter(kyc =>
    kyc.name?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
    kyc.email?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
    kyc.mobileNumber?.includes(agencySearchTerm) ||
    kyc.aadharOrPanNum?.includes(agencySearchTerm)
  );
  
  // Calculate pagination for agency KYCs
  const agencyStartIdx = (agencyCurrentPage - 1) * itemsPerPage;
  const agencyCurrentData = filteredAgencyKYCs.slice(agencyStartIdx, agencyStartIdx + itemsPerPage);

  const agencyColumnData = agencyCurrentData.map((kyc, index) => ({
    sr: agencyStartIdx + index + 1,
    sr: index + 1,
    name: (
      <div className={styles.userInfo}>
        <UserAvatar src={kyc.image || null} />
        <span>{kyc.name || `${kyc.firstName || ""} ${kyc.lastName || ""}`.trim() || "—"}</span>
      </div>
    ),
    email: kyc.email || "—",
    mobile: kyc.mobileNumber || "—",
    aadhaar: kyc.aadharOrPanNum || "—",
    identity: kyc.identity ? (
      <a 
        href={kyc.identity} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.documentLink}
      >
        View Identity
      </a>
    ) : (
      "—"
    ),
    kycDocument: kyc.kycDocument ? (
      <a 
        href={kyc.kycDocument} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.documentLink}
      >
        View KYC
      </a>
    ) : (
      "—"
    ),
    actions: (
      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} ${styles.approveButton}`}
          onClick={() => handleKYCAction(kyc._id, "approved", "agency")}
          disabled={savingIds[`${kyc._id}-approved`]}
        >
          {savingIds[`${kyc._id}-approved`] ? "Approving..." : "Approve"}
        </button>
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={() => handleKYCAction(kyc._id, "rejected", "agency")}
          disabled={savingIds[`${kyc._id}-rejected`]}
        >
          {savingIds[`${kyc._id}-rejected`] ? "Rejecting..." : "Reject"}
        </button>
      </div>
    ),
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>KYC Approval Management</h2>

      {/* Female KYCs Section */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Female KYCs</h3>
          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="Search female KYCs..."
              onChange={(e) => {
                setFemaleSearchTerm(e.target.value);
                setFemaleCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
        </div>
        
        <div className={styles.tableCard}>
          <DynamicTable
            headings={femaleHeadings}
            columnData={femaleColumnData}
            noDataMessage={loading ? "Loading..." : "No pending female KYCs"}
          />
          {filteredFemaleKYCs.length > 0 && (
            <div className={styles.paginationSection}>
              <PaginationTable
                data={filteredFemaleKYCs}
                currentPage={femaleCurrentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setFemaleCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
              <TableControls
                currentPage={femaleCurrentPage}
                totalPages={Math.ceil(filteredFemaleKYCs.length / itemsPerPage)}
                onPageChange={setFemaleCurrentPage}
                totalItems={filteredFemaleKYCs.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Agency KYCs Section */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Agency KYCs</h3>
          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="Search agency KYCs..."
              onChange={(e) => {
                setAgencySearchTerm(e.target.value);
                setAgencyCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
        </div>
        
        <div className={styles.tableCard}>
          <DynamicTable
            headings={agencyHeadings}
            columnData={agencyColumnData}
            noDataMessage={loading ? "Loading..." : "No pending agency KYCs"}
          />
          {filteredAgencyKYCs.length > 0 && (
            <div className={styles.paginationSection}>
              <PaginationTable
                data={filteredAgencyKYCs}
                currentPage={agencyCurrentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setAgencyCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
              <TableControls
                currentPage={agencyCurrentPage}
                totalPages={Math.ceil(filteredAgencyKYCs.length / itemsPerPage)}
                onPageChange={setAgencyCurrentPage}
                totalItems={filteredAgencyKYCs.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCApproval;