# Frontend API Integration Guide - OTP Verification

This document provides instructions for integrating the OTP (One-Time Password) verification endpoints into your frontend application.

## Base URL

```
http://localhost:3000/api/v1/messages
```

Or in production:
```
https://your-domain.com/api/v1/messages
```

## Endpoints

### 1. Send OTP

Send an OTP code to a user's email address.

**Endpoint:** `POST /api/v1/messages/otp/send`

**Authentication:** Not required (Public endpoint)

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "email": "user@example.com",
  "expiresIn": 600
}
```

**Response (Error - 500):**
```json
{
  "statusCode": 500,
  "message": "Failed to send OTP email: [error details]"
}
```

**Example using Fetch API:**
```javascript
async function sendOTP(email) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/messages/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send OTP');
    }

    const data = await response.json();
    console.log('OTP sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}
```

**Example using Axios:**
```javascript
import axios from 'axios';

async function sendOTP(email) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/messages/otp/send',
      { email }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error.response?.data || error.message);
    throw error;
  }
}
```

---

### 2. Check OTP

Verify the OTP code entered by the user.

**Endpoint:** `POST /api/v1/messages/otp/check`

**Authentication:** Not required (Public endpoint)

**Request Body:**
```json
{
  "otp": "123456",
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

**Response (Error - 400 - Invalid OTP):**
```json
{
  "statusCode": 400,
  "message": "Invalid OTP. 4 attempts remaining."
}
```

**Response (Error - 400 - Maximum Attempts Exceeded):**
```json
{
  "statusCode": 400,
  "message": "Maximum attempts exceeded. Registration has been deleted. Please register again."
}
```

**Response (Error - 404 - OTP Not Found/Expired):**
```json
{
  "statusCode": 404,
  "message": "OTP not found or expired. Please request a new OTP."
}
```

**Example using Fetch API:**
```javascript
async function checkOTP(email, otp) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/messages/otp/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify OTP');
    }

    const data = await response.json();
    console.log('OTP verified:', data);
    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}
```

**Example using Axios:**
```javascript
import axios from 'axios';

async function checkOTP(email, otp) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/messages/otp/check',
      { email, otp }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error verifying OTP:', errorMessage);
    throw new Error(errorMessage);
  }
}
```

---

## Important Notes

### OTP Expiration
- OTP codes expire after **10 minutes** (600 seconds)
- If an OTP expires, the user must request a new one

### Failed Attempts
- Users have **5 attempts** to enter the correct OTP
- After 5 failed attempts, the registration is **automatically deleted**
- If registration is deleted, the user must register again

### Email Format
- Email addresses are automatically converted to lowercase and trimmed
- Use the same email format when sending and checking OTP

### Registration Deletion
- If a user doesn't verify their OTP within 10 minutes, the registration is automatically deleted
- If a user enters the wrong OTP 5 times, the registration is immediately deleted
- This applies to customer account registrations linked to the OTP

---

## Complete Frontend Integration Example

### React/Next.js Example

```javascript
import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1/messages';

export function useOTP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  const sendOTP = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/otp/send`, { email });
      setOtpSent(true);
      setAttemptsRemaining(5);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/otp/check`, { email, otp });
      setOtpSent(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to verify OTP';
      setError(errorMessage);
      
      // Extract attempts remaining from error message
      const attemptsMatch = errorMessage.match(/(\d+) attempts remaining/);
      if (attemptsMatch) {
        setAttemptsRemaining(parseInt(attemptsMatch[1]));
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    loading,
    error,
    otpSent,
    attemptsRemaining,
  };
}

// Usage in component
function OTPVerificationForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { sendOTP, verifyOTP, loading, error, otpSent, attemptsRemaining } = useOTP();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await sendOTP(email);
      alert('OTP sent to your email!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyOTP(email, otp);
      alert('OTP verified successfully!');
      // Proceed with next steps (e.g., complete registration)
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSendOTP}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>

      {otpSent && (
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          {attemptsRemaining < 5 && (
            <p>Attempts remaining: {attemptsRemaining}</p>
          )}
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

### Vue.js Example

```javascript
// composables/useOTP.js
import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1/messages';

export function useOTP() {
  const loading = ref(false);
  const error = ref(null);
  const otpSent = ref(false);
  const attemptsRemaining = ref(5);

  const sendOTP = async (email) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_BASE_URL}/otp/send`, { email });
      otpSent.value = true;
      attemptsRemaining.value = 5;
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const verifyOTP = async (email, otp) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_BASE_URL}/otp/check`, { email, otp });
      otpSent.value = false;
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to verify OTP';
      error.value = errorMessage;
      
      const attemptsMatch = errorMessage.match(/(\d+) attempts remaining/);
      if (attemptsMatch) {
        attemptsRemaining.value = parseInt(attemptsMatch[1]);
      }
      
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  return {
    sendOTP,
    verifyOTP,
    loading,
    error,
    otpSent,
    attemptsRemaining,
  };
}
```

---

## Error Handling Best Practices

1. **Always handle errors gracefully** - Show user-friendly error messages
2. **Display attempts remaining** - Keep users informed about remaining attempts
3. **Handle expiration** - Prompt users to request a new OTP if expired
4. **Handle registration deletion** - Inform users if they need to re-register

---

## Testing

You can test the endpoints using:

1. **Postman/Insomnia:**
   - Create POST requests to the endpoints
   - Set Content-Type header to `application/json`
   - Send JSON body with required fields

2. **cURL:**
```bash
# Send OTP
curl -X POST http://localhost:3000/api/v1/messages/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Check OTP
curl -X POST http://localhost:3000/api/v1/messages/otp/check \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

3. **Swagger UI:**
   - Navigate to `http://localhost:3000/docs`
   - Find the "messages" section
   - Test the OTP endpoints directly from the Swagger interface

---

## Support

For issues or questions, please contact the backend development team.

