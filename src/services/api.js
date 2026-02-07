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

// Top Fan Configuration endpoints
export async function getTopFanConfigById(id, { signal } = {}) {
  const res = await apiClient.get(`${ENDPOINTS.TOP_FAN.ROOT}/${id}`, { signal });
  return res.data;
}

export async function getTopFanConfig({ signal } = {}) {
  const res = await apiClient.get(ENDPOINTS.TOP_FAN.ROOT, { signal });
  return res.data;
}

export async function updateTopFanConfig(payload, { signal } = {}) {
  const res = await apiClient.post(ENDPOINTS.TOP_FAN.ROOT, payload, { signal });
  return res.data;
}

export async function updateTopFanConfigById(id, payload, { signal } = {}) {
  const res = await apiClient.put(`${ENDPOINTS.TOP_FAN.ROOT}/${id}`, payload, { signal });
  return res.data;
}

export async function deleteTopFanConfigById(id, { signal } = {}) {
  const res = await apiClient.delete(`${ENDPOINTS.TOP_FAN.ROOT}/${id}`, { signal });
  return res.data;
}

// Dashboard statistics endpoints (fallback to individual endpoints if not available)
export async function getDashboardStats({ signal } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for dashboard stats
  
  try {
    const res = await apiClient.get("/admin/dashboard-stats", { 
      signal: signal || controller.signal 
    });
    return res.data;
  } catch (error) {
    // If dashboard-stats endpoint doesn't exist (404), return null to trigger fallback
    if (error?.response?.status === 404) {
      return null;
    }
    // Re-throw other errors
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getCountByEndpoint(endpoint, { signal } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for count endpoints
  
  try {
    const res = await apiClient.get(endpoint, { 
      signal: signal || controller.signal 
    });
    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return 0;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Get all users with optional type filter
export async function getAllUsers({ type = null, signal } = {}) {
  try {
    const url = type ? `${ENDPOINTS.ADMIN.USERS}?type=${type}` : ENDPOINTS.ADMIN.USERS;
    const res = await apiClient.get(url, { signal });
    const payload = res?.data;
    
    // If requesting specific type (male/female/agency), return the array directly
    if (type) {
      const data = Array.isArray(payload.data) ? payload.data : [];
      return data;
    }
    
    // If requesting all users without type, return the object with separate arrays
    if (payload?.success && payload.data) {
      return payload.data; // { males, females, agencies }
    }
    
    return { males: [], females: [], agencies: [] };
  } catch (error) {
    console.error("Error fetching users:", error);
    return type ? [] : { males: [], females: [], agencies: [] };
  }
}

// Get users count by type - now using separate endpoints for reliability
export async function getUsersCount({ signal } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout for users count
  
  try {
    // Use separate endpoints for more reliable counting
    const [males, females, agencies] = await Promise.all([
      getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=male`, { signal: signal || controller.signal }),
      getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=female`, { signal: signal || controller.signal }),
      getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=agency`, { signal: signal || controller.signal })
    ]);
    
    const totalCount = males + females + agencies;
    return {
      total: totalCount,
      male: males,
      female: females,
      agency: agencies,
    };
  } catch (error) {
    console.error("Error calculating user counts:", error);
    // Final fallback - return zeros
    return { total: 0, male: 0, female: 0, agency: 0 };
  } finally {
    clearTimeout(timeoutId);
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
