// // src/services/usersService.js
// import apiClient from "./apiClient";

// const BASE = "/admin/users";

// /* =====================================================
//    GET MALE USERS
//    GET /admin/users?type=male
// ===================================================== */
// export async function getMaleUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=male`, { signal });
//   const payload = res?.data;

//   if (payload?.success && Array.isArray(payload.data)) {
//     return payload.data;
//   }
//   return [];
// }

// /* =====================================================
//    GET FEMALE USERS
//    GET /admin/users?type=female
// ===================================================== */
// export async function getFemaleUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=female`, { signal });
//   const payload = res?.data;

//   if (payload?.success && Array.isArray(payload.data)) {
//     return payload.data;
//   }
//   return [];
// }

// /* =====================================================
//    GET AGENCY USERS
//    GET /admin/users?type=agency
// ===================================================== */
// export async function getAgencyUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=agency`, { signal });
//   const payload = res?.data;

//   if (payload?.success && Array.isArray(payload.data)) {
//     return payload.data;
//   }
//   return [];
// }

// /* =====================================================
//    GET ALL USERS (MALE + FEMALE + AGENCY)
//    GET /admin/users
//    Response:
//    {
//      success: true,
//      data: { males: [], females: [], agencies: [] }
//    }
// ===================================================== */
// export async function getAllUsers({ signal } = {}) {
//   const res = await apiClient.get(BASE, { signal });
//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data; // { males, females, agencies }
//   }

//   throw new Error("Failed to fetch users");
// }

// /* =====================================================
//    GET USER DETAILS BY TYPE + ID
//    GET /admin/users/:type/:id
// ===================================================== */
// export async function getUserDetails(userType, userId, { signal } = {}) {
//   if (!userType || !userId) {
//     throw new Error("userType and userId are required");
//   }

//   const res = await apiClient.get(
//     `${BASE}/${userType}/${userId}`,
//     { signal }
//   );

//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data;
//   }

//   throw new Error("User not found");
// }

// /* =====================================================
//    TOGGLE USER STATUS (ALL TYPES)
//    POST /admin/users/toggle-status
// ===================================================== */
// export async function toggleUserStatus(
//   { userType, userId, status },
//   { signal } = {}
// ) {
//   if (!userType || !userId || !status) {
//     throw new Error("Missing userType, userId or status");
//   }

//   const res = await apiClient.post(
//     `${BASE}/toggle-status`,
//     { userType, userId, status },
//     { signal }
//   );

//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data;
//   }

//   throw new Error("Failed to update user status");
// }

// /* =====================================================
//    HELPERS
// ===================================================== */
// export const activateUser = (opts, ctx) =>
//   toggleUserStatus({ ...opts, status: "active" }, ctx);

// export const deactivateUser = (opts, ctx) =>
//   toggleUserStatus({ ...opts, status: "inactive" }, ctx);








// import apiClient from "./apiClient";

// const BASE = "/admin/users";

// /* =====================================================
//    GET MALE USERS
//    GET /admin/users?type=male
// ===================================================== */
// export async function getMaleUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=male`, { signal });
//   const payload = res?.data;

//   return payload?.success && Array.isArray(payload.data)
//     ? payload.data
//     : [];
// }

// /* =====================================================
//    GET FEMALE USERS
//    GET /admin/users?type=female
// ===================================================== */
// export async function getFemaleUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=female`, { signal });
//   const payload = res?.data;

//   return payload?.success && Array.isArray(payload.data)
//     ? payload.data
//     : [];
// }

// /* =====================================================
//    GET AGENCY USERS
//    GET /admin/users?type=agency
// ===================================================== */
// export async function getAgencyUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=agency`, { signal });
//   const payload = res?.data;

//   return payload?.success && Array.isArray(payload.data)
//     ? payload.data
//     : [];
// }

// /* =====================================================
//    GET ALL USERS (MALE + FEMALE + AGENCY)
//    GET /admin/users
// ===================================================== */
// export async function getAllUsers({ signal } = {}) {
//   const res = await apiClient.get(BASE, { signal });
//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data; // { males, females, agencies }
//   }

