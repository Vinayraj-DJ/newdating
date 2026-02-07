import React, { useState, useEffect } from "react";
import { getEarningsSummary, getEarningsHistory, getTopEarningUsers } from "../../services/earningsService";
import styles from "./EarningsDashboard.module.css";

const EarningsDashboard = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [topUsersData, setTopUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summary, history, topUsers] = await Promise.all([
          getEarningsSummary(),
          getEarningsHistory({ page: 1, limit: 10 }),
          getTopEarningUsers({ limit: 5 })
        ]);

        if (summary?.success) setEarningsData(summary.data);
        if (history?.success) setHistoryData(history.data);
        if (topUsers?.success) setTopUsersData(topUsers.data);
      } catch (err) {
        setError(err.message || "Failed to fetch earnings data");
        console.error("Error fetching earnings data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !earningsData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.earningsDashboard}>
      <div className={styles.header}>
        <h2>Earnings Dashboard</h2>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'topUsers' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('topUsers')}
          >
            Top Earners
          </button>
        </div>
      </div>

      {activeTab === 'summary' && earningsData && (
        <div className={styles.summarySection}>
          <div className={styles.totalEarningsCard}>
            <h3>Total Earnings</h3>
            <div className={styles.amount}>
              {formatCurrency(earningsData.totalEarnings || 0)}
            </div>
            <div className={styles.lastUpdated}>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {earningsData.earningsBySource && earningsData.earningsBySource.length > 0 && (
            <div className={styles.sourcesSection}>
              <h3>Earnings by Source</h3>
              <div className={styles.sourcesGrid}>
                {earningsData.earningsBySource.map((source, index) => (
                  <div key={source._id} className={styles.sourceCard}>
                    <div className={styles.sourceName}>
                      {source._id.replace(/_/g, ' ')}
                    </div>
                    <div className={styles.sourceAmount}>
                      {formatCurrency(source.total)}
                    </div>
                    <div className={styles.sourceCount}>
                      {source.count} transactions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && historyData && (
        <div className={styles.historySection}>
          <h3>Recent Transactions</h3>
          <div className={styles.historyList}>
            {Object.entries(historyData).map(([sourceType, transactions]) => (
              transactions && transactions.length > 0 && (
                <div key={sourceType} className={styles.sourceGroup}>
                  <h4>{sourceType.replace(/_/g, ' ')}</h4>
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className={styles.transactionItem}>
                      <div className={styles.transactionHeader}>
                        <span className={styles.transactionAmount}>
                          {formatCurrency(transaction.amount)}
                        </span>
                        <span className={styles.transactionDate}>
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                      <div className={styles.transactionUser}>
                        {transaction.fromUser?.name || 'Unknown User'}
                        {transaction.fromUser?.email && (
                          <span className={styles.userEmail}>
                            ({transaction.fromUser.email})
                          </span>
                        )}
                      </div>
                      {transaction.package && (
                        <div className={styles.transactionPackage}>
                          Package: {transaction.package.coins} coins for {formatCurrency(transaction.package.amount)}
                        </div>
                      )}
                      {transaction.transaction && (
                        <div className={styles.transactionStatus}>
                          Status: <span className={styles.successStatus}>
                            {transaction.transaction.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topUsers' && topUsersData && topUsersData.length > 0 && (
        <div className={styles.topUsersSection}>
          <h3>Top Earning Users</h3>
          <div className={styles.topUsersList}>
            {topUsersData.map((user, index) => (
              <div key={user._id} className={styles.userItem}>
                <div className={styles.userRank}>
                  #{index + 1}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>
                    {user.userDetails?.name || 'Unknown User'}
                  </div>
                  <div className={styles.userType}>
                    {user.userType} user
                  </div>
                </div>
                <div className={styles.userEarnings}>
                  <div className={styles.earningsAmount}>
                    {formatCurrency(user.totalEarnings)}
                  </div>
                  <div className={styles.transactionCount}>
                    {user.transactionCount} transactions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDashboard;