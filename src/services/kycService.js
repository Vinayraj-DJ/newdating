import apiClient from "./apiClient";

/**
 * Get pending KYCs
 * GET /admin/users/pending-kycs
 */
export async function getPendingKYCs({ signal } = {}) {
  const res = await apiClient.get("/admin/users/pending-kycs", { signal });
  
  if (res?.data?.success && res.data.data) {
    return res.data.data; // { female: [...], agency: [...] }
  }
  
  throw new Error(res?.data?.message || "Failed to fetch pending KYCs");
}

/**
 * Review KYC
 * POST /admin/users/review-kyc
 */
export async function reviewKYC({ kycId, status, kycType }) {
  if (!kycId || !status || !kycType) {
    throw new Error("kycId, status, and kycType are required");
  }

  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new Error("status must be either: approved, rejected");
  }

  const validTypes = ["female", "agency"];
  if (!validTypes.includes(kycType)) {
    throw new Error("kycType must be one of: female, agency");
  }

  const res = await apiClient.post("/admin/users/review-kyc", {
    kycId,
    status,
    kycType,
  });

  return res.data;
}