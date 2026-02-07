import apiClient from "./apiClient";

/**
 * Earnings API Service
 * Handles all earnings-related endpoints for the admin dashboard
 */

const BASE_URL = "/admin/earnings";

/**
 * Get earnings summary
 * GET /admin/earnings/summary
 * 
 * Response: {
 *   "success": true,
 *   "data": {
 *     "totalEarnings": 1445.4,
 *     "earningsBySource": [...]
 *   }
 * }
 */
export async function getEarningsSummary() {
  try {
    const response = await apiClient.get(`${BASE_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    throw error;
  }
}

/**
 * Get earnings history
 * GET /admin/earnings/history
 * 
 * Response: {
 *   "success": true,
 *   "data": {
 *     "CALL_COMMISSION": [...],
 *     "PACKAGE_PURCHASE": [...]
 *   }
 * }
 */
export async function getEarningsHistory({ page = 1, limit = 10 } = {}) {
  try {
    const response = await apiClient.get(`${BASE_URL}/history`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching earnings history:", error);
    throw error;
  }
}

/**
 * Get top earning users
 * GET /admin/earnings/top-users
 * 
 * Response: {
 *   "success": true,
 *   "data": [...]
 * }
 */
export async function getTopEarningUsers({ limit = 10 } = {}) {
  try {
    const response = await apiClient.get(`${BASE_URL}/top-users`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top earning users:", error);
    throw error;
  }
}

/**
 * Get earnings by date range
 * GET /admin/earnings/range
 * 
 * @param {Object} params
 * @param {string} params.startDate - Start date in YYYY-MM-DD format
 * @param {string} params.endDate - End date in YYYY-MM-DD format
 * @param {string} params.source - Optional source filter (PACKAGE_PURCHASE, CALL_COMMISSION, etc.)
 */
export async function getEarningsByRange({ startDate, endDate, source }) {
  try {
    const params = { startDate, endDate };
    if (source) params.source = source;
    
    const response = await apiClient.get(`${BASE_URL}/range`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching earnings by range:", error);
    throw error;
  }
}

/**
 * Get earnings statistics for dashboard
 * Combines multiple endpoints to provide comprehensive earnings data
 */
export async function getEarningsDashboardStats() {
  try {
    const [summary, topUsers] = await Promise.all([
      getEarningsSummary(),
      getTopEarningUsers({ limit: 5 })
    ]);
    
    return {
      summary: summary.data,
      topUsers: topUsers.data,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching earnings dashboard stats:", error);
    throw error;
  }
}

export default {
  getEarningsSummary,
  getEarningsHistory,
  getTopEarningUsers,
  getEarningsByRange,
  getEarningsDashboardStats
};