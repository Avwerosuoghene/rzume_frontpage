import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import mixpanel from 'mixpanel-browser';
import { ConfigService } from '../config.service';
import { AnalyticsService, EventProperties, AnalyticsUser } from './analytics.service';
import { AnalyticsUserContextService } from '../analytics-user-context.service';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService extends AnalyticsService {
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

    if (this.initialized) {
      return;
    }

    try {
      const token = this.getMixpanelToken();
      const isEnabled = this.configService.isAnalyticsEnabled;

      if (!token || !isEnabled) {
        console.warn('Mixpanel: Analytics disabled or token not configured');
        return;
      }

      mixpanel.init(token, {
        debug: this.configService.analyticsDebug,
        track_pageview: false,
        persistence: 'localStorage',
        ignore_dnt: true
      });

      this.initialized = true;

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel initialized:', token);
      }
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
    }
  }

  trackPageView(pageName: string, properties?: EventProperties): void {
    if (!this.initialized) {
      return;
    }

    try {
      const eventName = `${pageName}_page_loaded`;
      const enrichedProperties = this.userContextService.enrichEventProperties({
        page_name: pageName,
        page_title: document.title,
        url: window.location.href,
        device_type: this.getDeviceType(),
        ...properties
      });

      mixpanel.track(eventName, enrichedProperties);

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel page view:', eventName, enrichedProperties);
      }
    } catch (error) {
      console.error('Mixpanel page view error:', error);
    }
  }

  track(event: string, properties?: EventProperties): void {
    if (!this.initialized) {
      return;
    }

    try {
      const enrichedProperties = this.userContextService.enrichEventProperties({
        ...properties,
        device_type: this.getDeviceType()
      });

      mixpanel.track(event, enrichedProperties);

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel track:', event, enrichedProperties);
      }
    } catch (error) {
      console.error('Mixpanel track error:', error);
    }
  }

  setUserProperties(properties: Partial<AnalyticsUser>): void {
    if (!this.initialized) {
      return;
    }

    try {
      const userProps: any = {};
      if (properties.email) userProps.$email = properties.email;
      if (properties.name) userProps.$name = properties.name;
      if (properties.customProperties) {
        Object.assign(userProps, properties.customProperties);
      }

      mixpanel.people.set(userProps);

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel set user properties:', userProps);
      }
    } catch (error) {
      console.error('Mixpanel set user properties error:', error);
    }
  }

  reset(): void {
    if (!this.initialized) {
      return;
    }

    try {
      mixpanel.reset();

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel reset');
      }
    } catch (error) {
      console.error('Mixpanel reset error:', error);
    }
  }

  identify(userId: string, properties?: Partial<AnalyticsUser>): void {
    if (!this.initialized) {
      return;
    }

    try {
      mixpanel.identify(userId);

      if (properties) {
        this.setUserProperties(properties);
      }

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel identify:', userId, properties);
      }
    } catch (error) {
      console.error('Mixpanel identify error:', error);
    }
  }

  setUserProperty(property: string, value: any): void {
    if (!this.initialized) {
      return;
    }

    try {
      const userProps: any = {};
      userProps[property] = value;
      mixpanel.people.set(userProps);

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel set user property:', property, value);
      }
    } catch (error) {
      console.error('Mixpanel set user property error:', error);
    }
  }

  incrementUserProperty(property: string, value: number = 1): void {
    if (!this.initialized) {
      return;
    }

    try {
      mixpanel.people.increment(property, value);

      if (this.configService.analyticsDebug) {
        console.log('Mixpanel increment:', property, value);
      }
    } catch (error) {
      console.error('Mixpanel increment error:', error);
    }
  }

  private getMixpanelToken(): string {
    const config = this.configService.getConfig();
    return (config.analytics as any)?.mixpanelToken || '';
  }

  private getDeviceType(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return 'server';
    }
    const width = window.innerWidth;
    if (width < 599) return 'mobile';
    if (width < 950) return 'tablet';
    return 'desktop';
  }
}
