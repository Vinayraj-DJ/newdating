import apiClient from "./apiClient";

/**
 * Update Coin to Rupee Conversion Rate
 * @param {number} coinToRupeeConversionRate
 */
export const updateCoinToRupeeConversionRate = async (
  coinToRupeeConversionRate
) => {
  const response = await apiClient.post(
    "/admin/config/coin-to-rupee-rate",
    {
      coinToRupeeConversionRate,
    }
  );

  return response.data;
};
