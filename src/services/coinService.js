// src/services/coinService.js
import apiClient from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

/**
 * POST /admin/users/operate-balance
 * body: { userType, userId, operationType: "coin", action: "credit"|"debit", amount, message }
 */
export async function operateCoinBalance({ userType, userId, action, amount, message }, { signal } = {}) {
  const body = {
    userType,
    userId,
    operationType: "coin",
    action,
    amount,
    message,
  };
  const res = await apiClient.post(`${ENDPOINTS.ADMIN.USERS}/operate-balance`, body, { signal });
  // return res.data (server wraps response)
  return res.data ?? res;
}

/**
 * GET /admin/users/:userType/:userId/transactions?operationType=coin
 * returns { success: true, data: [...] } or array depending on API
 */
export async function getCoinTransactions({ userType, userId }, { signal } = {}) {
  const res = await apiClient.get(
    `${ENDPOINTS.ADMIN.USERS}/${userType}/${userId}/transactions`,
    { params: { operationType: "coin" }, signal }
  );
  return res.data ?? res;
}
