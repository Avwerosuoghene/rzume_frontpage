import { Injectable } from '@angular/core';
import { AnalyticsService, EventProperties, AnalyticsUser } from './analytics.service';
import { GoogleTagService } from './google-tag.service';
import { MixpanelService } from './mixpanel.service';

@Injectable({
  providedIn: 'root'
})
export class CompositeAnalyticsService extends AnalyticsService {
  private services: AnalyticsService[] = [];

  constructor(
    private googleTagService: GoogleTagService,
    private mixpanelService: MixpanelService
  ) {
    super();
    this.services = [this.googleTagService, this.mixpanelService];
  }

  initialize(): void {
    this.services.forEach(service => {
      try {
        service.initialize();
      } catch (error) {
        console.error('Analytics service initialization error:', error);
      }
    });
  }

  trackPageView(pageName: string, properties?: EventProperties): void {
    this.services.forEach(service => {
      try {
        service.trackPageView(pageName, properties);
      } catch (error) {
        console.error('Analytics page view error:', error);
      }
    });
  }

  track(event: string, properties?: EventProperties): void {
    this.services.forEach(service => {
      try {
        service.track(event, properties);
      } catch (error) {
        console.error('Analytics track error:', error);
      }
    });
  }

  setUserProperties(properties: Partial<AnalyticsUser>): void {
    this.services.forEach(service => {
      try {
        service.setUserProperties(properties);
      } catch (error) {
        console.error('Analytics set user properties error:', error);
      }
    });
  }

  reset(): void {
    this.services.forEach(service => {
      try {
        service.reset();
      } catch (error) {
        console.error('Analytics reset error:', error);
      }
    });
  }
}
