import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay } from 'rxjs';
import { AppConfig } from '../models/interfaces/config.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private config: AppConfig | null = null;
  private config$: Observable<AppConfig> | null = null;

  loadConfig(): Observable<AppConfig> {
    if (!this.config$) {
      this.config$ = this.http.get<AppConfig>('/assets/config/config.json').pipe(
        tap(config => {
          this.config = config;
          if (config.analytics.debug) {
            console.log('Configuration loaded:', config);
          }
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.config$;
  }

  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return this.config;
  }

  get googleTagId(): string {
    return this.getConfig().analytics.googleTagId;
  }

  get analyticsEnabled(): boolean {
    return this.getConfig().analytics.enabled;
  }

  get analyticsDebug(): boolean {
    return this.getConfig().analytics.debug;
  }

  get linkedInPartnerId(): string {
    return this.getConfig().analytics.linkedInPartnerId || '';
  }

  get mixpanelToken(): string {
    return (this.getConfig().analytics as any)?.mixpanelToken || '';
  }

  get isAnalyticsEnabled(): boolean {
    return this.getConfig().analytics.enabled !== false;
  }

  waitForConfig(): Promise<void> {
    return new Promise(resolve => {
      if (this.config) {
        resolve();
      } else {
        this.loadConfig().subscribe(() => resolve());
      }
    });
  }
}
