// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export const reviewAgencyRegistration = async ({
//   userId,
//   reviewStatus,
// }) => {
//   return axios.post(
//     `${BASE_URL}/admin/users/review-registration`,
//     {
//       userType: "agency",
//       userId,
//       reviewStatus, // "accepted" | "rejected"
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// export const reviewFemaleUserRegistration = async ({
//   userId,
//   reviewStatus,
// }) => {
//   return axios.post(
//     `${BASE_URL}/admin/users/review-registration`,
//     {
//       userType: "female",
//       userId,
//       reviewStatus, // "accepted" | "rejected"
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };











// src/services/adminReviewService.js
import apiClient from "./apiClient";
import { userNotificationService } from "./userNotificationService";

/**
 * Review User Registration (General function)
 * POST /admin/users/review-registration
 */
export const reviewUserRegistration = async ({
  userId,
  reviewStatus,
  userType,
  message = null
}) => {
  if (!userId || !reviewStatus || !userType) {
    throw new Error("userId, reviewStatus, and userType are required");
  }

  const validUserTypes = ["male", "female", "agency"];
  if (!validUserTypes.includes(userType)) {
    throw new Error("userType must be one of: male, female, agency");
  }

  const validReviewStatuses = ["accepted", "rejected"];
  if (!validReviewStatuses.includes(reviewStatus)) {
    throw new Error("reviewStatus must be either: accepted, rejected");
  }

  const res = await apiClient.post("/admin/users/review-registration", {
    userType,
    userId,
    reviewStatus,
  });

  

  return res.data;
};

/**
 * Review Agency Registration
 * POST /admin/users/review-registration
 */
export const reviewAgencyRegistration = async ({
  userId,
  reviewStatus,
  message = null
}) => {
  if (!userId || !reviewStatus) {
    throw new Error("userId and reviewStatus are required");
  }

  const res = await apiClient.post("/admin/users/review-registration", {
    userType: "agency",
    userId,
    reviewStatus, // "accepted" | "rejected"
  });

  

  return res.data;
};

/**
 * Review Female User Registration
 * POST /admin/users/review-registration
 */
export const reviewFemaleUserRegistration = async ({
  userId,
  reviewStatus,
  message = null
}) => {
  if (!userId || !reviewStatus) {
    throw new Error("userId and reviewStatus are required");
  }

  const res = await apiClient.post("/admin/users/review-registration", {
    userType: "female",
    userId,
    reviewStatus,
  });

  

  return res.data;
};

/**
 * Review Male User Registration
 * POST /admin/users/review-registration
 */
export const reviewMaleUserRegistration = async ({
  userId,
  reviewStatus,
  message = null
}) => {
  if (!userId || !reviewStatus) {
    throw new Error("userId and reviewStatus are required");
  }

  const res = await apiClient.post("/admin/users/review-registration", {
    userType: "male",
    userId,
    reviewStatus, // "accepted" | "rejected"
  });

  

  return res.data;
};
