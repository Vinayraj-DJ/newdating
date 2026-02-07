// src/components/UserScoreHistory/UserScoreHistory.jsx
import React, { useState, useEffect } from 'react';
import { scoreRuleService } from '../../services/scoreRuleService';
import styles from './UserScoreHistory.module.css';

const UserScoreHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalResults: 0 });

  useEffect(() => {
    const fetchUserScoreHistory = async () => {
      if (!userId) {
        setHistory([]);
        setPagination({ currentPage: 1, totalPages: 1, totalResults: 0 });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        
        const response = await scoreRuleService.getUserScoreHistory(userId);
        
        // Handle the response structure properly
        if (response && typeof response === 'object') {
          setHistory(Array.isArray(response.data) ? response.data : []);
          setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalResults: 0 });
        } else {
          // Fallback for different response formats
          setHistory(Array.isArray(response) ? response : []);
          setPagination({ currentPage: 1, totalPages: 1, totalResults: 0 });
        }
      } catch (err) {
        console.error('Error fetching user score history:', err);
        setError('Failed to fetch user score history');
        setHistory([]);
        setPagination({ currentPage: 1, totalPages: 1, totalResults: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchUserScoreHistory();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading user score history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>User Score History</h3>
      
      {userId && (
        <div className={styles.userInfo}>
          <strong>User ID:</strong> {userId}
        </div>
      )}
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{history.length}</div>
          <div className={styles.statLabel}>Total Records</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {history.reduce((sum, record) => sum + record.scoreAdded, 0)}
          </div>
          <div className={styles.statLabel}>Total Points Earned</div>
        </div>
      </div>

      {history.length === 0 ? (
        <p className={styles.noData}>No score history found for this user.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Rule Type</th>
                <th>Points</th>
                <th>Date</th>
                <th>Reference Date</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id}>
                  <td className={styles.ruleType}>
                    <span className={styles.ruleBadge}>{record.ruleType}</span>
                  </td>
                  <td className={styles.points}>
                    <span className={styles.positive}>+{record.scoreAdded}</span>
                  </td>
                  <td>{formatDate(record.createdAt)}</td>
                  <td>{formatDate(record.referenceDate)}</td>
                  <td>{record.addedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalResults > 0 && (
        <div className={styles.pagination}>
          <span>
            Showing {history.length} of {pagination.totalResults} records
          </span>
        </div>
      )}
    </div>
  );
};

export default UserScoreHistory;