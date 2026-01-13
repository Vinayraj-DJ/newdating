import apiClient from "./apiClient";

/**
 * Update Minimum Withdrawal Amount
 */
export const updateMinWithdrawalAmount = async (minWithdrawalAmount) => {
  const res = await apiClient.post(
    "/admin/config/min-withdrawal-amount",
    {
      minWithdrawalAmount,
    }
  );

  return res.data;
};
