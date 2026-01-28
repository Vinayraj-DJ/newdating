import React, { useState, useEffect } from 'react';
import { payoutService } from '../../services/payoutService';
import { showCustomToast } from '../../components/CustomToast/CustomToast';
import DynamicTable from '../../components/DynamicTable/DynamicTable';
import PaginationTable from '../../components/PaginationTable/PaginationTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './PayoutList.module.css';

const PayoutList = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [openReviewId, setOpenReviewId] = useState(null);

  // Fetch payouts from API
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await payoutService.getAllPayouts();
      
      // Handle the API response structure
      let payoutData = [];
      
      // Handle Axios full response object
      const responseData = response?.data || response;
      
      console.log('Raw response:', response);
      console.log('Response data:', responseData);
      
      if (responseData && typeof responseData === 'object') {
        // Check if it's the structure you showed: { success: true, data: [...] }
        if (responseData.success === true && Array.isArray(responseData.data)) {
          payoutData = responseData.data;
          console.log('Using success/data structure');
        } 
        // Check if it's direct array
        else if (Array.isArray(responseData)) {
          payoutData = responseData;
          console.log('Using direct array structure');
        }
        // Check if it's nested data array
        else if (Array.isArray(responseData.data)) {
          payoutData = responseData.data;
          console.log('Using nested data array structure');
        }
        else {
          console.log('Unexpected response structure:', responseData);
          setError('Invalid data format received from server');
          payoutData = [];
        }
      } else {
        console.log('Unexpected response structure:', responseData);
        setError('Invalid response from server');
        payoutData = [];
      }
      
      setPayouts(payoutData);
      setTotalPages(Math.ceil((payoutData.length || 0) / itemsPerPage));
      setLastUpdated(new Date());
      
      // Show success message only when manually refreshing
      if (!error) {
        showCustomToast(`Loaded ${payoutData.length} payout requests`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch payout requests';
      setError(errorMessage);
      showCustomToast(errorMessage);
      console.error('Error fetching payouts:', err);
      console.error('Full error object:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve payout
  const handleApprove = async (payoutId) => {
    try {
      await payoutService.approvePayout(payoutId);
      showCustomToast('Payout approved successfully');
      setOpenReviewId(null); // Close the review actions
      fetchPayouts(); // Refresh the list
    } catch (err) {
      showCustomToast('Failed to approve payout');
    }
  };

  // Handle reject payout
  const handleReject = async (payoutId) => {
    try {
      await payoutService.rejectPayout(payoutId);
      showCustomToast('Payout rejected successfully');
      setOpenReviewId(null); // Close the review actions
      fetchPayouts(); // Refresh the list
    } catch (err) {
      showCustomToast('Failed to reject payout');
    }
  };

  // Apply filters
  const filteredPayouts = Array.isArray(payouts) ? payouts.filter(payout => {
    // Search filter
    const matchesSearch = 
      payout.userType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.coinsRequested?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.amountInRupees?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.payoutMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.payoutDetails?.accountHolderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.payoutDetails?.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.payoutDetails?.ifsc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.userDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;

    // User type filter
    const matchesUserType = userTypeFilter === 'all' || payout.userType === userTypeFilter;

    return matchesSearch && matchesStatus && matchesUserType;
  }) : [];

  // Calculate pagination slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = Array.isArray(filteredPayouts) ? filteredPayouts.slice(startIndex, startIndex + itemsPerPage) : [];

  useEffect(() => {
    fetchPayouts();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (statusFilter !== 'all' || userTypeFilter !== 'all') {
      fetchPayouts();
    }
  }, [statusFilter, userTypeFilter]);

  // Reset to first page when search term or filters change
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

  const tableData = Array.isArray(paginatedPayouts) ? paginatedPayouts.map((payout, index) => ({
    userType: payout.userType || '-',
    userEmail: payout.userDetails?.email || '-',
    coinsRequested: payout.coinsRequested || '-',
    amountInRupees: `₹${payout.amountInRupees || 0}`,
    payoutMethod: payout.payoutMethod || '-',
    accountHolder: payout.payoutDetails?.accountHolderName || '-',
    accountNumber: payout.payoutDetails?.accountNumber || '-',
    ifscCode: payout.payoutDetails?.ifsc || '-',
    actions: (
      payout.status === 'pending' ? (
        openReviewId === payout._id ? (
          <div className={styles['review-actions']}>
            <button 
              className={styles['approve-btn']}
              onClick={() => handleApprove(payout._id)}
              title="Approve payout"
            >
              ✔
            </button>
            <button 
              className={styles['reject-btn']}
              onClick={() => handleReject(payout._id)}
              title="Reject payout"
            >
              ✖
            </button>
          </div>
        ) : (
          <span
            className={styles['pending-status']}
            onClick={() => setOpenReviewId(payout._id)}
            style={{ cursor: 'pointer' }}
            title="Click to review payout"
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
          {payout.status === 'approved' ? 'Approved' : 'Rejected'}
        </span>
      )
    )
  })) : [];

  // Calculate summary statistics
  const pendingCount = payouts.filter(p => p.status === 'pending').length;
  const approvedCount = payouts.filter(p => p.status === 'approved').length;
  const rejectedCount = payouts.filter(p => p.status === 'rejected').length;
  const totalAmount = payouts.reduce((sum, payout) => sum + (payout.amountInRupees || 0), 0);

  return (
    <div className={styles['payout-list-container']}>
      <div className={styles['page-header']}>
        <h1>Admin Withdrawal Management</h1>
      </div>

      {/* Summary Cards */}
      <div className={styles['summary-section']}>
        <div className={styles['summary-cards']}>
          <div className={styles['summary-card']}>
            <h3>Total Requests</h3>
            <p className={styles['summary-value']}>{payouts.length}</p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Pending</h3>
            <p className={`${styles['summary-value']} ${styles['pending']}`}>{pendingCount}</p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Approved</h3>
            <p className={`${styles['summary-value']} ${styles['approved']}`}>{approvedCount}</p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Rejected</h3>
            <p className={`${styles['summary-value']} ${styles['rejected']}`}>{rejectedCount}</p>
          </div>
          <div className={styles['summary-card']}>
            <h3>Total Amount (₹)</h3>
            <p className={styles['summary-value']}>₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className={styles['refresh-info']}>
          <div className={styles['refresh-button-container']}>
            <button 
              className={`${styles['btn']} ${styles['btn-refresh-large']}`}
              onClick={fetchPayouts}
              disabled={loading}
              title="Refresh all data"
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Data'}
            </button>
          </div>
          {lastUpdated && (
            <div className={styles['last-updated']}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className={styles['card']}>
        <div className={styles['card-header']}>
          <h2>Payout Requests</h2>
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
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
            />
          </div>
        </div>

        <div className={styles['card-body']}>
          {loading ? (
            <div className={styles['loading-state']}>
              <div className={styles['spinner']}></div>
              <p>Loading payout requests...</p>
            </div>
          ) : error ? (
            <div className={styles['error-state']}>
              <p>{error}</p>
              <button className={`${styles['btn']} ${styles['btn-primary']}`} onClick={fetchPayouts}>
                Retry
              </button>
            </div>
          ) : (Array.isArray(paginatedPayouts) && paginatedPayouts.length === 0) ? (
            <div className={styles['empty-state']}>
              <p>No payout requests found</p>
            </div>
          ) : (
            <>
              <DynamicTable
                headings={tableHeaders}
                columnData={tableData}
                noDataMessage="No payout requests found"
              />
              <PaginationTable
                data={Array.isArray(filteredPayouts) ? filteredPayouts : []}
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