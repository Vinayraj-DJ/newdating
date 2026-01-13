import apiClient from "./apiClient";

/* ===============================
   ADMIN CONFIG
================================ */
export const getAllAdminConfig = () =>
  apiClient.get("/admin/config");

/* ===============================
   COMMISSION
================================ */
export const updateAdminSharePercentage = (data) =>
  apiClient.post("/admin/config/admin-share-percentage", data);

/* ===============================
   COIN → RUPEE
================================ */
export const updateCoinToRupeeRate = (data) =>
  apiClient.post("/admin/config/coin-to-rupee-rate", data);

/* ===============================
   MIN CALL COINS
================================ */
export const setMinCallCoins = (data) =>
  apiClient.post("/admin/config/min-call-coins", data);

/* ===============================
   MIN WITHDRAWAL
================================ */
export const setMinWithdrawal = (data) =>
  apiClient.post("/admin/config/min-withdrawal-amount", data);

/* ===============================
   NEW USER WINDOW
================================ */
export const setNewUserWindow = (data) =>
  apiClient.post("/admin/config/new-user-window");

/* ===============================
   LEVEL CONFIGURATION
================================ */
export const getAllLevels = () =>
  apiClient.get("/admin/users/level-config");

export const createLevel = (data) =>
  apiClient.post("/admin/users/level-config", data);

export const updateLevel = (id, data) =>
  apiClient.put(`/admin/users/level-config/${id}`);

export const deleteLevel = (id) =>
  apiClient.delete(`/admin/users/level-config/${id}`);
