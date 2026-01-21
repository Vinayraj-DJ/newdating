import React, { useState, useEffect } from 'react';
import { payoutService } from '../../services/payoutService';
import { toast } from 'react-toastify';
import { ToastContainerCustom as CustomToast } from '../../components/CustomToast/CustomToast';
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

  // Fetch payouts from API
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const response = await payoutService.getAllPayouts();
      
      // Handle different possible response structures
      let payoutData = [];
      if (Array.isArray(response)) {
        payoutData = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          payoutData = response.data;
        } else if (Array.isArray(response.payouts)) {
          payoutData = response.payouts;
        } else if (Array.isArray(response.result)) {
          payoutData = response.result;
        } else {
          // If none of the common patterns match, log the response structure for debugging
          console.log('Unexpected response structure:', response);
          payoutData = [];
        }
      }
      
      setPayouts(payoutData);
      setTotalPages(Math.ceil((payoutData.length || 0) / itemsPerPage));
      setError(null);
    } catch (err) {
      setError('Failed to fetch payout requests');
      toast.error('Failed to fetch payout requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve payout
  const handleApprove = async (payoutId) => {
    try {
      await payoutService.approvePayout(payoutId);
      toast.success('Payout approved successfully');
      fetchPayouts(); // Refresh the list
    } catch (err) {
      toast.error('Failed to approve payout');
    }
  };

  // Handle reject payout
  const handleReject = async (payoutId) => {
    try {
      await payoutService.rejectPayout(payoutId);
      toast.success('Payout rejected successfully');
      fetchPayouts(); // Refresh the list
    } catch (err) {
      toast.error('Failed to reject payout');
    }
  };

  // Filter payouts based on search term
  const filteredPayouts = Array.isArray(payouts) ? payouts.filter(payout =>
    payout.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.amount?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate pagination slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = Array.isArray(filteredPayouts) ? filteredPayouts.slice(startIndex, startIndex + itemsPerPage) : [];

  useEffect(() => {
    fetchPayouts();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const tableHeaders = [
    { title: 'User ID', accessor: 'userId' },
    { title: 'Amount', accessor: 'amount' },
    { title: 'Status', accessor: 'status' },
    { title: 'Actions', accessor: 'actions' },
  ];

  const tableData = Array.isArray(paginatedPayouts) ? paginatedPayouts.map((payout, index) => ({
    userId: payout.userId || '-',
    amount: `$${payout.amount || 0}`,
    status: (
      <span className={`${styles['status-badge']} ${styles[payout.status?.toLowerCase()]}`}>
        {payout.status}
      </span>
    ),
    actions: (
      <div className={styles['action-buttons']}>
        <button
          className={`${styles['btn']} ${styles['btn-accept']}`}
          onClick={() => handleApprove(payout.id)}
          disabled={payout.status !== 'pending'}
        >
          Accept
        </button>
        <button
          className={`${styles['btn']} ${styles['btn-reject']}`}
          onClick={() => handleReject(payout.id)}
          disabled={payout.status !== 'pending'}
        >
          Reject
        </button>
      </div>
    )
  })) : [];

  return (
    <div className={styles['payout-list-container']}>
      <div className={styles['page-header']}>
        <h1>Admin Withdrawal Management</h1>
      </div>

      <div className={styles['card']}>
        <div className={styles['card-header']}>
          <h2>Withdrawal Requests</h2>
          <div className={styles['header-actions']}>
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
              <p>Loading withdrawal requests...</p>
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
              <p>No withdrawal requests found</p>
            </div>
          ) : (
            <>
              <DynamicTable
                headings={tableHeaders}
                columnData={tableData}
                noDataMessage="No withdrawal requests found"
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

      <CustomToast />
    </div>
  );
};

export default PayoutList;