//   throw new Error(payload?.message || "Failed to fetch users");
// }

// /* =====================================================
//    GET USER DETAILS BY TYPE + ID
//    GET /admin/users/:type/:id
// ===================================================== */
// export async function getUserDetails(
//   userType,
//   userId,
//   { signal } = {}
// ) {
//   if (!userType || !userId) {
//     throw new Error("userType and userId are required");
//   }

//   const res = await apiClient.get(
//     `${BASE}/${userType}/${userId}`,
//     { signal }
//   );

//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data;
//   }

//   throw new Error(payload?.message || "User not found");
// }

// /* =====================================================
//    TOGGLE USER STATUS (MALE / FEMALE / AGENCY)
//    POST /admin/users/toggle-status
// ===================================================== */
// export async function toggleUserStatus(
//   { userType, userId, status },
//   { signal } = {}
// ) {
//   if (!userType || !userId) {
//     throw new Error("userType and userId are required");
//   }

//   if (!["active", "inactive"].includes(status)) {
//     throw new Error("status must be 'active' or 'inactive'");
//   }

//   const res = await apiClient.post(
//     `${BASE}/toggle-status`,
//     {
//       userType,
//       userId,
//       status,
//     },
//     { signal }
//   );

//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data; // updated user
//   }

//   throw new Error(payload?.message || "Failed to update user status");
// }

// /* =====================================================
//    HELPERS (OPTIONAL BUT CLEAN)
// ===================================================== */
// export const activateUser = (opts, ctx) =>
//   toggleUserStatus({ ...opts, status: "active" }, ctx);

// export const deactivateUser = (opts, ctx) =>
//   toggleUserStatus({ ...opts, status: "inactive" }, ctx);











// import apiClient from "./apiClient";

// const BASE = "/admin/users";

// /* ===============================
//    LIST APIs (UNCHANGED)
// ================================ */

// export async function getMaleUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=male`, { signal });
//   return res?.data?.success ? res.data.data : [];
// }

// export async function getFemaleUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=female`, { signal });
//   return res?.data?.success ? res.data.data : [];
// }

// export async function getAgencyUsers({ signal } = {}) {
//   const res = await apiClient.get(`${BASE}?type=agency`, { signal });
//   return res?.data?.success ? res.data.data : [];
// }

// /* ===============================
//    ✅ SINGLE USER (FRONTEND ONLY)
// ================================ */

// export async function getUserByIdFromList(
//   { userType, userId },
//   { signal } = {}
// ) {
//   if (!userType || !userId) {
//     throw new Error("userType and userId are required");
//   }

//   const res = await apiClient.get(BASE, {
//     params: { type: userType },
//     signal,
//   });

//   const payload = res?.data;

//   if (!payload?.success || !Array.isArray(payload.data)) {
//     throw new Error("Invalid API response");
//   }

//   const user = payload.data.find((u) => u._id === userId);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   return {
//     ...user,
//     userType,
//     name:
//       userType === "agency"
//         ? user.agencyName
//         : `${user.firstName || ""} ${user.lastName || ""}`.trim(),
//   };
// }

// /* =====================================================
//    GET ALL USERS (MALE + FEMALE + AGENCY)
//    GET /admin/users
// ===================================================== */
// export async function getAllUsers({ signal } = {}) {
//   const res = await apiClient.get(BASE, { signal });
//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data; // { males, females, agencies }
//   }

//   throw new Error(payload?.message || "Failed to fetch users");
// }

// /* =====================================================
//    GET USER DETAILS BY TYPE + ID
//    GET /admin/users/:type/:id
// ===================================================== */
// export async function getUserDetails(
//   userType,
//   userId,
//   { signal } = {}
// ) {
//   if (!userType || !userId) {
//     throw new Error("userType and userId are required");
//   }

//   const res = await apiClient.get(
//     `${BASE}/${userType}/${userId}`,
//     { signal }
//   );

//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data;
//   }

//   throw new Error(payload?.message || "User not found");
// }

// /* =====================================================
//    TOGGLE USER STATUS (MALE / FEMALE / AGENCY)
//    POST /admin/users/toggle-status
// ===================================================== */
// export async function toggleUserStatus(
//   { userType, userId, status },
//   { signal } = {}
// ) {
//   if (!userType || !userId) {
//     throw new Error("userType and userId are required");
//   }

