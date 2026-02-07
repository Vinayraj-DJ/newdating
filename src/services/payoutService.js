// import apiClient from './apiClient';

// export const payoutService = {
//   // Get all withdrawal requests
//   getAllPayouts: () => {
//     return apiClient.get('/admin/payouts');
//   },

//   // Approve a payout request
//   approvePayout: (payoutId) => {
//     return apiClient.post(`/admin/payouts/${payoutId}/approve`);
//   },

//   // Reject a payout request
//   rejectPayout: (payoutId) => {
//     return apiClient.post(`/admin/payouts/${payoutId}/reject`);
//   },

//   // Complete a payout request
//   completePayout: (payoutId) => {
//     return apiClient.post(`/admin/payouts/${payoutId}/complete`);
//   },
// };







import apiClient from './apiClient';

export const payoutService = {
  // Get all withdrawal requests
  getAllPayouts: () => {
    return apiClient.get('/admin/withdrawals');
  },

  // Approve withdrawal
  approvePayout: (withdrawalId) => {
    return apiClient.post(`/admin/withdrawals/${withdrawalId}/approve`);
  },

  // Reject withdrawal
  rejectPayout: (withdrawalId) => {
    return apiClient.post(`/admin/withdrawals/${withdrawalId}/reject`);
  },

  // Complete withdrawal
  completePayout: (withdrawalId) => {
    return apiClient.post(`/admin/withdrawals/${withdrawalId}/complete`);
  },
};
