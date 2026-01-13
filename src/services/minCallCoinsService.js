import apiClient from "./apiClient";

/**
 * Update Minimum Call Coins Requirement
 */
export const updateMinCallCoins = async (minCallCoins) => {
  const res = await apiClient.post(
    "/admin/config/min-call-coins",
    {
      minCallCoins,
    }
  );

  return res.data;
};
