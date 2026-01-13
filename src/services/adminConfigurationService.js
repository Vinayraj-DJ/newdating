import apiClient from "./apiClient";

/**
 * Update Admin Share Percentage
 * @param {number} adminSharePercentage
 */
export const updateAdminSharePercentage = async (adminSharePercentage) => {
  const response = await apiClient.post(
    "/admin/config/admin-share-percentage",
    {
      adminSharePercentage,
    }
  );

  return response.data;
};
