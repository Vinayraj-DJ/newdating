// src/services/scoreRuleService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/apiConfig';

/**
 * Service for managing score rules
 */
export const scoreRuleService = {
  /**
   * GET: /admin/reward-rules/rules
   * Fetches all score rules
   */
  getAllScoreRules: async ({ signal } = {}) => {
    try {
      const response = await apiClient.get(ENDPOINTS.REWARD_RULES.RULES, { signal });
      
      // Handle different response formats
      const payload = response?.data ?? response;
      const list = Array.isArray(payload?.data) 
        ? payload.data 
        : Array.isArray(payload) 
          ? payload 
          : [];

      return list;
    } catch (error) {
      console.error('Error fetching score rules:', error);
      throw error;
    }
  },

  /**
   * GET: /admin/reward-rules/rules/:id
   * Fetches a specific score rule by ID
   */
  getScoreRuleById: async (id, { signal } = {}) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.REWARD_RULES.RULES}/${id}`, { signal });
      
      // Handle different response formats
      const payload = response?.data ?? response;
      return payload?.data || payload;
    } catch (error) {
      console.error(`Error fetching score rule with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * POST: /admin/reward-rules/rules
   * Creates a new score rule
   */
  createScoreRule: async (data, { signal } = {}) => {
    try {
      // Prepare the payload according to the expected format
      const payload = {
        ruleName: data.ruleName,
        ruleType: data.ruleType,
        scoreValue: data.scoreValue,
        minCount: data.minCount !== undefined && data.minCount !== null && data.minCount !== '' ? Number(data.minCount) : null,
        requiredDays: data.requiredDays !== undefined && data.requiredDays !== null && data.requiredDays !== '' ? Number(data.requiredDays) : 7 // Default to 7 days
      };
      
      const response = await apiClient.post(ENDPOINTS.REWARD_RULES.RULES, payload, { signal });
      
      // Handle your specific API response format
      const responseData = response?.data ?? response;
      
      // Return the created rule data
      if (responseData?.data) {
        return responseData.data;
      } else if (responseData?._id) {
        // If response is the rule object itself
        return responseData;
      } else {
        // Fallback
        return responseData;
      }
    } catch (error) {
      console.error('Error creating score rule:', error);
      throw error;
    }
  },

  /**
   * PUT: /admin/reward-rules/rules/:id
   * Updates an existing score rule
   */
  updateScoreRule: async (id, data, { signal } = {}) => {
    try {
      // Prepare the payload according to the expected format
      const payload = {
        ruleName: data.ruleName,
        ruleType: data.ruleType,
        scoreValue: data.scoreValue,
        minCount: data.minCount !== undefined && data.minCount !== null && data.minCount !== '' ? Number(data.minCount) : null,
        requiredDays: data.requiredDays !== undefined && data.requiredDays !== null && data.requiredDays !== '' ? Number(data.requiredDays) : 7 // Default to 7 days
      };
      
      const response = await apiClient.put(`${ENDPOINTS.REWARD_RULES.RULES}/${id}`, payload, { signal });
      
      // Handle different response formats
      const responseData = response?.data ?? response;
      return responseData?.data || responseData;
    } catch (error) {
      console.error(`Error updating score rule with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * DELETE: /admin/reward-rules/rules/:id
   * Deletes a score rule
   */
  deleteScoreRule: async (id, { signal } = {}) => {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.REWARD_RULES.RULES}/${id}`, { signal });
      
      // Handle different response formats
      const payload = response?.data ?? response;
      return payload?.data || payload;
    } catch (error) {
      console.error(`Error deleting score rule with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * GET: /admin/reward-rules/users/:userId/scores
   * Fetches user scores
   */
  getUserScores: async (userId, { signal } = {}) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.REWARD_RULES.USER_SCORES}/${userId}/scores`, { signal });
      
      // Handle different response formats
      const payload = response?.data ?? response;
      return payload?.data || payload;
    } catch (error) {
      console.error(`Error fetching user scores for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * GET: /admin/reward-rules/users/:userId/history
   * Fetches user score history
   */
  getUserScoreHistory: async (userId, { signal } = {}) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.REWARD_RULES.USER_SCORES}/${userId}/history`, { signal });
      
      // Handle your specific API response format
      const payload = response?.data ?? response;
      
      // Return the complete response object with data and pagination
      return {
        data: payload?.data || [],
        pagination: payload?.pagination || { currentPage: 1, totalPages: 1, totalResults: 0 }
      };
    } catch (error) {
      console.error(`Error fetching user score history for user ${userId}:`, error);
      throw error;
    }
  }
};