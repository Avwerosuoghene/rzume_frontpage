import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ANALYTICS_LOCATIONS, AnalyticsLocation } from '../../../core/models';
import { AnalyticsEvent } from '../../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newsletter-form.component.html',
  styleUrl: './newsletter-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterFormComponent {
  @Input() buttonText = 'Subscribe';
  @Input() analyticsLocation: AnalyticsLocation = ANALYTICS_LOCATIONS.FOOTER_NEWSLETTER;
  @Input() showInlineLayout = false;
  
  @Output() submitted = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();
  
  @ViewChild('newsletterFormElement') formElement!: ElementRef<HTMLFormElement>;
  
  private analyticsService = inject(AnalyticsService);

  submitForm(): void {
    if (this.formElement?.nativeElement) {
      this.formElement.nativeElement.requestSubmit();
    }
  }

  protected zcScptlessSubmit(event: Event): void {
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

    const spmElement = form.querySelector('#zc_spmSubmit');
    if (spmElement) spmElement.remove();

    form.submit();
    this.submitted.emit();
    
    form.reset();
  }
}
