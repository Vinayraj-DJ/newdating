import apiClient from "./apiClient";

/**
 * Get All Admin Operation Configurations
 */
export const getAdminOperationConfig = async () => {
  const res = await apiClient.get("/admin/config");
  return res.data;
};
