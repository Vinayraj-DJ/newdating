import apiClient from "./apiClient";

export const toggleUserStatus = async ({
  userType,
  userId,
  status, // "active" or "inactive"
}) => {
  console.log("🚀 Calling toggleUserStatus API:", { userType, userId, status });
  
  const res = await apiClient.post(
    "/admin/users/toggle-status",
    {
      userType,
      userId,
      status,
    }
  );
  
  console.log("📡 API Response:", res?.data);
  
  if (res?.data?.success) {
    return res.data.data;
  }
  
  throw new Error(res?.data?.message || "Failed to update user status");
};
