import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUserDetails = async (userType, userId) => {
  const res = await API.get(`/users/${userType}/${userId}`);
  return res.data;
};
