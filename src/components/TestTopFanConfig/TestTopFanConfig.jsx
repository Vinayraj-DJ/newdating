import React, { useState, useEffect } from 'react';
import { getTopFanConfigById, updateTopFanConfigById, deleteTopFanConfigById } from '../../services/topFanService';
import styles from './TestTopFanConfig.module.css';

const TestTopFanConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [updateValue, setUpdateValue] = useState(10); // Default update value

  const testConfigId = '6964b4dfc23a4857e1259cba'; // The ID from your example

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTopFanConfigById(testConfigId);
      console.log('API Response:', response);
      setConfig(response);
    } catch (err) {
      console.error('Error fetching top fan config:', err);
      setError(err.message || 'Failed to fetch configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async () => {
    setUpdating(true);
    setError(null);
    
    try {
      const payload = { minTopFanScore: parseInt(updateValue) };
      const response = await updateTopFanConfigById(testConfigId, payload);
      console.log('Update API Response:', response);
      setConfig(response);
    } catch (err) {
      console.error('Error updating top fan config:', err);
      setError(err.message || 'Failed to update configuration');
    } finally {
      setUpdating(false);
    }
  };

  const deleteConfig = async () => {
    if (window.confirm('Are you sure you want to delete this top fan configuration? This action cannot be undone.')) {
      setDeleting(true);
      setError(null);
      
      try {
        const response = await deleteTopFanConfigById(testConfigId);
        console.log('Delete API Response:', response);
        setConfig(response);
      } catch (err) {
        console.error('Error deleting top fan config:', err);
        setError(err.message || 'Failed to delete configuration');
      } finally {
        setDeleting(false);
      }
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Test Top Fan Configuration API</h2>
      
      {loading && <p className={styles.loading}>Loading...</p>}
      
      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {config && !loading && (
        <div>
          <h3 className={styles.sectionTitle}>Configuration Data:</h3>
          <pre className={styles.configData}>
            {JSON.stringify(config, null, 2)}
          </pre>
          
          {config.success && config.data && (
            <div className={styles.parsedData}>
              <h4 className={styles.sectionTitle}>Parsed Configuration:</h4>
              <div>
                <strong>ID:</strong> {config.data._id}<br/>
                <strong>Active:</strong> {config.data.isActive ? 'Yes' : 'No'}<br/>
                <strong>Minimum Top Fan Score:</strong> {config.data.minTopFanScore}<br/>
                
                <h5 className={styles.sectionTitle}>Male Effort Points:</h5>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Text: {config.data.maleEffort?.text}</li>
                  <li className={styles.listItem}>Image: {config.data.maleEffort?.image}</li>
                  <li className={styles.listItem}>Video: {config.data.maleEffort?.video}</li>
                  <li className={styles.listItem}>Voice: {config.data.maleEffort?.voice}</li>
                  <li className={styles.listItem}>Audio Call: {config.data.maleEffort?.audioCall}</li>
                  <li className={styles.listItem}>Video Call: {config.data.maleEffort?.videoCall}</li>
                </ul>
                
                <h5 className={styles.sectionTitle}>Female Response Points:</h5>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Text Reply: {config.data.femaleResponse?.textReply}</li>
                  <li className={styles.listItem}>Fast Reply Bonus: {config.data.femaleResponse?.fastReplyBonus}</li>
                  <li className={styles.listItem}>Voice Reply: {config.data.femaleResponse?.voiceReply}</li>
                  <li className={styles.listItem}>Call Answered: {config.data.femaleResponse?.callAnswered}</li>
                </ul>
                
                <h5 className={styles.sectionTitle}>Multipliers:</h5>
                <ul className={styles.list}>
                  {Array.isArray(config.data.multipliers) && config.data.multipliers.map((multiplier, index) => (
                    <li className={styles.listItem} key={index}>
                      {multiplier.min}-{multiplier.max}: Factor {multiplier.factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div>
        <input 
          type="number" 
          value={updateValue} 
          onChange={(e) => setUpdateValue(e.target.value)}
          placeholder="Enter minTopFanScore"
          className={styles.input}
        />
        <button className={styles.button} onClick={fetchConfig} disabled={loading || updating || deleting}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
        <button className={styles.button} onClick={updateConfig} disabled={loading || updating || deleting}>
          {updating ? 'Updating...' : 'Update Min Top Fan Score'}
        </button>
        <button className={`${styles.button} ${styles.dangerButton}`} onClick={deleteConfig} disabled={loading || updating || deleting}>
          {deleting ? 'Deleting...' : 'Delete Configuration'}
        </button>
      </div>
    </div>
  );
};

export default TestTopFanConfig;