import React, { useState, useEffect } from 'react';
import { showCustomToast } from '../../../components/CustomToast/CustomToast';
import referralBonusService from '../../../services/referralBonusService';
import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import FormSection from '../../../components/FormSection/FormSection';
import FormActions from '../../../components/FormActions/FormActions';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import styles from './ReferralBonusConfiguration.module.css';

const ReferralBonusConfiguration = () => {
  const [referralBonus, setReferralBonus] = useState({
    femaleReferralBonus: '',
    agencyReferralBonus: '',
    maleReferralBonus: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetValue, setResetValue] = useState('');

  useEffect(() => {
    fetchReferralBonus();
  }, []);

  const fetchReferralBonus = async () => {
    try {
      setLoading(true);
      const response = await referralBonusService.getReferralBonus();
      
      if (response.success) {
        setReferralBonus(response.data);
      } else {
        showCustomToast(response.message || 'Failed to fetch referral bonus configuration');
      }
    } catch (error) {
      showCustomToast('Error fetching referral bonus configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReferralBonus(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await referralBonusService.updateReferralBonus(referralBonus);
      
      if (response.success) {
        showCustomToast(response.message || 'Referral bonus updated successfully');
        setIsEditing(false);
      } else {
        showCustomToast(response.message || 'Failed to update referral bonus');
      }
    } catch (error) {
      showCustomToast('Error updating referral bonus');
    } finally {
      setLoading(false);
    }
  };



  const handleUpdateSingle = async (bonusType) => {
    try {
      setLoading(true);
      const updateData = {};
      updateData[bonusType] = parseInt(referralBonus[bonusType]);
      
      const response = await referralBonusService.updateSpecificBonus(
        bonusType, 
        parseInt(referralBonus[bonusType])
      );
      
      if (response.success) {
        setReferralBonus(response.data);
        showCustomToast('Referral bonus updated successfully');
        setIsEditing(false);
      } else {
        showCustomToast(response.message || 'Failed to update referral bonus');
      }
    } catch (error) {
      showCustomToast('Error updating referral bonus');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToValue = () => {
    // Open the reset modal
    setResetValue('');
    setShowResetModal(true);
  };

  const handleConfirmReset = async () => {
    if (!resetValue.trim()) {
      showCustomToast('Please enter a valid value to reset to');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await referralBonusService.resetBonus(parseInt(resetValue));
      
      if (response.success) {
        setReferralBonus(response.data);
        showCustomToast('Referral bonuses reset successfully');
        setShowResetModal(false);
      } else {
        showCustomToast(response.message || 'Failed to reset referral bonuses');
      }
    } catch (error) {
      showCustomToast('Error resetting referral bonuses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchReferralBonus(); // Reset to original values
  };

  if (loading && !referralBonus.femaleReferralBonus) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.referralBonusConfig}>
      <FormSection title="Referral Bonus Configuration">
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="femaleReferralBonus">Female Referral Bonus</label>
              <InputField
                type="number"
                id="femaleReferralBonus"
                name="femaleReferralBonus"
                value={referralBonus.femaleReferralBonus}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter female referral bonus"
              />
            </div>
            {isEditing ? (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleUpdateSingle('femaleReferralBonus')}
                disabled={loading}
              >
                Update
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleResetToValue}
                disabled={loading}
              >
                Reset All
              </Button>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="agencyReferralBonus">Agency Referral Bonus</label>
              <InputField
                type="number"
                id="agencyReferralBonus"
                name="agencyReferralBonus"
                value={referralBonus.agencyReferralBonus}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter agency referral bonus"
              />
            </div>
            {isEditing ? (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleUpdateSingle('agencyReferralBonus')}
                disabled={loading}
              >
                Update
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleResetToValue}
                disabled={loading}
              >
                Reset All
              </Button>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="maleReferralBonus">Male Referral Bonus</label>
              <InputField
                type="number"
                id="maleReferralBonus"
                name="maleReferralBonus"
                value={referralBonus.maleReferralBonus}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter male referral bonus"
              />
            </div>
            {isEditing ? (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleUpdateSingle('maleReferralBonus')}
                disabled={loading}
              >
                Update
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleResetToValue}
                disabled={loading}
              >
                Reset All
              </Button>
            )}
          </div>

          <FormActions>
            {!isEditing ? (
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleEdit}
                disabled={loading}
              >
                Edit Configuration
              </Button>
            ) : (
              <>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save All Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </FormActions>
        </form>
      </FormSection>
      
      {showResetModal && (
        <div className={styles.modalOverlay} onClick={() => setShowResetModal(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Reset All Referral Bonuses</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Enter the value to reset all referral bonuses to:</p>
              <div className={styles.modalInputContainer}>
                <label htmlFor="resetValueInput" className={styles.modalInputLabel}>Reset Value:</label>
                <InputField
                  id="resetValueInput"
                  type="number"
                  value={resetValue}
                  onChange={(e) => setResetValue(e.target.value)}
                  placeholder="Enter reset value"
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.button} ${styles.cancelButton}`} 
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${styles.button} ${styles.confirmButton}`} 
                onClick={handleConfirmReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralBonusConfiguration;