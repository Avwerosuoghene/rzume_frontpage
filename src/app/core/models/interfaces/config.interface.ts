export interface AppConfig {
  analytics: AnalyticsConfig;
}

export interface AnalyticsConfig {
  googleTagId: string;
  linkedInPartnerId?: string;
  mixpanelToken?: string;
  enabled: boolean;
  debug: boolean;
}
