interface CognitoConfig {
  userPoolId: string;
  userPoolClientId: string;
  domain: string;
  redirectUri: string;
  responseType: string;
  scope: string;
}

interface VGSConfig {
  vaultId: string;
  environment: string;
}

interface ApiConfig {
  baseUrl: string;
}

class ConfigError extends Error {
  constructor(missingVariable: string) {
    super(`Missing required configuration: ${missingVariable}`);
    this.name = 'ConfigError';
  }
}

function getEnvVar(key: string): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[key];

    if (!value) {
      throw new ConfigError(key);
    }

    return value;
  }

  throw new ConfigError(key);
}

export function getCognitoConfig(): CognitoConfig {
  return {
    userPoolId: getEnvVar('VITE_COGNITO_USER_POOL_ID'),
    userPoolClientId: getEnvVar('VITE_COGNITO_USER_POOL_CLIENT_ID'),
    domain: getEnvVar('VITE_COGNITO_DOMAIN'),
    redirectUri: getEnvVar('VITE_COGNITO_REDIRECT_URI'),
    responseType: getEnvVar('VITE_COGNITO_RESPONSE_TYPE'),
    scope: getEnvVar('VITE_COGNITO_SCOPE'),
  };
}

export function getVGSConfig(): VGSConfig {
  return {
    vaultId: getEnvVar('VITE_VGS_VAULT_ID'),
    environment: getEnvVar('VITE_VGS_ENVIRONMENT'),
  };
}

export function getApiConfig(): ApiConfig {
  return {
    baseUrl: getEnvVar('VITE_API_BASE_URL'),
  };
}

export type { CognitoConfig, VGSConfig, ApiConfig };

