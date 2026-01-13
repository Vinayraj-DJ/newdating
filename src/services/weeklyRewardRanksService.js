import apiClient from "./apiClient";

export const weeklyRewardRanksService = {
  // Get all weekly reward ranks
  getAllWeeklyRewardRanks: async () => {
    try {
      const response = await apiClient.get("/admin/rewards/weekly-rewards");
      // Handle different possible response structures
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Check if data is in a nested property like data.data, data.result, etc.
        if (response.data.data) {
          return Array.isArray(response.data.data) ? response.data.data : [];
        } else if (response.data.result) {
          return Array.isArray(response.data.result) ? response.data.result : [];
        } else if (response.data.ranks) {
          return Array.isArray(response.data.ranks) ? response.data.ranks : [];
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching weekly reward ranks:", error);
      throw error;
    }
  },

  // Get weekly reward rank by ID
  getWeeklyRewardRankById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/rewards/weekly-rewards/${id}`);
      // Return the actual record data, handling potential nested structures
      if (response.data && typeof response.data === 'object') {
        // Check common nested property names
        if (response.data.data) {
          return response.data.data;
        } else if (response.data.result) {
          return response.data.result;
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching weekly reward rank:", error);
      throw error;
    }
  },

  // Create new weekly reward rank
  createWeeklyRewardRank: async (rankData) => {
    try {
      const response = await apiClient.post("/admin/rewards/weekly-rewards", rankData);
      // Return the created record data, handling potential nested structures
      if (response.data && typeof response.data === 'object') {
        // Check common nested property names
        if (response.data.data) {
          return response.data.data;
        } else if (response.data.result) {
          return response.data.result;
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error creating weekly reward rank:", error);
      throw error;
    }
  },

  // Update existing weekly reward rank
  updateWeeklyRewardRank: async (id, rankData) => {
    try {
      const response = await apiClient.put(`/admin/rewards/weekly-rewards/${id}`, rankData);
      // Return the updated record data, handling potential nested structures
      if (response.data && typeof response.data === 'object') {
        // Check common nested property names
        if (response.data.data) {
          return response.data.data;
        } else if (response.data.result) {
          return response.data.result;
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error updating weekly reward rank:", error);
      throw error;
    }
  },

  // Delete weekly reward rank
  deleteWeeklyRewardRank: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/rewards/weekly-rewards/${id}`);
      // Return the deletion response, handling potential nested structures
      if (response.data && typeof response.data === 'object') {
        // Check common nested property names
        if (response.data.data) {
          return response.data.data;
        } else if (response.data.result) {
          return response.data.result;
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error deleting weekly reward rank:", error);
      throw error;
    }
  },
};