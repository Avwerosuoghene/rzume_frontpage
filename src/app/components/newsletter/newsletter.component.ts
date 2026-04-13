import { Component, inject } from '@angular/core';
import { ANALYTICS_LOCATIONS } from '../../core/models';
import { AnalyticsEvent } from '../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  private analyticsService = inject(AnalyticsService);
  zcScptlessSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    const emailInput = form.querySelector('input[name="CONTACT_EMAIL"]') as HTMLInputElement;
    const email = emailInput?.value || '';

    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_SUBMITTED, {
      location: ANALYTICS_LOCATIONS.FOOTER_NEWSLETTER,
      email_domain: email.split('@')[1] || 'unknown'
    });

    const spmElement = form.querySelector('#zc_spmSubmit');
    if (spmElement) spmElement.remove();

    form.submit();
  }
}