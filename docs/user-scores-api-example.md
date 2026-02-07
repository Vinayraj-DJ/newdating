# User Scores API Endpoint

## GET /admin/reward-rules/users/:userId/scores

Retrieves the score information for a specific user.

### Request

**Endpoint:** `GET /admin/reward-rules/users/{userId}/scores`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <your-jwt-token>`

**Parameters:**
- `userId` (string): The ID of the user to retrieve scores for (e.g., "695b47d9a40ac5f37a018fe2")

### Response

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "695b47d9a40ac5f37a018fe2",
    "dailyScore": 90,
    "score": 90,
    "weeklyScore": 90
  }
}
```

### Using in Frontend

Using the `scoreRuleService`:

```javascript
import { scoreRuleService } from '../services/scoreRuleService';

const getUserScores = async (userId) => {
  try {
    const response = await scoreRuleService.getUserScores(userId);
    console.log('User scores retrieved:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user scores:', error);
    throw error;
  }
};

// Example usage
const userId = '695b47d9a40ac5f37a018fe2';
getUserScores(userId).then(scores => {
  console.log('User daily score:', scores.dailyScore);
  console.log('User total score:', scores.score);
  console.log('User weekly score:', scores.weeklyScore);
});
```

### Response Fields Description

- `_id` (string): The user ID
- `dailyScore` (number): The user's daily score
- `score` (number): The user's total score
- `weeklyScore` (number): The user's weekly score