import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUserTransactions = async (userId, operationType) => {
  const response = await API.get(
    `/admin/users/${userId}/transactions`,
    {
      params: { operationType },
    }
  );
  return response.data;
};
