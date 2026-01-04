import apiClient from "./apiClient";

/**
 * ✅ Get Logged-in Male User Profile
 * API: GET /male-user/me
 */
export async function getMaleUserProfile({ signal } = {}) {
  const res = await apiClient.get("/male-user/me", { signal });

  const payload = res?.data;
  if (payload?.success) {
    return payload.data;
  }

  throw new Error("Failed to fetch male user profile");
}
