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

/**
 * Review Agency Registration
 * POST /admin/users/review-registration
 */
export const reviewAgencyRegistration = async ({
  userId,
  reviewStatus,
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
