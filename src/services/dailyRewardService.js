import apiClient from './apiClient';
import { ENDPOINTS } from '../config/apiConfig';

export const dailyRewardService = {
  // Get all daily reward slabs
  getAllDailyRewards: () => {
    return apiClient.get(ENDPOINTS.REWARDS.DAILY_REWARDS);
  },

  // Create a new daily reward slab
  createDailyReward: (data) => {
    return apiClient.post(ENDPOINTS.REWARDS.DAILY_REWARDS, data);
  },

  // Update an existing daily reward slab
  updateDailyReward: (id, data) => {
    return apiClient.put(`${ENDPOINTS.REWARDS.DAILY_REWARDS}/${id}`, data);
  },

  // Delete a daily reward slab
  deleteDailyReward: (id) => {
    return apiClient.delete(`${ENDPOINTS.REWARDS.DAILY_REWARDS}/${id}`);
  }
};