import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'e6aa6227-d8e8-4fd4-90d0-761af7afb40d',
    authority: 'https://login.microsoftonline.com/common',  // multi-tenant + personal
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,       // set per-environment
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: { logLevel: LogLevel.Info },
  },
};

export const loginRequest = {
  scopes: [
    'openid',
    'profile',
    'offline_access',
    'User.Read',           // ← needed for GET https://graph.microsoft.com/v1.0/me
    'Mail.Send',
    'Mail.ReadWrite',
    'Calendars.ReadWrite',
  ],
};
