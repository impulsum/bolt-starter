import {
  confirmSignIn as amplifyConfirmSignIn,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  fetchAuthSession,
  getCurrentUser,
} from 'aws-amplify/auth';

async function signIn(email: string) {
  const result = await amplifySignIn({
    username: email,
    options: {
      authFlowType: 'USER_AUTH',
      preferredChallenge: 'EMAIL_OTP',
    },
  });

  return result;
}

async function confirmSignIn(challengeResponse: string) {
  const result = await amplifyConfirmSignIn({
    challengeResponse,
  });

  return result;
}

async function signOut() {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

async function isAuthenticated(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch (error) {
    console.warn('No valid auth session found:', error);
    return null;
  }
}

export default {
  signIn,
  confirmSignIn,
  signOut,
  isAuthenticated,
  getAccessToken,
};

