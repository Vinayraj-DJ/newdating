import apiClient from './apiClient';

export const weeklyRewardSlabsService = {
  // Get all weekly reward slabs
  getAllWeeklyRewardSlabs: () => {
    return apiClient.get('/admin/rewards/weekly-rewards');
  },

  // Get weekly reward slab by ID
  getWeeklyRewardSlabById: (id) => {
    return apiClient.get(`/admin/rewards/weekly-rewards/${id}`);
  },

  // Create new weekly reward slab
  createWeeklyRewardSlab: (data) => {
    return apiClient.post('/admin/rewards/weekly-rewards', data);
  },

  // Update weekly reward slab
  updateWeeklyRewardSlab: (id, data) => {
    return apiClient.put(`/admin/rewards/weekly-rewards/${id}`, data);
  },

  // Delete weekly reward slab
  deleteWeeklyRewardSlab: (id) => {
    return apiClient.delete(`/admin/rewards/weekly-rewards/${id}`);
  }
};