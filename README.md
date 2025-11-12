# VISA Data Tokens - Bolt Starter Template

A simplified starter template for building prototypes with VISA Data Tokens API.

## Features

- ✅ Pre-configured authentication flow (Email + OTP + PAN)
- ✅ Simplified `<LoginFlow />` component that abstracts the entire auth process
- ✅ AWS Amplify integration for Cognito authentication
- ✅ Mock VGS integration for PAN entry (production-ready version uses real VGS)
- ✅ TypeScript support
- ✅ Vite for fast development

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_COGNITO_DOMAIN=your-cognito-domain.auth.region.amazoncognito.com
VITE_COGNITO_REDIRECT_URI=http://localhost:5173
VITE_COGNITO_RESPONSE_TYPE=code
VITE_COGNITO_SCOPE=openid email profile

# VGS Configuration
VITE_VGS_VAULT_ID=your-vgs-vault-id
VITE_VGS_ENVIRONMENT=sandbox

# API Configuration
VITE_API_BASE_URL=https://your-api-url.com
```

### 3. Run Development Server

```bash
npm run dev
```

## Usage

### Basic Authentication Flow

The `<LoginFlow />` component handles the entire authentication process:

```tsx
import { LoginFlow } from './components/LoginFlow';

function App() {
  return (
    <LoginFlow 
      onSuccess={(data) => {
        console.log('JWT:', data.jwt);
        console.log('Data Token ID:', data.dataTokenId);
        
        // Now you can use the JWT to call the VISA Data Tokens API
        // and the dataTokenId to retrieve user insights
      }} 
    />
  );
}
```

### What the LoginFlow Does

The component manages three steps automatically:

1. **Email Entry**: User enters their email address
2. **OTP Verification**: User receives and enters a one-time code
3. **PAN Entry**: User enters their card number to create a data token

When complete, it calls `onSuccess()` with:
- `jwt`: The authentication token for API calls
- `dataTokenId`: The unique identifier for the user's data token

### Building Your Prototype

After authentication succeeds, you can:

1. **Fetch User Signals**: Use the JWT to call the VISA Data Tokens API
2. **Display Insights**: Show personalized insights based on card usage
3. **Create Custom Experiences**: Build unique features using the signals data

Example:

```tsx
import { LoginFlow } from './components/LoginFlow';
import { useState } from 'react';

function App() {
  const [authData, setAuthData] = useState(null);
  const [signals, setSignals] = useState(null);

  const handleAuthSuccess = async (data) => {
    setAuthData(data);
    
    // Fetch signals from the API
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/signals/${data.dataTokenId}`,
      {
        headers: {
          Authorization: `Bearer ${data.jwt}`,
        },
      }
    );
    
    const signalsData = await response.json();
    setSignals(signalsData);
  };

  if (!authData) {
    return <LoginFlow onSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <h1>Your Insights</h1>
      {/* Display signals data here */}
    </div>
  );
}
```

## Project Structure

```
src/
├── components/
│   ├── LoginFlow.tsx       # Main authentication component
│   └── LoginFlow.css       # Styles for authentication UI
├── lib/
│   ├── config.ts          # Environment configuration
│   └── auth-service.ts    # AWS Amplify authentication helpers
├── App.tsx                # Your application entry point
└── main.tsx              # React entry point
```

## Notes

### Security

- **PAN Entry**: In this demo, PAN entry is simplified. In production, you must use VGS (Very Good Security) to handle card data securely.
- **Environment Variables**: Never commit `.env` files to version control. Always use `.env.example` as a template.

### Development vs Production

This is a **prototype template** designed for rapid development. Before deploying to production:

1. Implement real VGS integration for PAN handling
2. Add proper error handling and validation
3. Implement security best practices
4. Add comprehensive testing
5. Consider adding user session management

## Support

For questions about:
- VISA Data Tokens API: Contact your VISA representative
- This template: Check the documentation in the main repository

## License

This is a VISA internal tool. See LICENSE file for details.
