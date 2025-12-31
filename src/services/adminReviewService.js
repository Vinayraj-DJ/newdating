import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const reviewAgencyRegistration = async ({
  userId,
  reviewStatus,
}) => {
  return axios.post(
    `${BASE_URL}/admin/users/review-registration`,
    {
      userType: "agency",
      userId,
      reviewStatus, // "accepted" | "rejected"
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const reviewFemaleUserRegistration = async ({
  userId,
  reviewStatus,
}) => {
  return axios.post(
    `${BASE_URL}/admin/users/review-registration`,
    {
      userType: "female",
      userId,
      reviewStatus, // "accepted" | "rejected"
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
    }
  );
};
