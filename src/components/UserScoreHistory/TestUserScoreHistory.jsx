// src/components/UserScoreHistory/TestUserScoreHistory.jsx
import React, { useState } from 'react';
import UserScoreHistory from './UserScoreHistory';
import { scoreRuleService } from '../../services/scoreRuleService';

const TestUserScoreHistory = () => {
  const [userId, setUserId] = useState('695b47d9a40ac5f37a018fe2'); // Sample user ID
  const [realData, setRealData] = useState(false);

  const handleLoadRealData = async () => {
    if (!userId) {
      alert('Please enter a user ID');
      return;
    }

    try {
      // This is the actual API call to get real user score history
      const response = await scoreRuleService.getUserScoreHistory(userId);
      console.log('Real user score history data:', response);
      setRealData(true);
    } catch (error) {
      console.error('Error fetching real data:', error);
      alert('Error fetching user score history: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>User Score History Component Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Test Instructions:</h3>
        <ol>
          <li>Enter a user ID in the input field below</li>
          <li>Click "Load Real Data" to fetch actual data from the API</li>
          <li>Or leave the default user ID to see sample data</li>
          <li>The component will display the user's score history</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="userId" style={{ fontWeight: 'bold' }}>
          User ID:
        </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID (e.g., 695b47d9a40ac5f37a018fe2)"
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '300px'
          }}
        />
        <button
          onClick={handleLoadRealData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Load Real Data
        </button>
        <button
          onClick={() => setRealData(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reset to Sample
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Component Output:</h3>
        <UserScoreHistory userId={realData ? userId : undefined} />
      </div>

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <h3>API Endpoint Information:</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', fontFamily: 'monospace' }}>
          <strong>Endpoint:</strong> GET /admin/reward-rules/users/{'${userId}'}/history<br/>
          <strong>Method:</strong> GET<br/>
          <strong>Headers:</strong> Authorization: Bearer {'<token>'}<br/>
          <strong>Response:</strong> Array of score history records with pagination
        </div>
      </div>

      <div style={{ marginTop: '20px', backgroundColor: '#e7f3ff', padding: '15px', borderRadius: '4px' }}>
        <h4>Sample Data Structure:</h4>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '12px' }}>
{`{
  "_id": "697061de60f9fca0bf9ce93b",
  "femaleUserId": "695b47d9a40ac5f37a018fe2",
  "ruleType": "DAILY_LOGIN",
  "scoreAdded": 10,
  "referenceDate": "2026-01-21T00:00:00.000Z",
  "ruleId": {
    "_id": "696f5a8e76089389c0396766",
    "ruleType": "DAILY_LOGIN",
    "scoreValue": 10
  },
  "addedBy": "system",
  "createdAt": "2026-01-21T05:19:26.627Z",
  "updatedAt": "2026-01-21T05:19:26.627Z",
  "__v": 0
}`}
        </pre>
      </div>
    </div>
  );
};

export default TestUserScoreHistory;