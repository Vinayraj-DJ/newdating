import apiClient from "./apiClient";

/**
 * ✅ Get single male user details (ADMIN)
 * API: GET /admin/users/:id
 */
export async function getMaleUserInfo(userId, { signal } = {}) {
  const res = await apiClient.get(`/admin/users/${userId}`, { signal });

  if (res?.data?.success) {
    return res.data.data;
  }

  throw new Error("Failed to fetch male user info");
}






