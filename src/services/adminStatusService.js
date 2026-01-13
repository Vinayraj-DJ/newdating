import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const toggleUserStatus = async ({
  userType,
  userId,
  status, // "active" or "inactive"
}) => {
  return axios.post(
    `${BASE_URL}/admin/users/toggle-status`,
    {
      userType,
      userId,
      status, // ✅ backend expects "active" or "inactive"
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
    }
  );
};
