import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../config.service';
import { AnalyticsService, EventProperties, AnalyticsUser } from './analytics.service';
import { AnalyticsUserContextService } from '../analytics-user-context.service';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleTagService extends AnalyticsService {
  private platformId = inject(PLATFORM_ID);
  private initialized = false;

  constructor(
    private configService: ConfigService,
    private userContextService: AnalyticsUserContextService
  ) {
    super();
  }

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.configService.analyticsEnabled) {
      if (this.configService.analyticsDebug) {
        console.log('Google Tag analytics disabled');
      }
      return;
    }

    if (this.initialized) {
      if (this.configService.analyticsDebug) {
        console.log('Google Tag already initialized');
      }
      return;
    }

    const googleTagId = this.configService.googleTagId;
    if (!googleTagId) {
      console.warn('Google Tag ID not configured');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', googleTagId, {
      send_page_view: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`;
    document.head.appendChild(script);

    this.initialized = true;

    if (this.configService.analyticsDebug) {
      console.log('Google Tag initialized:', googleTagId);
    }
  }

  trackPageView(pageName: string, properties?: EventProperties): void {
    if (!this.isReady()) {
      return;
    }

    try {
      const enrichedProperties = this.userContextService.enrichEventProperties({
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...properties
      });

      window.gtag('event', 'page_view', enrichedProperties);

      if (this.configService.analyticsDebug) {
        console.log('Google Tag page view:', pageName, enrichedProperties);
      }
    } catch (error) {
      console.error('Google Tag page view error:', error);
    }
  }

  track(event: string, properties?: EventProperties): void {
    if (!this.isReady()) {
      return;
    }

    try {
      const enrichedProperties = this.userContextService.enrichEventProperties(properties);
      window.gtag('event', event, enrichedProperties);

      if (this.configService.analyticsDebug) {
        console.log('Google Tag track:', event, enrichedProperties);
      }
    } catch (error) {
      console.error('Google Tag track error:', error);
    }
  }

  setUserProperties(properties: Partial<AnalyticsUser>): void {
    if (!this.isReady()) {
      return;
    }

    try {
      window.gtag('set', 'user_properties', properties);

      if (this.configService.analyticsDebug) {
        console.log('Google Tag set user properties:', properties);
      }
    } catch (error) {
      console.error('Google Tag set user properties error:', error);
    }
  }

  reset(): void {
    if (!this.isReady()) {
      return;
    }

    try {
      window.gtag('set', 'user_properties', {});

      if (this.configService.analyticsDebug) {
        console.log('Google Tag reset');
      }
    } catch (error) {
      console.error('Google Tag reset error:', error);
    }
  }

  private isReady(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (!this.configService.analyticsEnabled) {
      return false;
    }

    if (!this.initialized) {
      console.warn('Google Tag not initialized. Call initialize() first.');
      return false;
    }

    if (typeof window.gtag !== 'function') {
      console.warn('Google Tag script not loaded');
      return false;
    }

    return true;
  }
}
