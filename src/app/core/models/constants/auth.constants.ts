export interface AuthConfig {
  baseUrl: string;
  loginPath: string;
  registerPath: string;
}

export interface AuthUrls {
  loginUrl: string;
  registerUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  baseUrl: 'https://app.rzume.site',
  loginPath: '/auth/login',
  registerPath: '/auth/register'
};

export const AUTH_URLS: AuthUrls = {
  loginUrl: `${AUTH_CONFIG.baseUrl}${AUTH_CONFIG.loginPath}`,
  registerUrl: `${AUTH_CONFIG.baseUrl}${AUTH_CONFIG.registerPath}`
};
