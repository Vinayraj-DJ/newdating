import apiClient from "./apiClient";

export const getAllLevelConfigs = async () => {
  const res = await apiClient.get("/admin/users/level-config");
  return res.data;
};

export const createLevelConfig = async (payload) => {
  const res = await apiClient.post("/admin/users/level-config", payload);
  return res.data;
};

export const updateLevelConfig = async (id, payload) => {
  const res = await apiClient.put(`/admin/users/level-config/${id}`, payload);
  return res.data;
};

export const deleteLevelConfig = async (id) => {
  const res = await apiClient.delete(`/admin/users/level-config/${id}`);
  return res.data;
};
