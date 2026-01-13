// src/services/dailyRewardSlabsService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/apiConfig';

/**
 * Service for managing daily reward slabs
 */
const dailyRewardSlabsService = {
  /**
   * GET: /admin/rewards/daily-rewards
   * Fetches all daily reward slabs
   */
  getAllDailyRewardSlabs: async ({ signal } = {}) => {
    try {
      const response = await apiClient.get(ENDPOINTS.REWARDS.DAILY_REWARDS, { signal });
      // Handle different response formats
      const payload = response?.data ?? response;
      const list = Array.isArray(payload?.data) 
        ? payload.data 
        : Array.isArray(payload) 
          ? payload 
          : [];

      return list;
    } catch (error) {
      console.error('Error fetching daily reward slabs:', error);
      throw error;
    }
  },

  /**
   * POST: /admin/rewards/daily-rewards
   * Creates a new daily reward slab
   */
  createDailyRewardSlab: async (data, { signal } = {}) => {
    try {
      const response = await apiClient.post(ENDPOINTS.REWARDS.DAILY_REWARDS, data, { signal });
      // Handle different response formats
      const payload = response?.data ?? response;
      return payload;
    } catch (error) {
      console.error('Error creating daily reward slab:', error);
      throw error;
    }
  },

  /**
   * PUT: /admin/rewards/daily-rewards/:id
   * Updates an existing daily reward slab (partial update)
   */
  updateDailyRewardSlab: async (id, data, { signal } = {}) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.REWARDS.DAILY_REWARDS}/${id}`, data, { signal });
      // Handle different response formats
      const payload = response?.data ?? response;
      return payload;
    } catch (error) {
      console.error('Error updating daily reward slab:', error);
      throw error;
    }
  },

  /**
   * DELETE: /admin/rewards/daily-rewards/:id
   * Deletes a daily reward slab
   */
  deleteDailyRewardSlab: async (id, { signal } = {}) => {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.REWARDS.DAILY_REWARDS}/${id}`, { signal });
      // Handle different response formats
      const payload = response?.data ?? response;
      return payload;
    } catch (error) {
      console.error('Error deleting daily reward slab:', error);
      throw error;
    }
  }
};

export { dailyRewardSlabsService };