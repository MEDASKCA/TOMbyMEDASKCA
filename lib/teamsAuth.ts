import { PublicClientApplication, Configuration, LogLevel } from '@azure/msal-browser';

// MSAL Configuration
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || 'common'}`,
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : '',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

// Create MSAL instance
let msalInstance: PublicClientApplication | null = null;

export const getMsalInstance = () => {
  if (!msalInstance && typeof window !== 'undefined') {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
};

// Login scopes
export const loginRequest = {
  scopes: [
    'User.Read',
    'Chat.ReadWrite',
    'Channel.ReadBasic.All',
    'ChannelMessage.Read.All',
    'Team.ReadBasic.All',
    'TeamMember.Read.All',
  ],
};

// Sign in with popup
export const signInWithPopup = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    throw new Error('MSAL instance not initialized');
  }

  try {
    const response = await instance.loginPopup(loginRequest);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Sign in with redirect
export const signInWithRedirect = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    throw new Error('MSAL instance not initialized');
  }

  try {
    await instance.loginRedirect(loginRequest);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Get access token silently
export const getAccessToken = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    throw new Error('MSAL instance not initialized');
  }

  const accounts = instance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error('No accounts found. Please sign in first.');
  }

  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    console.error('Silent token acquisition failed:', error);
    // Fallback to interactive
    const response = await instance.acquireTokenPopup(loginRequest);
    return response.accessToken;
  }
};

// Sign out
export const signOut = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    throw new Error('MSAL instance not initialized');
  }

  try {
    await instance.logoutPopup();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Get current user account
export const getCurrentAccount = () => {
  const instance = getMsalInstance();
  if (!instance) {
    return null;
  }

  const accounts = instance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
};
