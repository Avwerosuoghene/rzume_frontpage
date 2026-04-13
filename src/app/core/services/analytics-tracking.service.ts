import { Injectable, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './analytics/analytics.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsTrackingService implements OnInit {
  private readonly PAGE_NAME_MAP: Record<string, string> = {
    '/': 'home',
    '/about': 'about',
    '/features': 'features',
    '/faq': 'faq',
    '/blog': 'blog',
    '/terms-conditions': 'terms-conditions'
  };

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const pageName = this.getPageNameFromUrl(event.urlAfterRedirects);
        this.analyticsService.trackPageView(pageName, {
          url: event.urlAfterRedirects
        });
      });
  }

  private getPageNameFromUrl(url: string): string {
    const path = url.split('?')[0].split('#')[0];
    return this.PAGE_NAME_MAP[path] || path.substring(1) || 'home';
  }
}
