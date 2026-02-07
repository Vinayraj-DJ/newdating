import apiClient from "./apiClient";

/**
 * Get pending registrations
 * GET /admin/users/pending-registrations
 * 
 * Response format:
 * {
 *   "success": true,
 *   "data": {
 *     "females": [...],
 *     "agencies": [...]
 *   }
 * }
 */
export async function getPendingRegistrations({ signal } = {}) {
  try {
    const res = await apiClient.get("/admin/users/pending-registrations", { signal });
    
    if (res?.data?.success && res.data.data) {
      return {
        females: res.data.data.females || [],
        agencies: res.data.data.agencies || []
      };
    }
    
    // Fallback if unexpected format
    return { females: [], agencies: [] };
  } catch (error) {
    console.error("Error fetching pending registrations:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch pending registrations");
  }
}

/**
 * Review user registration
 * POST /admin/users/review-registration
 * 
 * @param {Object} params
 * @param {string} params.userId - User ID to review
 * @param {string} params.userType - "female" | "male" | "agency"
 * @param {string} params.reviewStatus - "accepted" | "rejected"
 * @param {string} [params.rejectionReason] - Reason for rejection (optional)
 */
export async function reviewRegistration({ userId, userType, reviewStatus, rejectionReason }) {
  if (!userId || !userType || !reviewStatus) {
    throw new Error("userId, userType, and reviewStatus are required");
  }

  const validUserTypes = ["male", "female", "agency"];
  if (!validUserTypes.includes(userType)) {
    throw new Error("userType must be one of: male, female, agency");
  }

  const validReviewStatuses = ["accepted", "rejected"];
  if (!validReviewStatuses.includes(reviewStatus)) {
    throw new Error("reviewStatus must be either: accepted, rejected");
  }

  try {
    const requestBody = {
      userType,
      userId,
      reviewStatus,
    };
    
    // Add rejectionReason only if provided and status is rejected
    if (rejectionReason && reviewStatus === "rejected") {
      requestBody.rejectionReason = rejectionReason;
    }
    
    const res = await apiClient.post("/admin/users/review-registration", requestBody);
    
    return res.data;
  } catch (error) {
    console.error("Error reviewing registration:", error);
    throw new Error(error.response?.data?.message || `Failed to ${reviewStatus} registration`);
  }
}