import apiClient from "./apiClient";

/**
 * Get All Admin Configurations
 */
export const getAllAdminConfig = async () => {
  const res = await apiClient.get("/admin/config");
  return res.data;
};
