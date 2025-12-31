import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const toggleUserStatus = async ({
  userType,
  userId,
  isActive, // boolean
}) => {
  return axios.post(
    `${BASE_URL}/admin/users/toggle-status`,
    {
      userType,
      userId,
      isActive, // ✅ backend expects boolean
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
    }
  );
};
