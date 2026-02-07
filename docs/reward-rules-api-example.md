# Reward Rules API Endpoint

## POST /admin/reward-rules/rules

Creates a new reward rule in the system.

### Request

**Endpoint:** `POST /admin/reward-rules/rules`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <your-jwt-token>`

**Body:**
```json
{
  "ruleName": "Daily Video Call Target",
  "ruleType": "DAILY_VIDEO_CALL_TARGET",
  "minCount": 3,
  "scoreValue": 35,
  "requiredDays": 7
}
```

### Response

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ruleType": "DAILY_VIDEO_CALL_TARGET",
    "scoreValue": 35,
    "minCount": 3,
    "requiredDays": 7,
    "isActive": true,
    "_id": "6984bc930f85f603e1dbc250",
    "createdAt": "2026-02-05T15:51:47.342Z",
    "updatedAt": "2026-02-05T15:51:47.342Z",
    "__v": 0
  }
}
```

## PUT /admin/reward-rules/rules/:id

Updates an existing reward rule in the system.

### Request

**Endpoint:** `PUT /admin/reward-rules/rules/{ruleId}`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <your-jwt-token>`

**Body:**
```json
{
  "ruleName": "Daily Video Call Target",
  "ruleType": "DAILY_VIDEO_CALL_TARGET",
  "minCount": 5,
  "scoreValue": 50,
  "requiredDays": 7
}
```

### Response

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ruleType": "DAILY_VIDEO_CALL_TARGET",
    "scoreValue": 50,
    "minCount": 5,
    "requiredDays": 7,
    "isActive": true,
    "_id": "6984bc930f85f603e1dbc250",
    "createdAt": "2026-02-05T15:51:47.342Z",
    "updatedAt": "2026-02-05T16:20:30.123Z",
    "__v": 0
  }
}
```

## DELETE /admin/reward-rules/rules/:id

Deletes an existing reward rule from the system.

### Request

**Endpoint:** `DELETE /admin/reward-rules/rules/{ruleId}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`

### Response

**Success Response (200):**
```json
{
  "success": true,
  "message": "Score rule deleted successfully"
}
```

### Using in Frontend

Using the `scoreRuleService`:

#### Create Rule
```javascript
import { scoreRuleService } from '../services/scoreRuleService';

const createRewardRule = async () => {
  const ruleData = {
    ruleName: "Daily Video Call Target",
    ruleType: "DAILY_VIDEO_CALL_TARGET",
    minCount: 3,
    scoreValue: 35,
    requiredDays: 7
  };

  try {
    const response = await scoreRuleService.createScoreRule(ruleData);
    console.log('Reward rule created:', response);
    return response;
  } catch (error) {
    console.error('Error creating reward rule:', error);
    throw error;
  }
};
```

#### Update Rule
```javascript
const updateRewardRule = async (ruleId) => {
  const ruleData = {
    ruleName: "Updated Daily Video Call Target",
    ruleType: "DAILY_VIDEO_CALL_TARGET",
    minCount: 5,
    scoreValue: 50,
    requiredDays: 7
  };

  try {
    const response = await scoreRuleService.updateScoreRule(ruleId, ruleData);
    console.log('Reward rule updated:', response);
    return response;
  } catch (error) {
    console.error('Error updating reward rule:', error);
    throw error;
  }
};
```

#### Delete Rule
```javascript
const deleteRewardRule = async (ruleId) => {
  try {
    const response = await scoreRuleService.deleteScoreRule(ruleId);
    console.log('Reward rule deleted:', response);
    return response;
  } catch (error) {
    console.error('Error deleting reward rule:', error);
    throw error;
  }
};
```

### Fields Description

- `ruleName` (string): The display name of the rule
- `ruleType` (string): The type identifier of the rule (e.g., DAILY_VIDEO_CALL_TARGET)
- `minCount` (number): Minimum count required to achieve the reward (can be null)
- `scoreValue` (number): Points awarded when the rule is satisfied
- `requiredDays` (number): Number of days required to satisfy the rule (defaults to 7)
- `isActive` (boolean): Whether the rule is active (defaults to true)