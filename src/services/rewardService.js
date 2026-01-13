// src/services/rewardService.js
import apiClient from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

const endpoints = {
  triggerDaily: ENDPOINTS.REWARDS.TRIGGER_DAILY,
  triggerWeekly: ENDPOINTS.REWARDS.TRIGGER_WEEKLY || "/admin/rewards/trigger-weekly",
  pendingRewards: ENDPOINTS.REWARDS.PENDING_REWARDS,
  rewardHistory: ENDPOINTS.REWARDS.REWARD_HISTORY,
};

/**
 * POST: /admin/rewards/trigger-daily
 * Triggers daily reward calculation
 */
export async function triggerDailyRewards({ signal } = {}) {
  const res = await apiClient.post(endpoints.triggerDaily, {}, { signal });
  return res.data;
}

/**
 * POST: /admin/rewards/trigger-weekly
 * Triggers weekly reward calculation
 */
export async function triggerWeeklyRewards({ signal } = {}) {
  const res = await apiClient.post(endpoints.triggerWeekly, {}, { signal });
  return res.data;
}

/**
 * GET: /admin/rewards/pending-rewards?type=daily
 * Fetches pending daily rewards
 */
export async function getPendingDailyRewards({ signal } = {}) {
  const res = await apiClient.get(`${endpoints.pendingRewards}?type=daily`, { signal });

  // Handle different response formats
  const payload = res?.data ?? res;
  const list = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return list;
}

/**
 * GET: /admin/rewards/pending-rewards?type=weekly
 * Fetches pending weekly rewards
 */
export async function getPendingWeeklyRewards({ signal } = {}) {
  const res = await apiClient.get(`${endpoints.pendingRewards}?type=weekly`, { signal });

  // Handle different response formats
  const payload = res?.data ?? res;
  const list = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return list;
}

/**
 * POST: /admin/rewards/pending-rewards/:rewardId/approve
 * Approves a pending daily reward
 */
export async function approvePendingReward({ rewardId, signal } = {}) {
  if (!rewardId) throw new Error("Missing rewardId for approvePendingReward");
  
  const res = await apiClient.post(`${endpoints.pendingRewards}/${rewardId}/approve`, {}, { signal });
  return res.data;
}

/**
 * POST: /admin/rewards/pending-rewards/:rewardId/reject
 * Rejects a pending daily reward
 */
export async function rejectPendingReward({ rewardId, signal } = {}) {
  if (!rewardId) throw new Error("Missing rewardId for rejectPendingReward");
  
  const res = await apiClient.post(`${endpoints.pendingRewards}/${rewardId}/reject`, {}, { signal });
  return res.data;
}

/**
 * GET: /admin/rewards/reward-history
 * Fetches reward history
 */
export async function getRewardHistory({ signal } = {}) {
  const res = await apiClient.get(endpoints.rewardHistory, { signal });
  
  // Handle different response formats
  const payload = res?.data ?? res;
  const list = Array.isArray(payload?.data) 
    ? payload.data 
    : Array.isArray(payload) 
      ? payload 
      : Array.isArray(payload?.data) 
        ? payload.data 
        : [];

  return list;
}

/**
 * GET: /admin/rewards/reward-history?status=rejected
 * Fetches rejected rewards
 */
export async function getRejectedRewards({ signal } = {}) {
  const res = await apiClient.get(`${endpoints.rewardHistory}?status=rejected`, { signal });
  
  // Handle different response formats
  const payload = res?.data ?? res;
  const list = Array.isArray(payload?.data) 
    ? payload.data 
    : Array.isArray(payload) 
      ? payload 
      : Array.isArray(payload?.data) 
        ? payload.data 
        : [];

  return list;
}