import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import authService from '../lib/auth-service';
import { getCognitoConfig } from '../lib/config';

interface LoginFlowProps {
  onSuccess: (data: { jwt: string; dataTokenId?: string }) => void;
}

type AuthStep = 'email' | 'otp' | 'pan' | 'success';

// Configure Amplify
try {
  const cognitoConfig = getCognitoConfig();

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cognitoConfig.userPoolId,
        userPoolClientId: cognitoConfig.userPoolClientId,
        signUpVerificationMethod: 'code',
        loginWith: {
          oauth: {
            domain: cognitoConfig.domain,
            scopes: cognitoConfig.scope.split(' '),
            redirectSignIn: [cognitoConfig.redirectUri],
            redirectSignOut: [cognitoConfig.redirectUri],
            responseType: cognitoConfig.responseType as 'code',
          },
        },
      },
    },
  });
} catch (error) {
  console.error('Failed to configure Amplify:', error);
}

export function LoginFlow({ onSuccess }: LoginFlowProps) {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [pan, setPan] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const token = await authService.getAccessToken();
        if (token) {
          onSuccess({ jwt: token });
        }
      }
    };
    checkAuth();
  }, [onSuccess]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.signIn(email);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authService.confirmSignIn(otp);

      if (result.nextStep.signInStep === 'DONE') {
        const session = await fetchAuthSession();
        const jwt = session.tokens?.accessToken?.toString();

        if (jwt) {
          // Check if user already has a data token
          // For simplicity, we'll go straight to PAN entry
          setStep('pan');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const session = await fetchAuthSession();
      const jwt = session.tokens?.accessToken?.toString();

      if (!jwt) {
        throw new Error('No authentication token');
      }

      // In a real implementation, this would:
      // 1. Use VGS to securely tokenize the PAN
      // 2. Send the tokenized PAN to the API
      // 3. Create a data token
      // For this simplified version, we'll simulate success

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockDataTokenId = 'dt_' + Math.random().toString(36).substr(2, 9);

      setStep('success');
      onSuccess({ jwt, dataTokenId: mockDataTokenId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process card');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <div className="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-[#1a1f71] mb-4">Sign In</h2>
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1f71] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[#1a1f71] text-white rounded-md font-medium hover:bg-[#151a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-[#1a1f71] mb-2">Enter Verification Code</h2>
        <p className="mb-6 text-gray-600">We sent a code to {email}</p>
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-6">
            <label htmlFor="otp" className="block mb-2 font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1f71] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[#1a1f71] text-white rounded-md font-medium hover:bg-[#151a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button
            type="button"
            onClick={() => setStep('email')}
            disabled={isLoading}
            className="w-full mt-2 px-4 py-2 bg-transparent text-[#1a1f71] border border-[#1a1f71] rounded-md font-medium hover:bg-gray-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    );
  }

  if (step === 'pan') {
    return (
      <div className="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-[#1a1f71] mb-2">Enter Card Details</h2>
        <p className="mb-6 text-gray-600">To access your insights, we need to verify your card</p>
        <form onSubmit={handlePanSubmit}>
          <div className="mb-6">
            <label htmlFor="pan" className="block mb-2 font-medium text-gray-700">
              Card Number
            </label>
            <input
              id="pan"
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value.replace(/\s/g, ''))}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1f71] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <small className="block mt-2 text-sm text-gray-600">
              ⚠️ This is a demo. In production, PAN is handled securely via VGS.
            </small>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading || pan.length < 13}
            className="w-full px-4 py-2 bg-[#1a1f71] text-white rounded-md font-medium hover:bg-[#151a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">✓ Authentication Complete</h2>
        <p className="text-gray-600">You're now signed in and your data token has been created.</p>
      </div>
    );
  }

  return null;
}
