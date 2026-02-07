import React, { useState, useEffect } from "react";
import { showCustomToast } from '../../../components/CustomToast/CustomToast';
import styles from "./TopFanConfiguration.module.css";
import { getTopFanConfig, updateTopFanConfig, toggleTopFanConfigStatus } from "../../../services/topFanService";
import CustomToggle from "../../../components/CustomToggle/CustomToggle";

const TopFanConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
// isActive state removed
  
  // Male Effort configuration
  const [maleEffort, setMaleEffort] = useState({
    text: "",
    image: "",
    video: "",
    voice: "",
    audioCall: "",
    videoCall: ""
  });

  // Female Response configuration
  const [femaleResponse, setFemaleResponse] = useState({
    textReply: "",
    fastReplyBonus: "",
    voiceReply: "",
    callAnswered: ""
  });

  // Multipliers configuration
  const [multipliers, setMultipliers] = useState([
    { min: "", max: "", factor: "" },
    { min: "", max: "", factor: "" },
    { min: "", max: "", factor: "" }
  ]);

  // Minimum Top Fan Score
  const [minTopFanScore, setMinTopFanScore] = useState("");

  useEffect(() => {
    fetchTopFanConfig();
  }, []);

  const fetchTopFanConfig = async () => {
    try {
      setFetching(true);
      const res = await getTopFanConfig();
      
      if (res?.success && res?.data) {
        const data = res.data;
        
        // If no configuration exists, initialize with default values
        if (!data) {
          // Keep default empty values
          setFetching(false);
          return;
        }
        
        // Set male effort values
        setMaleEffort({
          text: data.maleEffort?.text?.toString() || "",
          image: data.maleEffort?.image?.toString() || "",
          video: data.maleEffort?.video?.toString() || "",
          voice: data.maleEffort?.voice?.toString() || "",
          audioCall: data.maleEffort?.audioCall?.toString() || "",
          videoCall: data.maleEffort?.videoCall?.toString() || ""
        });

        // Set female response values
        setFemaleResponse({
          textReply: data.femaleResponse?.textReply?.toString() || "",
          fastReplyBonus: data.femaleResponse?.fastReplyBonus?.toString() || "",
          voiceReply: data.femaleResponse?.voiceReply?.toString() || "",
          callAnswered: data.femaleResponse?.callAnswered?.toString() || ""
        });

        // Set multipliers
        if (data.multipliers && Array.isArray(data.multipliers)) {
          const formattedMultipliers = data.multipliers.map(mult => ({
            min: mult.min?.toString() || "",
            max: mult.max?.toString() || "",
            factor: mult.factor?.toString() || ""
          }));
          setMultipliers(formattedMultipliers);
        }

        // Set minimum top fan score
        setMinTopFanScore(data.minTopFanScore?.toString() || "");
        
// Active status setting removed
      }
    } catch (error) {
      // If it's a 404 or configuration doesn't exist, initialize with defaults
      if (error?.response?.status === 404 || error?.response?.data?.message?.includes('not found')) {
        // Configuration doesn't exist yet, use defaults
        setFetching(false);
        return;
      }
      showCustomToast(error?.response?.data?.message || "Failed to fetch Top Fan configuration");
    } finally {
      setFetching(false);
    }
  };

  const handleMaleEffortChange = (field, value) => {
    setMaleEffort(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFemaleResponseChange = (field, value) => {
    setFemaleResponse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiplierChange = (index, field, value) => {
    const newMultipliers = [...multipliers];
    newMultipliers[index] = {
      ...newMultipliers[index],
      [field]: value
    };
    setMultipliers(newMultipliers);
  };

  const validateForm = () => {
    // Validate male effort fields
    const maleEffortValues = Object.values(maleEffort);
    if (maleEffortValues.some(val => val === "" || isNaN(val) || Number(val) < 0)) {
      showCustomToast("All male effort values must be valid positive numbers");
      return false;
    }

    // Validate female response fields
    const femaleResponseValues = Object.values(femaleResponse);
    if (femaleResponseValues.some(val => val === "" || isNaN(val) || Number(val) < 0)) {
      showCustomToast("All female response values must be valid positive numbers");
      return false;
    }

    // Validate multipliers
    for (let i = 0; i < multipliers.length; i++) {
      const mult = multipliers[i];
      if (mult.min === "" || mult.max === "" || mult.factor === "") {
        showCustomToast(`All multiplier fields in row ${i + 1} are required`);
        return false;
      }
      if (isNaN(mult.min) || isNaN(mult.max) || isNaN(mult.factor)) {
        showCustomToast(`All multiplier values in row ${i + 1} must be numbers`);
        return false;
      }
      if (Number(mult.min) < 0 || Number(mult.max) < 0 || Number(mult.factor) < 0) {
        showCustomToast(`All multiplier values in row ${i + 1} must be positive`);
        return false;
      }
      if (Number(mult.min) >= Number(mult.max)) {
        showCustomToast(`Min value must be less than max value in row ${i + 1}`);
        return false;
      }
    }

    // Validate min top fan score
    if (minTopFanScore === "" || isNaN(minTopFanScore) || Number(minTopFanScore) < 0) {
      showCustomToast("Minimum Top Fan Score must be a valid positive number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        maleEffort: {
          text: Number(maleEffort.text),
          image: Number(maleEffort.image),
          video: Number(maleEffort.video),
          voice: Number(maleEffort.voice),
          audioCall: Number(maleEffort.audioCall),
          videoCall: Number(maleEffort.videoCall)
        },
        femaleResponse: {
          textReply: Number(femaleResponse.textReply),
          fastReplyBonus: Number(femaleResponse.fastReplyBonus),
          voiceReply: Number(femaleResponse.voiceReply),
          callAnswered: Number(femaleResponse.callAnswered)
        },
        multipliers: multipliers.map(mult => ({
          min: Number(mult.min),
          max: Number(mult.max),
          factor: Number(mult.factor)
        })),
        minTopFanScore: Number(minTopFanScore)
      };

      const res = await updateTopFanConfig(payload);
      
      if (res?.success) {
        showCustomToast(res.message || "Top Fan configuration updated successfully");
        // Refresh the data
        fetchTopFanConfig();
      } else {
        showCustomToast(res.message || "Failed to update Top Fan configuration");
      }
    } catch (error) {
      showCustomToast(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

// handleToggleStatus function removed

  if (fetching) {
    return <div className={styles.container}><p className={styles.loading}>Loading Top Fan configuration...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Top Fan Configuration</h2>
{/* Active status UI completely removed */}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Male Effort Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Male Effort Points</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Text Message</label>
              <input
                type="number"
                min="0"
                value={maleEffort.text}
                onChange={(e) => handleMaleEffortChange('text', e.target.value)}
                className={styles.input}
                placeholder="Points for text message"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Image</label>
              <input
                type="number"
                min="0"
                value={maleEffort.image}
                onChange={(e) => handleMaleEffortChange('image', e.target.value)}
                className={styles.input}
                placeholder="Points for image"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Video</label>
              <input
                type="number"
                min="0"
                value={maleEffort.video}
                onChange={(e) => handleMaleEffortChange('video', e.target.value)}
                className={styles.input}
                placeholder="Points for video"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Voice Message</label>
              <input
                type="number"
                min="0"
                value={maleEffort.voice}
                onChange={(e) => handleMaleEffortChange('voice', e.target.value)}
                className={styles.input}
                placeholder="Points for voice message"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Audio Call</label>
              <input
                type="number"
                min="0"
                value={maleEffort.audioCall}
                onChange={(e) => handleMaleEffortChange('audioCall', e.target.value)}
                className={styles.input}
                placeholder="Points for audio call"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Video Call</label>
              <input
                type="number"
                min="0"
                value={maleEffort.videoCall}
                onChange={(e) => handleMaleEffortChange('videoCall', e.target.value)}
                className={styles.input}
                placeholder="Points for video call"
              />
            </div>
          </div>
        </div>

        {/* Female Response Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Female Response Points</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Text Reply</label>
              <input
                type="number"
                min="0"
                value={femaleResponse.textReply}
                onChange={(e) => handleFemaleResponseChange('textReply', e.target.value)}
                className={styles.input}
                placeholder="Points for text reply"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Fast Reply Bonus</label>
              <input
                type="number"
                min="0"
                value={femaleResponse.fastReplyBonus}
                onChange={(e) => handleFemaleResponseChange('fastReplyBonus', e.target.value)}
                className={styles.input}
                placeholder="Bonus points for fast reply"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Voice Reply</label>
              <input
                type="number"
                min="0"
                value={femaleResponse.voiceReply}
                onChange={(e) => handleFemaleResponseChange('voiceReply', e.target.value)}
                className={styles.input}
                placeholder="Points for voice reply"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Call Answered</label>
              <input
                type="number"
                min="0"
                value={femaleResponse.callAnswered}
                onChange={(e) => handleFemaleResponseChange('callAnswered', e.target.value)}
                className={styles.input}
                placeholder="Points for answered call"
              />
            </div>
          </div>
        </div>

        {/* Multipliers Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Score Multipliers</h3>
          <div className={styles.multipliersContainer}>
            {multipliers.map((multiplier, index) => (
              <div key={index} className={styles.multiplierRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Min ({index + 1})</label>
                  <input
                    type="number"
                    min="0"
                    value={multiplier.min}
                    onChange={(e) => handleMultiplierChange(index, 'min', e.target.value)}
                    className={styles.input}
                    placeholder="Minimum interactions"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Max ({index + 1})</label>
                  <input
                    type="number"
                    min="0"
                    value={multiplier.max}
                    onChange={(e) => handleMultiplierChange(index, 'max', e.target.value)}
                    className={styles.input}
                    placeholder="Maximum interactions"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Factor ({index + 1})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={multiplier.factor}
                    onChange={(e) => handleMultiplierChange(index, 'factor', e.target.value)}
                    className={styles.input}
                    placeholder="Multiplier factor"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Top Fan Score */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Minimum Requirements</h3>
          <div className={styles.singleInput}>
            <label className={styles.label}>Minimum Top Fan Score</label>
            <input
              type="number"
              min="0"
              value={minTopFanScore}
              onChange={(e) => setMinTopFanScore(e.target.value)}
              className={styles.input}
              placeholder="Minimum score to qualify as Top Fan"
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </form>
    </div>
  );
};

export default TopFanConfiguration;