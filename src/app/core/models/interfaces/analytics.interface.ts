export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsUser {
  email?: string;
  name?: string;
  customProperties?: Record<string, any>;
}

export interface AnalyticsUserContext {
  sessionId: string;
  deviceType: string;
  email?: string;
  name?: string;
}
