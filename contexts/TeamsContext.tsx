'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  initializeTeamsSDK,
  isInTeams,
  getTeamsContext,
  getTeamsTheme,
  registerThemeChangeHandler,
  authenticateWithTeamsSSO,
} from '@/lib/teamsSDK';
import {
  getMsalInstance,
  signInWithPopup,
  signInWithRedirect,
  signOut as msalSignOut,
  getCurrentAccount,
  getAccessToken,
} from '@/lib/teamsAuth';

interface TeamsContextType {
  // Teams SDK
  isTeamsInitialized: boolean;
  isRunningInTeams: boolean;
  teamsContext: any;
  teamsTheme: string;

  // Azure AD / MSAL
  isAuthenticated: boolean;
  userAccount: any;
  accessToken: string | null;

  // Methods
  signIn: (usePopup?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export function TeamsProvider({ children }: { children: ReactNode }) {
  // Teams SDK state
  const [isTeamsInitialized, setIsTeamsInitialized] = useState(false);
  const [isRunningInTeams, setIsRunningInTeams] = useState(false);
  const [teamsContext, setTeamsContext] = useState<any>(null);
  const [teamsTheme, setTeamsTheme] = useState<string>('default');

  // Azure AD / MSAL state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAccount, setUserAccount] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Initialize Teams SDK
  useEffect(() => {
    const init = async () => {
      try {
        const success = await initializeTeamsSDK();
        if (success) {
          setIsTeamsInitialized(true);
          setIsRunningInTeams(isInTeams());

          // Get context and theme
          const context = await getTeamsContext();
          setTeamsContext(context);

          const theme = await getTeamsTheme();
          setTeamsTheme(theme);

          // Register theme change handler
          registerThemeChangeHandler((newTheme: string) => {
            setTeamsTheme(newTheme);
          });

          // Try Teams SSO if in Teams
          const ssoToken = await authenticateWithTeamsSSO();
          if (ssoToken) {
            setAccessToken(ssoToken);
            setIsAuthenticated(true);
          }
        } else {
          // Teams not available - this is fine for standalone mode
          console.log('Running in standalone mode (not in Teams)');
        }
      } catch (error) {
        // Silently handle Teams errors in standalone mode
        console.log('Teams not available, continuing in standalone mode');
      }
    };

    init();
  }, []);

  // Initialize MSAL
  useEffect(() => {
    const initMsal = async () => {
      try {
        const msalInstance = getMsalInstance();
        if (msalInstance) {
          await msalInstance.initialize();

          // Check if user is already signed in
          const account = getCurrentAccount();
          if (account) {
            setUserAccount(account);
            setIsAuthenticated(true);

            // Try to get access token
            try {
              const token = await getAccessToken();
              setAccessToken(token);
            } catch (error) {
              console.error('Failed to get access token:', error);
            }
          }
        }
      } catch (error) {
        console.error('MSAL initialization error:', error);
      }
    };

    if (!isRunningInTeams) {
      // Only initialize MSAL if not in Teams (Teams uses SSO)
      initMsal();
    }
  }, [isRunningInTeams]);

  // Sign in with Azure AD
  const signIn = async (usePopup: boolean = true) => {
    try {
      if (usePopup) {
        const response = await signInWithPopup();
        setUserAccount(response.account);
        setAccessToken(response.accessToken);
        setIsAuthenticated(true);
      } else {
        await signInWithRedirect();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await msalSignOut();
      setUserAccount(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Refresh access token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const token = await getAccessToken();
      setAccessToken(token);
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  const value: TeamsContextType = {
    isTeamsInitialized,
    isRunningInTeams,
    teamsContext,
    teamsTheme,
    isAuthenticated,
    userAccount,
    accessToken,
    signIn,
    signOut,
    refreshToken,
  };

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}
