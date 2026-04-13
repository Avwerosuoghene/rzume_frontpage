import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../config.service';

declare global {
  interface Window {
    _linkedin_partner_id: string;
    _linkedin_data_partner_ids: string[];
    lintrk: (action: string, data?: any) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class LinkedInTrackingService {
  private platformId = inject(PLATFORM_ID);
  private initialized = false;

  constructor(private configService: ConfigService) {}

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initialized) return;

    const partnerId = this.configService.linkedInPartnerId;
    const isEnabled = this.configService.isAnalyticsEnabled;

    if (!partnerId || !isEnabled) return;

    try {
      window._linkedin_partner_id = partnerId;
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(window._linkedin_partner_id);

      if (!window.lintrk) {
        window.lintrk = function(action: string, data?: any) {
          (window.lintrk as any).q = (window.lintrk as any).q || [];
          (window.lintrk as any).q.push([action, data]);
        };
        (window.lintrk as any).q = [];
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }

      this.addNoscriptFallback(partnerId);
      this.initialized = true;

      if (this.configService.analyticsDebug) {
        console.log('LinkedIn Insight initialized with partner ID:', partnerId);
      }
    } catch (error) {
      console.error('LinkedIn Insight initialization failed:', error);
    }
  }

  async trackConversion(conversionId?: string, value?: number): Promise<void> {
    if (!this.initialized || !isPlatformBrowser(this.platformId)) return;

    try {
      const data: any = {};
      if (conversionId) data.conversion_id = conversionId;
      if (value) data.conversion_value = value;

      window.lintrk('track', data);

      if (this.configService.analyticsDebug) {
        console.log('LinkedIn conversion tracked:', data);
      }
    } catch (error) {
      console.error('LinkedIn conversion tracking error:', error);
    }
  }

  private addNoscriptFallback(partnerId: string): void {
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.alt = '';
    img.src = `https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);
  }
}
