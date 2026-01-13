import { API_BASE } from '../config/apiConfig';

const referralBonusService = {
  // Get referral bonus configuration
  getReferralBonus: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/config/referral-bonus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching referral bonus:', error);
      throw error;
    }
  },

  // Update referral bonus configuration (POST)
  updateReferralBonus: async (referralBonusData) => {
    try {
      const response = await fetch(`${API_BASE}/admin/config/referral-bonus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(referralBonusData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating referral bonus:', error);
      throw error;
    }
  },

  // Update specific bonus type (PUT)
  updateSpecificBonus: async (bonusType, bonusValue) => {
    try {
      const response = await fetch(`${API_BASE}/admin/config/referral-bonus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          [bonusType]: bonusValue
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating specific bonus:', error);
      throw error;
    }
  },

  // Reset bonus to specific value (DELETE)
  resetBonus: async (bonusValue) => {
    try {
      const response = await fetch(`${API_BASE}/admin/config/referral-bonus`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bonus: bonusValue })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error resetting bonus:', error);
      throw error;
    }
  },
};

export default referralBonusService;