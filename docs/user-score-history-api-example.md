# User Score History API Endpoint

## GET /admin/reward-rules/users/:userId/history

Retrieves the score history for a specific user.

### Request

**Endpoint:** `GET /admin/reward-rules/users/{userId}/history`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <your-jwt-token>`

**Parameters:**
- `userId` (string): The ID of the user to retrieve score history for (e.g., "695b47d9a40ac5f37a018fe2")

### Response

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
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
    },
    {
      "_id": "696f96e391d60de4b5f8a1b4",
      "femaleUserId": "695b47d9a40ac5f37a018fe2",
      "ruleType": "DAILY_VIDEO_CALL_TARGET",
      "scoreAdded": 35,
      "referenceDate": "2026-01-20T00:00:00.000Z",
      "ruleId": {
        "_id": "696f595776089389c0396758",
        "ruleType": "DAILY_VIDEO_CALL_TARGET",
        "scoreValue": 35
      },
      "addedBy": "system",
      "createdAt": "2026-01-20T14:53:23.789Z",
      "updatedAt": "2026-01-20T14:53:23.789Z",
      "__v": 0
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResults": 2
  }
}
```

### Using in Frontend

Using the `scoreRuleService`:

```javascript
import { scoreRuleService } from '../services/scoreRuleService';

const getUserScoreHistory = async (userId) => {
  try {
    const response = await scoreRuleService.getUserScoreHistory(userId);
    console.log('User score history retrieved:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user score history:', error);
    throw error;
  }
};

// Example usage
const userId = '695b47d9a40ac5f37a018fe2';
getUserScoreHistory(userId).then(history => {
  console.log('Number of score records:', history.data.length);
  console.log('Pagination info:', history.pagination);
  
  history.data.forEach(record => {
    console.log(`Rule: ${record.ruleType}, Score Added: ${record.scoreAdded}, Date: ${record.referenceDate}`);
  });
});
```

### Response Fields Description

- `success` (boolean): Indicates if the request was successful
- `data` (array): Array of score history records
  - `_id` (string): Unique ID of the score record
  - `femaleUserId` (string): The ID of the user who received the score
  - `ruleType` (string): The type of rule that triggered the score (e.g., "DAILY_LOGIN", "DAILY_VIDEO_CALL_TARGET")
  - `scoreAdded` (number): The amount of score added
  - `referenceDate` (string): Date when the score was added (ISO format)
  - `ruleId` (object): Reference to the rule that was applied
    - `_id` (string): ID of the rule
    - `ruleType` (string): Type of the rule
    - `scoreValue` (number): Value of the rule
  - `addedBy` (string): Who added the score (usually "system")
  - `createdAt` (string): When the record was created (ISO format)
  - `updatedAt` (string): When the record was last updated (ISO format)
  - `__v` (number): Version field for MongoDB
- `pagination` (object): Pagination information
  - `currentPage` (number): Current page number
  - `totalPages` (number): Total number of pages
  - `totalResults` (number): Total number of results