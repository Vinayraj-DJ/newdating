import apiClient from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

export async function adminLogin(payload, { signal } = {}) {
  const res = await apiClient.post(ENDPOINTS.ADMIN.LOGIN, payload, { signal });
  return res?.data?.data?.token || "";
}

export async function getAllInterests({ signal } = {}) {
  const res = await apiClient.get(ENDPOINTS.INTERESTS.ROOT, { signal });
  return res.data;
}

// Registration endpoints
export async function registerMaleUser(payload, { signal } = {}) {
  const res = await apiClient.post(ENDPOINTS.MALE_USER.REGISTER, payload, { signal });
  return res.data;
}

export async function registerFemaleUser(payload, { signal } = {}) {
  const res = await apiClient.post(ENDPOINTS.FEMALE_USER.REGISTER, payload, { signal });
  return res.data;
}

export async function registerAgency(payload, { signal } = {}) {
  const res = await apiClient.post(ENDPOINTS.AGENCY.REGISTER, payload, { signal });
  return res.data;
}

// Dashboard statistics endpoints
export async function getDashboardStats({ signal } = {}) {
  const res = await apiClient.get("/admin/dashboard-stats", { signal });
  return res.data;
}

export async function getCountByEndpoint(endpoint, { signal } = {}) {
  try {
    const res = await apiClient.get(endpoint, { signal });
    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return 0;
  }
}

// Get all users with optional type filter
export async function getAllUsers({ type = null, signal } = {}) {
  try {
    const url = type ? `${ENDPOINTS.ADMIN.USERS}?type=${type}` : ENDPOINTS.ADMIN.USERS;
    const res = await apiClient.get(url, { signal });
    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Get users count by type
export async function getUsersCount({ signal } = {}) {
  try {
    const users = await getAllUsers({ signal });
    const maleCount = users.filter(u => u.userType === 'male' || u.type === 'male').length;
    const femaleCount = users.filter(u => u.userType === 'female' || u.type === 'female').length;
    const totalCount = users.length;
    
    return {
      total: totalCount,
      male: maleCount,
      female: femaleCount,
    };
  } catch (error) {
    console.error("Error calculating user counts:", error);
    return { total: 0, male: 0, female: 0 };
  }
}

// Get single user by ID
export async function getUserById(userId, { signal } = {}) {
  try {
    const res = await apiClient.get(`${ENDPOINTS.ADMIN.USERS}/${userId}`, { signal });
    const payload = res.data ?? res;
    
    if (payload?.data) return payload.data;
    if (payload?.user) return payload.user;
    if (payload?._id) return payload;
    return payload;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

// Send push notification
export async function sendPushNotification(payload, { signal } = {}) {
  const res = await apiClient.post("/admin/notifications", payload, { signal });
  return res.data;
}
