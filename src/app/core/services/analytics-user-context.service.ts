import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventProperties, AnalyticsUserContext } from '../models/interfaces/analytics.interface';

@Injectable({ providedIn: 'root' })
export class AnalyticsUserContextService {
  private platformId = inject(PLATFORM_ID);
  private contextSubject = new BehaviorSubject<AnalyticsUserContext>({
    sessionId: this.generateSessionId(),
    deviceType: this.getDeviceType()
  });

  context$: Observable<AnalyticsUserContext> = this.contextSubject.asObservable();

  enrichEventProperties(properties?: EventProperties): EventProperties {
    const context = this.contextSubject.value;
    return {
      ...properties,
      session_id: context.sessionId,
      device_type: context.deviceType,
      timestamp: new Date().toISOString()
    };
  }

  updateContext(updates: Partial<AnalyticsUserContext>): void {
    this.contextSubject.next({
      ...this.contextSubject.value,
      ...updates
    });
  }

  reset(): void {
    this.contextSubject.next({
      sessionId: this.generateSessionId(),
      deviceType: this.getDeviceType()
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private getDeviceType(): string {
    if (!isPlatformBrowser(this.platformId)) return 'unknown';
    
    const width = window.innerWidth;
    if (width < 599) return 'mobile';
    if (width < 950) return 'tablet';
    return 'desktop';
  }
}
