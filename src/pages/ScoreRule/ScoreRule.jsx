// src/pages/ScoreRule/ScoreRule.jsx
import React, { useState, useEffect } from 'react';
import styles from './ScoreRule.module.css';
import { scoreRuleService } from '../../services/scoreRuleService';
import DynamicTable from '../../components/DynamicTable/DynamicTable';
import { showCustomToast, ToastContainerCustom } from '../../components/CustomToast/CustomToast';
import UserScoreHistory from '../../components/UserScoreHistory/UserScoreHistory';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const ScoreRule = () => {
  const [scoreRules, setScoreRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null); // Track the rule being edited
  const [newRule, setNewRule] = useState({
    ruleName: '',
    ruleType: '',
    scoreValue: '',
    minCount: '',
    requiredDays: '7'  // Default to 7 days
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('rules'); // 'rules', 'user-history'
  const [userIdInput, setUserIdInput] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  // Define table columns
  const columns = [
    {
      key: 'ruleType',
      label: 'Rule Type',
      render: (value) => (
        <span className={styles.ruleType}>{value}</span>
      ),
    },
    {
      key: 'scoreValue',
      label: 'Score Value',
      render: (value) => (
        <span className={styles.scoreValue}>{value}</span>
      ),
    },
    {
      key: 'minCount',
      label: 'Min Count',
      render: (value) => (
        <span className={styles.minCount}>
          {value !== null && value !== undefined ? value : 'N/A'}
        </span>
      ),
    },
    {
      key: 'requiredDays',
      label: 'Required Days',
      render: (value) => (
        <span className={styles.requiredDays}>{value}</span>
      ),
    },
    {
      key: "_id",
      label: "Actions",
      render: (_, row) => (
        <div className={styles.actions}>
          <FaEdit
            className={styles.editIcon}
            title="Edit"
            onClick={() => handleEdit(row)}
          />
          <FaTrash
            className={styles.deleteIcon}
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  // Fetch score rules
  const fetchScoreRules = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching score rules from API...');
      const data = await scoreRuleService.getAllScoreRules();
      
      console.log('✅ API Response received:', {
        isArray: Array.isArray(data),
        length: data?.length || 0,
        sample: data?.[0]
      });
      
      const rulesArray = Array.isArray(data) ? data : [];
      console.log('🔄 Setting rules in state:', rulesArray.length, 'rules');
      console.log('📋 First 3 rules:', rulesArray.slice(0, 3));
      
      setScoreRules(prevRules => {
        console.log('🔄 Previous rules:', prevRules.length);
        console.log('🔄 New rules:', rulesArray.length);
        return rulesArray;
      });
      
      console.log('📊 Rules set in state:', rulesArray.length, 'rules');
      
      if (rulesArray.length === 0) {
        console.warn('⚠️ No rules found in API response');
      }
      
    } catch (err) {
      console.error('❌ Error fetching score rules:', err);
      console.error('Error response:', err?.response?.data);
      
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch score rules');
      showCustomToast('Error fetching score rules', 'error');
      setScoreRules([]); // Ensure empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch user score history
  const fetchUserScoreHistory = async () => {
    if (!userIdInput.trim()) {
      showCustomToast('Please enter a user ID', 'error');
      return;
    }

    try {
      setHistoryLoading(true);
      // This will trigger the UserScoreHistory component to fetch the data
      // We don't need to do anything here since the component handles the API call
    } catch (err) {
      console.error('Error fetching user score history:', err);
      showCustomToast('Error fetching user score history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!newRule.ruleName.trim()) {
      errors.ruleName = 'Rule name is required';
    }
    
    if (!newRule.ruleType.trim()) {
      errors.ruleType = 'Rule type is required';
    }
    
    if (!newRule.scoreValue) {
      errors.scoreValue = 'Score value is required';
    } else if (isNaN(newRule.scoreValue) || Number(newRule.scoreValue) <= 0) {
      errors.scoreValue = 'Score value must be a positive number';
    }
    
    if (newRule.minCount !== '' && newRule.minCount !== null && newRule.minCount !== undefined && (isNaN(newRule.minCount) || Number(newRule.minCount) < 0)) {
      errors.minCount = 'Min count must be a non-negative number';
    }
    
    if (!newRule.requiredDays) {
      errors.requiredDays = 'Required days is required';
    } else if (isNaN(newRule.requiredDays) || Number(newRule.requiredDays) <= 0) {
      errors.requiredDays = 'Required days must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRule(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const payload = {
        ruleName: newRule.ruleName,
        ruleType: newRule.ruleType,
        scoreValue: Number(newRule.scoreValue),
        minCount: newRule.minCount !== '' ? Number(newRule.minCount) : null,
        requiredDays: Number(newRule.requiredDays)
      };
      
      let result;
      if (editingRuleId) {
        // Update existing rule
        result = await scoreRuleService.updateScoreRule(editingRuleId, payload);
        
        // Update the rule in the list
        setScoreRules(prev => 
          prev.map(rule => 
            rule._id === editingRuleId ? { ...rule, ...result } : rule
          )
        );
        
        showCustomToast('Score rule updated successfully', 'success');
      } else {
        // Create new rule
        result = await scoreRuleService.createScoreRule(payload);
        
        // Add the new rule to the list
        // Ensure result has required fields
        const newRuleData = {
          _id: result?._id || Date.now().toString(),
          ruleType: result?.ruleType || payload.ruleType,
          scoreValue: result?.scoreValue || payload.scoreValue,
          minCount: result?.minCount !== undefined ? result.minCount : payload.minCount,
          requiredDays: result?.requiredDays || payload.requiredDays,
          isActive: result?.isActive !== undefined ? result.isActive : true,
          createdAt: result?.createdAt || new Date().toISOString(),
          updatedAt: result?.updatedAt || new Date().toISOString(),
          ...result
        };
        
        setScoreRules(prev => [newRuleData, ...prev]);
        
        showCustomToast('Score rule created successfully', 'success');
      }
      
      // Reset form and editing state
      setNewRule({ ruleName: '', ruleType: '', scoreValue: '', minCount: '', requiredDays: '7' });
      setEditingRuleId(null);
      setIsAddingRule(false); // Close the form after successful submission
    } catch (err) {
      console.error('Error processing score rule:', err);
      console.error('Request payload:', payload);
      console.error('Response data:', err?.response?.data);
      
      const errorMessage = err?.response?.data?.message || err?.message || (editingRuleId ? 'Failed to update score rule' : 'Failed to create score rule');
      setError(errorMessage);
      showCustomToast(errorMessage, 'error');
      
      // Refresh data to ensure UI consistency
      await fetchScoreRules();
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle add rule form
  const toggleAddRuleForm = () => {
    setIsAddingRule(!isAddingRule);
    if (!isAddingRule) {
      // If we're closing the form, reset everything
      setNewRule({ ruleName: '', ruleType: '', scoreValue: '', minCount: '', requiredDays: '7' });
      setEditingRuleId(null);
    }
    // Reset form errors when toggling
    setFormErrors({});
  };

  // Handle edit rule
  const handleEdit = (rule) => {
    // Set the form fields with the rule data for editing
    setNewRule({
      ruleName: rule.ruleName || rule.ruleType,
      ruleType: rule.ruleType,
      scoreValue: rule.scoreValue,
      minCount: rule.minCount !== null && rule.minCount !== undefined ? rule.minCount : '',
      requiredDays: rule.requiredDays !== null && rule.requiredDays !== undefined ? rule.requiredDays : '7'
    });
    setEditingRuleId(rule._id); // Set the rule ID being edited
    setIsAddingRule(true); // Show the form in edit mode
    showCustomToast('Edit functionality prepared - form filled with rule data', 'info');
  };

  // Handle delete rule


  // Handle delete with confirmation modal
  const handleDelete = (rule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!ruleToDelete) return;
    
    try {
      // Call the actual API to delete the rule
      await scoreRuleService.deleteScoreRule(ruleToDelete._id);
      
      // Remove the rule from the list
      setScoreRules(prev => prev.filter(r => r._id !== ruleToDelete._id));
      
      showCustomToast('Score rule deleted successfully', 'success');
      
      // Refresh the data to ensure consistency
      await fetchScoreRules();
    } catch (err) {
      console.error('Error deleting score rule:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete score rule';
      showCustomToast(errorMessage, 'error');
    } finally {
      setShowDeleteModal(false);
      setRuleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRuleToDelete(null);
  };

  useEffect(() => {
    fetchScoreRules();
  }, []);

  // Debug effect to monitor scoreRules state
  useEffect(() => {
    console.log('🔍 scoreRules state updated:', scoreRules.length, 'rules');
    if (scoreRules.length > 0) {
      console.log('🔍 Sample rule:', scoreRules[0]);
    }
  }, [scoreRules]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Score Rules</h2>
        <p className={styles.description}>Manage scoring rules for user activities</p>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'rules' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Score Rules
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'user-history' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('user-history')}
          >
            User Score History
          </button>
        </div>
      </div>
      
      {activeTab === 'rules' && (
        <>
          {isAddingRule && (
            <div className={styles.addRuleFormContainer}>
              <form onSubmit={handleSubmit} className={styles.addRuleForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="ruleName">Rule Name *</label>
                    <input
                      type="text"
                      id="ruleName"
                      name="ruleName"
                      value={newRule.ruleName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${formErrors.ruleName ? styles.inputError : ''}`}
                      placeholder="Enter rule name"
                    />
                    {formErrors.ruleName && (
                      <span className={styles.errorText}>{formErrors.ruleName}</span>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="ruleType">Rule Type *</label>
                    <select
                      id="ruleType"
                      name="ruleType"
                      value={newRule.ruleType}
                      onChange={handleInputChange}
                      className={`${styles.input} ${formErrors.ruleType ? styles.inputError : ''}`}
                    >
                      <option value="">Select rule type</option>
                      <option value="DAILY_LOGIN">Daily Login</option>
                      <option value="DAILY_VIDEO_CALL_TARGET">Daily Video Call Target</option>
                      <option value="DAILY_AUDIO_CALL_TARGET">Daily Audio Call Target</option>
                      <option value="WEEKLY_CONSISTENCY">Weekly Consistency</option>
                    </select>
                    {formErrors.ruleType && (
                      <span className={styles.errorText}>{formErrors.ruleType}</span>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="scoreValue">Score Value *</label>
                    <input
                      type="number"
                      id="scoreValue"
                      name="scoreValue"
                      value={newRule.scoreValue}
                      onChange={handleInputChange}
                      className={`${styles.input} ${formErrors.scoreValue ? styles.inputError : ''}`}
                      placeholder="Enter score value"
                      min="1"
                    />
                    {formErrors.scoreValue && (
                      <span className={styles.errorText}>{formErrors.scoreValue}</span>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="minCount">Min Count</label>
                    <input
                      type="number"
                      id="minCount"
                      name="minCount"
                      value={newRule.minCount}
                      onChange={handleInputChange}
                      className={`${styles.input} ${formErrors.minCount ? styles.inputError : ''}`}
                      placeholder="Enter minimum count (optional)"
                      min="0"
                    />
                    {formErrors.minCount && (
                      <span className={styles.errorText}>{formErrors.minCount}</span>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="requiredDays">Required Days *</label>
                    <input
                      type="number"
                      id="requiredDays"
                      name="requiredDays"
                      value={newRule.requiredDays}
                      onChange={handleInputChange}
                      className={`${styles.input} ${formErrors.requiredDays ? styles.inputError : ''}`}
                      placeholder="Enter required days"
                      min="1"
                    />
                    {formErrors.requiredDays && (
                      <span className={styles.errorText}>{formErrors.requiredDays}</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={styles.submitButton}
                  >
                    {submitting ? (editingRuleId ? 'Updating...' : 'Creating...') : (editingRuleId ? 'Update Rule' : 'Create Rule')}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className={styles.buttonContainer}>
            <button 
              className={styles.addButton}
              onClick={toggleAddRuleForm}
            >
              {editingRuleId ? 'Cancel Edit' : (isAddingRule ? 'Cancel' : 'Add New Rule')}
            </button>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              Loading score rules...
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <DynamicTable
                data={scoreRules}
                columns={columns}
                loading={loading}
                error={error}
                onRefresh={fetchScoreRules}
                showActions={true}
              />
            </div>
          )}
        </>
      )}

      {activeTab === 'user-history' && (
        <div className={styles.userHistorySection}>
          <div className={styles.userHistoryControls}>
            <input
              type="text"
              placeholder="Enter user ID (e.g., 695b47d9a40ac5f37a018fe2)"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className={styles.userIdInput}
            />
            <button 
              className={styles.loadHistoryButton}
              onClick={fetchUserScoreHistory}
              disabled={historyLoading}
            >
              {historyLoading ? 'Loading...' : 'Load History'}
            </button>
          </div>
          
          <div className={styles.userHistoryContent}>
            <UserScoreHistory userId={userIdInput || undefined} />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Score Rule"
        message={`Are you sure you want to delete the rule '${ruleToDelete?.ruleType || '{rule}'}'? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ToastContainerCustom />
    </div>
  );
};

export default ScoreRule;