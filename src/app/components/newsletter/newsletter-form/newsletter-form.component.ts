import { Component, Input, Output, EventEmitter, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ANALYTICS_LOCATIONS, AnalyticsLocation } from '../../../core/models';
import { AnalyticsEvent } from '../../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';

type SubmitState = 'idle' | 'pending' | 'success' | 'error';

@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newsletter-form.component.html',
  styleUrl: './newsletter-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterFormComponent {
  private static readonly RESPONSE_TIMEOUT_MS = 35000;

  @Input() buttonText = 'Subscribe';
  @Input() analyticsLocation: AnalyticsLocation = ANALYTICS_LOCATIONS.FOOTER_NEWSLETTER;
  @Input() showInlineLayout = false;

  @Output() submitted = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  @ViewChild('newsletterFormElement') formElement!: ElementRef<HTMLFormElement>;

  private analyticsService = inject(AnalyticsService);

  readonly submitState = signal<SubmitState>('idle');
  protected readonly errorMessage = signal('');

  submitForm(): void {
    if (this.formElement?.nativeElement) {
      this.formElement.nativeElement.requestSubmit();
    }
  }

  protected async zcScptlessSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const firstNameInput = form.querySelector('input[name="CONTACT_FIRST_NAME"]') as HTMLInputElement;
    const emailInput = form.querySelector('input[name="CONTACT_EMAIL"]') as HTMLInputElement;

    const firstName = firstNameInput?.value || '';
    const email = emailInput?.value || '';

    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_SUBMITTED, {
      location: this.analyticsLocation,
      email_domain: email.split('@')[1] || 'unknown',
      has_name: !!firstName
    });

    const formData = new FormData(form);
    formData.delete('zc_spmSubmit');

    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        params.set(key, value);
      }
    });

    form.reset();
    this.submitState.set('pending');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NewsletterFormComponent.RESPONSE_TIMEOUT_MS);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: controller.signal
      });

      // Zoho returns HTTP 200 even for genuine failures (e.g. a stale/mismatched
      // zc_formIx renders a 200 "Problem in optin" error page), so status alone can't
      // be trusted. Confirmed-success responses are always plain text or JSON (never a
      // full HTML document); Zoho's error pages are a styled <html> document whose
      // "unsubscribed.svg" icon filename makes any naive substring match on "subscri"
      // unreliable, so the HTML-document check has to come first.
      const body = await response.text();
      const isHtmlErrorPage = /<html[\s>]/i.test(body);
      const confirmsSignup = /thank you for subscribing|already subscribed/i.test(body);

      if (!response.ok || isHtmlErrorPage || !confirmsSignup) {
        throw new Error(`Zoho did not confirm the subscription (status ${response.status})`);
      }

      this.submitState.set('success');
      this.submitted.emit();
    } catch (err) {
      this.submitState.set('error');
      this.errorMessage.set('Something went wrong submitting your signup. Please try again.');

      this.analyticsService.track(AnalyticsEvent.NEWSLETTER_ERROR, {
        location: this.analyticsLocation,
        reason: err instanceof Error ? err.name : 'unknown'
      });

      this.error.emit(this.errorMessage());
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
