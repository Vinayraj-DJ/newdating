// src/pages/ScoreRule/ScoreRule.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ScoreRule.module.css';
import { scoreRuleService } from '../../services/scoreRuleService';
import { showCustomToast, ToastContainerCustom } from '../../components/CustomToast/CustomToast';
import UserScoreHistory from '../../components/UserScoreHistory/UserScoreHistory';
import { FaEdit, FaTrash, FaPlus, FaHistory, FaCog, FaCheckCircle, FaStar, FaClock, FaTrophy } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const ScoreRule = () => {
  const [scoreRules, setScoreRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [newRule, setNewRule] = useState({
    ruleName: '',
    ruleType: '',
    scoreValue: '',
    minCount: '',
    requiredDays: '7'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const [userIdInput, setUserIdInput] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const fetchScoreRules = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await scoreRuleService.getAllScoreRules();
      setScoreRules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch score rules');
      showCustomToast('Error fetching score rules', 'error');
      setScoreRules([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newRule.ruleName.trim()) errors.ruleName = 'Rule name is required';
    if (!newRule.ruleType.trim()) errors.ruleType = 'Rule type is required';
    if (!newRule.scoreValue) errors.scoreValue = 'Score value is required';
    else if (isNaN(newRule.scoreValue) || Number(newRule.scoreValue) <= 0) errors.scoreValue = 'Must be positive';
    if (newRule.minCount !== '' && newRule.minCount !== null && (isNaN(newRule.minCount) || Number(newRule.minCount) < 0)) errors.minCount = 'Must be ≥ 0';
    if (!newRule.requiredDays) errors.requiredDays = 'Required days is required';
    else if (isNaN(newRule.requiredDays) || Number(newRule.requiredDays) <= 0) errors.requiredDays = 'Must be positive';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRule(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

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

      if (editingRuleId) {
        const result = await scoreRuleService.updateScoreRule(editingRuleId, payload);
        setScoreRules(prev => prev.map(rule => rule._id === editingRuleId ? { ...rule, ...result } : rule));
        showCustomToast('Score rule updated successfully', 'success');
      } else {
        const result = await scoreRuleService.createScoreRule(payload);
        setScoreRules(prev => [result, ...prev]);
        showCustomToast('Score rule created successfully', 'success');
      }

      setNewRule({ ruleName: '', ruleType: '', scoreValue: '', minCount: '', requiredDays: '7' });
      setEditingRuleId(null);
      setIsAddingRule(false);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Action failed';
      showCustomToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rule) => {
    setNewRule({
      ruleName: rule.ruleName || rule.ruleType,
      ruleType: rule.ruleType,
      scoreValue: rule.scoreValue,
      minCount: rule.minCount ?? '',
      requiredDays: rule.requiredDays ?? '7'
    });
    setEditingRuleId(rule._id);
    setIsAddingRule(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (rule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await scoreRuleService.deleteScoreRule(ruleToDelete._id);
      setScoreRules(prev => prev.filter(r => r._id !== ruleToDelete._id));
      showCustomToast('Score rule deleted successfully', 'success');
    } catch (err) {
      showCustomToast('Delete failed', 'error');
    } finally {
      setShowDeleteModal(false);
      setRuleToDelete(null);
    }
  };

  useEffect(() => {
    fetchScoreRules();
  }, []);

  const getRuleIcon = (type) => {
    switch (type) {
      case 'DAILY_LOGIN': return <FaCheckCircle />;
      case 'WEEKLY_CONSISTENCY': return <FaTrophy />;
      case 'DAILY_VIDEO_CALL_TARGET': return <FaStar />;
      case 'DAILY_AUDIO_CALL_TARGET': return <FaStar />;
      default: return <FaCog />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h2 className={styles.title}>Score Rules</h2>
          <p className={styles.description}>Configure behavioral rewards and performance metrics</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'rules' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              <FaCog /> <span>Management</span>
              {activeTab === 'rules' && <motion.div layoutId="tab-underline" className={styles.tabUnderline} />}
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'user-history' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('user-history')}
            >
              <FaHistory /> <span>User History</span>
              {activeTab === 'user-history' && <motion.div layoutId="tab-underline" className={styles.tabUnderline} />}
            </button>
          </div>

          {activeTab === 'rules' && (
            <button
              className={`${styles.addButton} ${isAddingRule ? styles.cancelButton : ''}`}
              onClick={() => setIsAddingRule(!isAddingRule)}
            >
              {isAddingRule ? 'Cancel' : <><FaPlus /> Add New Rule</>}
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {isAddingRule && activeTab === 'rules' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.formContainer}
          >
            <form onSubmit={handleSubmit} className={styles.ruleForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Rule Display Name</label>
                  <input
                    type="text"
                    name="ruleName"
                    value={newRule.ruleName}
                    onChange={handleInputChange}
                    placeholder="e.g. Daily Streak Bonus"
                    className={formErrors.ruleName ? styles.errorInput : ''}
                  />
                  {formErrors.ruleName && <span className={styles.errorText}>{formErrors.ruleName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>System Rule Type</label>
                  <select name="ruleType" value={newRule.ruleType} onChange={handleInputChange}>
                    <option value="">Choose System Type...</option>
                    <option value="DAILY_LOGIN">Daily Login</option>
                    <option value="DAILY_VIDEO_CALL_TARGET">Daily Video Call Target</option>
                    <option value="DAILY_AUDIO_CALL_TARGET">Daily Audio Call Target</option>
                    <option value="WEEKLY_CONSISTENCY">Weekly Consistency</option>
                  </select>
                  {formErrors.ruleType && <span className={styles.errorText}>{formErrors.ruleType}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Reward Score</label>
                  <div className={styles.scoreInputWrapper}>
                    <FaStar className={styles.inputPrefix} />
                    <input
                      type="number"
                      name="scoreValue"
                      value={newRule.scoreValue}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  {formErrors.scoreValue && <span className={styles.errorText}>{formErrors.scoreValue}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Target Threshold (Min Count)</label>
                  <input
                    type="number"
                    name="minCount"
                    value={newRule.minCount}
                    onChange={handleInputChange}
                    placeholder="Optional threshold"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Period (Days)</label>
                  <div className={styles.scoreInputWrapper}>
                    <FaClock className={styles.inputPrefix} />
                    <input
                      type="number"
                      name="requiredDays"
                      value={newRule.requiredDays}
                      onChange={handleInputChange}
                      placeholder="7"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formFooter}>
                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? 'Processing...' : editingRuleId ? 'Save Changes' : 'Create Rule'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={styles.content}>
        {activeTab === 'rules' ? (
          loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <span>Fetching Rules...</span>
            </div>
          ) : (
            <motion.div
              className={styles.ruleGrid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {scoreRules.map((rule) => (
                <motion.div
                  key={rule._id}
                  className={styles.ruleCard}
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                >
                  <div className={`${styles.cardIcon} ${styles[rule.ruleType]}`}>
                    {getRuleIcon(rule.ruleType)}
                  </div>

                  <div className={styles.cardHeader}>
                    <h3>{rule.ruleName || rule.ruleType.replace(/_/g, ' ')}</h3>
                    <div className={styles.cardActions}>
                      <button onClick={() => handleEdit(rule)} title="Edit Configuration"><FaEdit /></button>
                      <button onClick={() => handleDelete(rule)} className={styles.deleteBtn} title="Delete Rule"><FaTrash /></button>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.metric}>
                      <span className={styles.label}>Points</span>
                      <span className={styles.value}>+{rule.scoreValue}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Threshold</span>
                      <span className={styles.value}>{rule.minCount || 'Any'}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Duration</span>
                      <span className={styles.value}>{rule.requiredDays} Days</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.typeTag}>{rule.ruleType}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <div className={styles.historySection}>
            <div className={styles.historySearch}>
              <div className={styles.searchBox}>
                <FaHistory className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Enter User ID to track historical earnings..."
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                />
              </div>
            </div>
            <UserScoreHistory userId={userIdInput || undefined} />
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Remove Score Rule"
        message={`This will permanently remove the scoring logic for '${ruleToDelete?.ruleName || ruleToDelete?.ruleType}'. Existing user scores will not be affected.`}
        confirmText="Remove Rule"
        cancelText="Keep Rule"
      />
      <ToastContainerCustom />
    </div>
  );
};

export default ScoreRule;
