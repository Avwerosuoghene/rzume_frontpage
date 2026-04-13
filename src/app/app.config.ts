import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigService } from './core/services';
import { AnalyticsService } from './core/services/analytics/analytics.service';
import { CompositeAnalyticsService } from './core/services/analytics/composite-analytics.service';
import { AnalyticsTrackingService } from './core/services/analytics-tracking.service';
import { LinkedInTrackingService } from './core/services/analytics/linkedin-tracking.service';
import { AnalyticsInterceptor } from './core/interceptors/analytics.interceptor';
import { routes } from './app.routes';

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

export function initializeAnalytics(
  analyticsService: AnalyticsService,
  linkedInService: LinkedInTrackingService,
  configService: ConfigService
) {
  return () => {
    return configService.waitForConfig().then(() => {
      analyticsService.initialize();
      linkedInService.initialize();
    });
  };
}

export function initializeAnalyticsTracking(
  analyticsTrackingService: AnalyticsTrackingService
) {
  return () => {
    setTimeout(() => {
      analyticsTrackingService.ngOnInit();
    }, 100);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    })),
    
    {
      provide: AnalyticsService,
      useClass: CompositeAnalyticsService
    },
    
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAnalytics,
      deps: [AnalyticsService, LinkedInTrackingService, ConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAnalyticsTracking,
      deps: [AnalyticsTrackingService],
      multi: true
    },
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AnalyticsInterceptor,
      multi: true
    }
  ]
};
