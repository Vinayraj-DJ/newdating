
import React, { useState, useEffect } from 'react';
import { payoutService } from '../../services/payoutService';
import { showCustomToast } from '../../components/CustomToast/CustomToast';
import DynamicTable from '../../components/DynamicTable/DynamicTable';
import PaginationTable from '../../components/PaginationTable/PaginationTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './PayoutList.module.css';

const CACHE_KEY = "admin_payouts_list";

const PayoutList = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [openReviewId, setOpenReviewId] = useState(null);

  // ✅ Fetch withdrawals
  const fetchPayouts = async () => {
    setLoading(true);
    setError(null);
    let active = true;

    // 1. Try to load from cache first
    const cached = sessionStorage.getItem(CACHE_KEY);
    let hasCache = false;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPayouts(parsed);
          setLastUpdated(new Date()); // approximates
          setLoading(false);
          hasCache = true;
        }
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    if (!hasCache) {
      setLoading(true);
    }

    // 2. Fetch fresh data
    try {
      const response = await payoutService.getAllPayouts();

      // ✅ FIX: correct response handling
      const payoutData = response?.data?.data || [];

      setPayouts(payoutData);
      setLastUpdated(new Date());

      // Update cache
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(payoutData));
      } catch (e) { }

      if (!hasCache) {
        showCustomToast(`Loaded ${payoutData.length} withdrawal requests`);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to fetch withdrawal requests';
      if (!hasCache) {
        setError(msg);
        showCustomToast(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      await payoutService.approvePayout(id);
      showCustomToast('Withdrawal approved successfully');
      setOpenReviewId(null);
      // We need to re-fetch to get updated status from server and update cache
      // Ideally we would optimistically update, but status changes are sensitive
      fetchPayouts();
    } catch (err) {
      showCustomToast(
        err.response?.data?.message || 'Failed to approve withdrawal'
      );
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    try {
      await payoutService.rejectPayout(id);
      showCustomToast('Withdrawal rejected successfully');
      setOpenReviewId(null);
      fetchPayouts();
    } catch (err) {
      showCustomToast(
        err.response?.data?.message || 'Failed to reject withdrawal'
      );
    }
  };

  // ✅ Filters
  const filteredPayouts = payouts.filter((payout) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !search ||
      payout.userType?.toLowerCase().includes(search) ||
      payout.userDetails?.email?.toLowerCase().includes(search) ||
      payout.coinsRequested?.toString().includes(search) ||
      payout.amountInRupees?.toString().includes(search);

    const matchesStatus =
      statusFilter === 'all' || payout.status === statusFilter;

    const matchesUserType =
      userTypeFilter === 'all' || payout.userType === userTypeFilter;

    return matchesSearch && matchesStatus && matchesUserType;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = filteredPayouts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userTypeFilter]);

  const tableHeaders = [
    { title: 'User Type', accessor: 'userType' },
    { title: 'User Email', accessor: 'userEmail' },
    { title: 'Coins Requested', accessor: 'coinsRequested' },
    { title: 'Amount (₹)', accessor: 'amountInRupees' },
    { title: 'Payout Method', accessor: 'payoutMethod' },
    { title: 'Account Holder', accessor: 'accountHolder' },
    { title: 'Account Number', accessor: 'accountNumber' },
    { title: 'IFSC Code', accessor: 'ifscCode' },
    { title: 'Actions', accessor: 'actions' },
  ];

  const tableData = paginatedPayouts.map((payout) => ({
    userType: payout.userType || '-',
    userEmail: payout.userDetails?.email || '-',
    coinsRequested: payout.coinsRequested || '-',
    amountInRupees: `₹${payout.amountInRupees || 0}`,
    payoutMethod: payout.payoutMethod || '-',
    accountHolder: payout.payoutDetails?.accountHolderName || '-',
    accountNumber: payout.payoutDetails?.accountNumber || '-',
    ifscCode: payout.payoutDetails?.ifsc || '-',
    actions:
      payout.status === 'pending' ? (
        openReviewId === payout._id ? (
          <div className={styles['review-actions']}>
            <button
              className={styles['approve-btn']}
              onClick={() => handleApprove(payout._id)}
            >
              ✔
            </button>
            <button
              className={styles['reject-btn']}
              onClick={() => handleReject(payout._id)}
            >
              ✖
            </button>
          </div>
        ) : (
          <span
            className={styles['pending-status']}
            onClick={() => setOpenReviewId(payout._id)}
          >
            Pending
          </span>
        )
      ) : (
        <span
          className={
            payout.status === 'approved'
              ? styles['approved-status']
              : styles['rejected-status']
          }
        >
          {payout.status}
        </span>
      ),
  }));

  const pendingCount = payouts.filter(p => p.status === 'pending').length;
  const approvedCount = payouts.filter(p => p.status === 'approved').length;
  const rejectedCount = payouts.filter(p => p.status === 'rejected').length;
  const totalAmount = payouts.reduce(
    (sum, p) => sum + (p.amountInRupees || 0),
    0
  );

  return (
    <div className={styles['payout-list-container']}>
      <div className={styles['page-header']}>
        <h1>Admin Withdrawal Management</h1>
      </div>

      {/* Summary */}
      <div className={styles['summary-section']}>
        <div className={styles['summary-cards']}>
          <div className={styles['summary-card']}>
            <h3>Total Requests</h3>
            <p className={styles['summary-value']}>{payouts.length}</p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Pending</h3>
            <p className={`${styles['summary-value']} ${styles['pending']}`}>
              {pendingCount}
            </p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Approved</h3>
            <p className={`${styles['summary-value']} ${styles['approved']}`}>
              {approvedCount}
            </p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Rejected</h3>
            <p className={`${styles['summary-value']} ${styles['rejected']}`}>
              {rejectedCount}
            </p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Total Amount (₹)</h3>
            <p className={styles['summary-value']}>
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles['card-header']}>
          <h2>Withdrawal Requests</h2>

          <div className={styles['header-actions']}>
            <select
              className={styles['filter-select']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className={styles['filter-select']}
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="agency">Agency</option>
              <option value="female">Female</option>
            </select>

            <SearchBar
              placeholder="Search withdrawals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles['card-body']}>
          {loading ? (
            <DynamicTable loading={true} />
          ) : error ? (
            <div className={styles['error-state']}>{error}</div>
          ) : (
            <>
              <DynamicTable
                headings={tableHeaders}
                columnData={tableData}
              />
              <PaginationTable
                data={filteredPayouts}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutList;
