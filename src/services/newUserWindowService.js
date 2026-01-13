import apiClient from "./apiClient";

/**
 * Update New User Window (Days)
 */
export const updateNewUserWindowDays = async (newUserWindowDays) => {
  const res = await apiClient.post(
    "/admin/config/new-user-window",
    {
      newUserWindowDays,
    }
  );

  return res.data;
};
