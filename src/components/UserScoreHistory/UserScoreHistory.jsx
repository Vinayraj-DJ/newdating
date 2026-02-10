// src/components/UserScoreHistory/UserScoreHistory.jsx
import React, { useState, useEffect } from 'react';
import { scoreRuleService } from '../../services/scoreRuleService';
import { FaUserCircle, FaTrophy, FaCalendarAlt, FaPlusCircle, FaHistory } from 'react-icons/fa';
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
        if (response && typeof response === 'object') {
          setHistory(Array.isArray(response.data) ? response.data : []);
          setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalResults: 0 });
        } else {
          setHistory(Array.isArray(response) ? response : []);
          setPagination({ currentPage: 1, totalPages: 1, totalResults: 0 });
        }
      } catch (err) {
        setError('Failed to fetch individual earning history');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserScoreHistory();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && userId) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <span>Accessing User Records...</span>
      </div>
    );
  }

  if (error) return <div className={styles.errorBanner}>{error}</div>;
  if (!userId) return <div className={styles.waitingState}>Please provide a User ID to view activity history</div>;

  return (
    <div className={styles.historyContainer}>
      <header className={styles.historyHeader}>
        <div className={styles.userMeta}>
          <FaUserCircle className={styles.userIcon} />
          <div>
            <h3>Earning Logs</h3>
            <span>ID: {userId}</span>
          </div>
        </div>

        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <div className={styles.statVal}>{history.length}</div>
            <div className={styles.statLabel}>Total Events</div>
          </div>
          <div className={styles.statSeparator} />
          <div className={styles.statItem}>
            <div className={`${styles.statVal} ${styles.scoreVal}`}>
              {history.reduce((sum, record) => sum + (record.scoreAdded || 0), 0)}
            </div>
            <div className={styles.statLabel}>Points Accumulated</div>
          </div>
        </div>
      </header>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <FaHistory />
          <p>No historical score events found for this user.</p>
        </div>
      ) : (
        <div className={styles.logTableWrapper}>
          <table className={styles.historyLog}>
            <thead>
              <tr>
                <th>Event Activity</th>
                <th>Points Reward</th>
                <th>Date Logged</th>
                <th>Source Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id}>
                  <td>
                    <div className={styles.ruleInfo}>
                      <span className={styles.ruleName}>{record.ruleType?.replace(/_/g, ' ')}</span>
                      <small>Triggered System Action</small>
                    </div>
                  </td>
                  <td>
                    <div className={styles.ptsBatch}>
                      <FaPlusCircle />
                      <span>{record.scoreAdded} PTS</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <FaCalendarAlt />
                      {formatDate(record.createdAt)}
                    </div>
                  </td>
                  <td>{formatDate(record.referenceDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalResults > history.length && (
            <footer className={styles.tableFooter}>
              <span>Tracking {history.length} of {pagination.totalResults} identified records</span>
            </footer>
          )}
        </div>
      )}
    </div>
  );
};

export default UserScoreHistory;
