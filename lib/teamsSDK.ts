import * as microsoftTeams from '@microsoft/teams-js';

// Check if we're in a browser context that could support Teams
const isBrowserContext = (): boolean => {
  return typeof window !== 'undefined' && typeof window.parent !== 'undefined';
};

// Initialize Teams SDK
export const initializeTeamsSDK = async (): Promise<boolean> => {
  // Don't try to initialize if not in a browser context
  if (!isBrowserContext()) {
    console.log('Not in browser context, skipping Teams SDK initialization');
    return false;
  }

  try {
    await microsoftTeams.app.initialize();
    console.log('Teams SDK initialized successfully');
    return true;
  } catch {
    // Silently fail if not in Teams - this is expected when running standalone
    console.log('Teams SDK not available (running standalone)');
    return false;
  }
};

// Check if running in Teams context
export const isInTeams = (): boolean => {
  try {
    return !!microsoftTeams.app.isInitialized();
  } catch {
    return false;
  }
};

// Get Teams context
export const getTeamsContext = async () => {
  try {
    const context = await microsoftTeams.app.getContext();
    return context;
  } catch (error) {
    console.error('Failed to get Teams context:', error);
    return null;
  }
};

// Get Teams theme
export const getTeamsTheme = async (): Promise<string> => {
  try {
    const context = await microsoftTeams.app.getContext();
    return context.app.theme || 'default';
  } catch (error) {
    console.error('Failed to get Teams theme:', error);
    return 'default';
  }
};

// Register theme change handler
export const registerThemeChangeHandler = (handler: (theme: string) => void) => {
  try {
    microsoftTeams.app.registerOnThemeChangeHandler((theme: string) => {
      handler(theme);
    });
  } catch (error) {
    console.error('Failed to register theme change handler:', error);
  }
};

// Authenticate with Teams SSO
export const authenticateWithTeamsSSO = async (): Promise<string | null> => {
  try {
    const token = await microsoftTeams.authentication.getAuthToken();
    return token;
  } catch (error) {
    console.error('Teams SSO authentication failed:', error);
    return null;
  }
};

// Open external link
export const openExternalLink = (url: string) => {
  try {
    microsoftTeams.app.openLink(url);
  } catch (error) {
    console.error('Failed to open external link:', error);
    window.open(url, '_blank');
  }
};

// Share deep link
export const shareDeepLink = (deepLinkUrl: string) => {
  try {
    microsoftTeams.sharing.shareWebContent({
      content: [
        {
          type: 'URL',
          url: deepLinkUrl,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to share deep link:', error);
  }
};

// Get user info from Teams
export const getTeamsUserInfo = async () => {
  try {
    const context = await microsoftTeams.app.getContext();
    return {
      userId: context.user?.id,
      userPrincipalName: context.user?.userPrincipalName,
      displayName: context.user?.displayName,
      tenantId: context.user?.tenant?.id,
    };
  } catch (error) {
    console.error('Failed to get Teams user info:', error);
    return null;
  }
};

// Notify app loaded
export const notifyAppLoaded = () => {
  try {
    microsoftTeams.app.notifyAppLoaded();
  } catch (error) {
    console.error('Failed to notify app loaded:', error);
  }
};

// Notify success
export const notifySuccess = () => {
  try {
    microsoftTeams.app.notifySuccess();
  } catch (error) {
    console.error('Failed to notify success:', error);
  }
};

// Notify failure
export const notifyFailure = (reason: string) => {
  try {
    microsoftTeams.app.notifyFailure({
      reason: microsoftTeams.app.FailedReason.Other,
      message: reason,
    });
  } catch (error) {
    console.error('Failed to notify failure:', error);
  }
};
