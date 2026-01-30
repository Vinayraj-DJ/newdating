import React, { useEffect, useState } from 'react';
import referralBonusService from '../../../services/referralBonusService';
import { showCustomToast } from '../../../components/CustomToast/CustomToast';
import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import styles from './ReferralBonusConfiguration.module.css';

const ReferralBonusConfiguration = () => {
  const [values, setValues] = useState({
    femaleReferralBonus: '',
    agencyReferralBonus: '',
    maleReferralBonus: '',
  });
  
  const [originalValues, setOriginalValues] = useState({
    femaleReferralBonus: '',
    agencyReferralBonus: '',
    maleReferralBonus: '',
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await referralBonusService.getReferralBonus();
      if (res.success && res.data) {
        const data = {
          femaleReferralBonus: res.data.femaleReferralBonus || '',
          agencyReferralBonus: res.data.agencyReferralBonus || '',
          maleReferralBonus: res.data.maleReferralBonus || '',
        };
        setValues(data);
        setOriginalValues(data);
      }
    } catch (error) {
      console.error('Error loading referral bonus:', error);
      showCustomToast('Failed to load referral bonus configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAll = async () => {
    const requiredFields = ['femaleReferralBonus', 'agencyReferralBonus', 'maleReferralBonus'];
    const emptyFields = requiredFields.filter(field => !values[field]);
    
    if (emptyFields.length > 0) {
      showCustomToast('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      const dataToSend = {
        femaleReferralBonus: Number(values.femaleReferralBonus),
        agencyReferralBonus: Number(values.agencyReferralBonus),
        maleReferralBonus: Number(values.maleReferralBonus),
      };
      
      const res = await referralBonusService.setReferralBonus(dataToSend);
      
      if (res.success) {
        showCustomToast('Referral bonus configuration updated successfully');
        setEditing(false);
        setOriginalValues(values);
      } else {
        showCustomToast(res.message || 'Failed to update referral bonus');
      }
    } catch (error) {
      console.error('Error saving referral bonus:', error);
      showCustomToast('Failed to update referral bonus configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSingle = async (fieldName) => {
    if (!values[fieldName]) {
      showCustomToast(`${fieldName.replace(/([A-Z])/g, ' $1')} is required`);
      return;
    }
    
    try {
      setLoading(true);
      const dataToSend = {
        [fieldName]: Number(values[fieldName]),
      };
      
      const res = await referralBonusService.updateReferralBonus(dataToSend);
      
      if (res.success) {
        showCustomToast(`${fieldName.replace(/([A-Z])/g, ' $1')} updated successfully`);
        setOriginalValues(prev => ({
          ...prev,
          [fieldName]: values[fieldName]
        }));
      } else {
        showCustomToast(res.message || `Failed to update ${fieldName.replace(/([A-Z])/g, ' $1')}`);
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      showCustomToast(`Failed to update ${fieldName.replace(/([A-Z])/g, ' $1')}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setValues(originalValues);
    setEditing(false);
  };

  if (loading && !values.femaleReferralBonus) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading referral bonus configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Referral Bonus Configuration</h1>
          <p className={styles.subtitle}>Manage referral bonus amounts for different user types</p>
        </div>

        <div className={styles.content}>
          {/* Female Referral Bonus */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>
              <label htmlFor="femaleReferralBonus">Female Referral Bonus</label>
            </div>
            <div className={styles.fieldInput}>
              <InputField
                id="femaleReferralBonus"
                type="number"
                name="femaleReferralBonus"
                value={values.femaleReferralBonus}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter female referral bonus amount"
                className={styles.input}
              />
            </div>
            {editing && (
              <div className={styles.fieldAction}>
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateSingle('femaleReferralBonus')}
                  disabled={loading}
                  className={styles.updateBtn}
                >
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            )}
          </div>

          {/* Agency Referral Bonus */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>
              <label htmlFor="agencyReferralBonus">Agency Referral Bonus</label>
            </div>
            <div className={styles.fieldInput}>
              <InputField
                id="agencyReferralBonus"
                type="number"
                name="agencyReferralBonus"
                value={values.agencyReferralBonus}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter agency referral bonus amount"
                className={styles.input}
              />
            </div>
            {editing && (
              <div className={styles.fieldAction}>
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateSingle('agencyReferralBonus')}
                  disabled={loading}
                  className={styles.updateBtn}
                >
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            )}
          </div>

          {/* Male Referral Bonus */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>
              <label htmlFor="maleReferralBonus">Male Referral Bonus</label>
            </div>
            <div className={styles.fieldInput}>
              <InputField
                id="maleReferralBonus"
                type="number"
                name="maleReferralBonus"
                value={values.maleReferralBonus}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter male referral bonus amount"
                className={styles.input}
              />
            </div>
            {editing && (
              <div className={styles.fieldAction}>
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateSingle('maleReferralBonus')}
                  disabled={loading}
                  className={styles.updateBtn}
                >
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {!editing ? (
              <div className={styles.actionGroup}>
                <Button 
                  variant="primary" 
                  onClick={handleEdit}
                  disabled={loading}
                  className={styles.primaryBtn}
                >
                  Edit Configuration
                </Button>
              </div>
            ) : (
              <div className={styles.actionGroup}>
                <Button 
                  variant="primary" 
                  onClick={handleSaveAll}
                  disabled={loading}
                  className={styles.primaryBtn}
                >
                  {loading ? 'Saving...' : 'Save All Changes'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleCancel}
                  disabled={loading}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralBonusConfiguration;