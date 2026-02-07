import apiClient from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

/**
 * Get Top Fan Configuration
 * GET /admin/top-fan-config
 */
export async function getTopFanConfig({ signal } = {}) {
  const res = await apiClient.get(ENDPOINTS.TOP_FAN.ROOT, { signal });
  // Handle array response - return the first configuration or empty object
  if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
    return { ...res.data, data: res.data.data[0] };
  }
  return res.data;
}

/**
 * Get Top Fan Configuration by ID
 * GET /admin/top-fan-config/:id
 */
export async function getTopFanConfigById(id, { signal } = {}) {
  const res = await apiClient.get(`${ENDPOINTS.TOP_FAN.ROOT}/${id}`, { signal });
  return res.data;
}

/**
 * Update Top Fan Configuration
 * POST /admin/top-fan-config
 */
export async function updateTopFanConfig(payload, { signal } = {}) {
  const res = await apiClient.post(ENDPOINTS.TOP_FAN.ROOT, payload, { signal });
  return res.data;
}

/**
 * Toggle Top Fan Configuration Active Status
 * PUT /admin/top-fan-config/toggle
 */
export async function toggleTopFanConfigStatus({ signal } = {}) {
  const res = await apiClient.put(`${ENDPOINTS.TOP_FAN.ROOT}/toggle`, {}, { signal });
  return res.data;
}

/**
 * Update Top Fan Configuration by ID
 * PUT /admin/top-fan-config/:id
 */
export async function updateTopFanConfigById(id, payload, { signal } = {}) {
  const res = await apiClient.put(`${ENDPOINTS.TOP_FAN.ROOT}/${id}`, payload, { signal });
  return res.data;
}

/**
 * Delete Top Fan Configuration by ID
 * DELETE /admin/top-fan-config/:id
 */
export async function deleteTopFanConfigById(id, { signal } = {}) {
  const res = await apiClient.delete(`${ENDPOINTS.TOP_FAN.ROOT}/${id}`, { signal });
  return res.data;
}