//   if (!["active", "inactive"].includes(status)) {
//     throw new Error("status must be 'active' or 'inactive'");
//   }

//   const res = await apiClient.post(
//     `${BASE}/toggle-status`,
//     {
//       userType,
//       userId,
//       status,
//     },
//     { signal }
//   );

//   const payload = res?.data;

//   if (payload?.success && payload.data) {
//     return payload.data; // updated user
//   }

//   throw new Error(payload?.message || "Failed to update user status");
// }

// /* =====================================================
//    HELPERS (OPTIONAL BUT CLEAN)
// ===================================================== */
// export const activateUser = (opts, ctx) =>
//   toggleUserStatus({ ...opts, status: "active" }, ctx);

// export const deactivateUser = (opts, ctx) =>
//   toggleUserStatus({ ...opts, status: "inactive" }, ctx);











import apiClient from "./apiClient";

const BASE = "/admin/users";

/* =====================================================
   LIST USERS
===================================================== */

export async function getMaleUsers({ signal } = {}) {
  const res = await apiClient.get(`${BASE}?type=male`, { signal });
  return res?.data?.success ? res.data.data : [];
}

export async function getFemaleUsers({ signal } = {}) {
  const res = await apiClient.get(`${BASE}?type=female`, { signal });
  return res?.data?.success ? res.data.data : [];
}

export async function getAgencyUsers({ signal } = {}) {
  const res = await apiClient.get(`${BASE}?type=agency`, { signal });
  return res?.data?.success ? res.data.data : [];
}

/* =====================================================
   GET ALL USERS (USED BY AllUserList.jsx)
===================================================== */
export async function getAllUsers({ signal } = {}) {
  const [males, females, agencies] = await Promise.all([
    getMaleUsers({ signal }),
    getFemaleUsers({ signal }),
    getAgencyUsers({ signal }),
  ]);

  return {
    males,
    females,
    agencies,
  };
}

/* =====================================================
   ✅ SINGLE USER (FRONTEND-ONLY SAFE)
   (Keeps old name getUserDetails)
===================================================== */
export async function getUserDetails(
  userType,
  userId,
  { signal } = {}
) {
  if (!userType || !userId) {
    throw new Error("userType and userId are required");
  }

  const res = await apiClient.get(BASE, {
    params: { type: userType },
    signal,
  });

  const payload = res?.data;

  if (!payload?.success || !Array.isArray(payload.data)) {
    throw new Error("Invalid API response");
  }

  const user = payload.data.find((u) => u._id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    userType,
    name:
      userType === "agency"
        ? user.agencyName
        : `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  };
}

/* =====================================================
   TOGGLE USER STATUS (UNCHANGED)
===================================================== */
export async function toggleUserStatus(
  { userType, userId, status },
  { signal } = {}
) {
  if (!userType || !userId) {
    throw new Error("userType and userId are required");
  }

  const res = await apiClient.post(
    `${BASE}/toggle-status`,
    {
      userType,
      userId,
      status,
    },
    { signal }
  );

  if (res?.data?.success) {
    return res.data.data;
  }

  throw new Error(res?.data?.message || "Failed to update status");
}

/* =====================================================
   OPTIONAL HELPERS (USED IN LISTS)
===================================================== */
export const activateUser = (opts, ctx) =>
  toggleUserStatus({ ...opts, status: "active" }, ctx);

export const deactivateUser = (opts, ctx) =>
  toggleUserStatus({ ...opts, status: "inactive" }, ctx);

/* =====================================================
   DELETE USER (BY TYPE AND ID)
===================================================== */
export async function deleteUser(
  { userType, userId },
  { signal } = {}
) {
  if (!userType || !userId) {
    throw new Error("userType and userId are required");
  }

  const res = await apiClient.delete(
    `${BASE}/${userType}/${userId}`,
    { signal }
  );

  if (res?.data?.success) {
    return res.data;
  }

  throw new Error(res?.data?.message || "Failed to delete user");
}