import { Injectable } from '@angular/core';

export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsUser {
  email?: string;
  name?: string;
  customProperties?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export abstract class AnalyticsService {
  abstract initialize(): void;
  abstract track(event: string, properties?: EventProperties): void;
  abstract trackPageView(pageName: string, properties?: EventProperties): void;
  abstract setUserProperties(properties: Partial<AnalyticsUser>): void;
  abstract reset(): void;
}
