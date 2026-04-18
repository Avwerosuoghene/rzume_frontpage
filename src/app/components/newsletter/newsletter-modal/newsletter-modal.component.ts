import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NewsletterFormComponent } from '../newsletter-form/newsletter-form.component';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { AnalyticsEvent } from '../../../core/models/enums/analytics-events.enum';
import { ANALYTICS_LOCATIONS } from '../../../core/models';

@Component({
  selector: 'app-newsletter-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, NewsletterFormComponent],
  templateUrl: './newsletter-modal.component.html',
  styleUrl: './newsletter-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterModalComponent {
  private dialogRef = inject(MatDialogRef<NewsletterModalComponent>);
  private analyticsService = inject(AnalyticsService);
  
  protected readonly analyticsLocation = ANALYTICS_LOCATIONS.HERO_MODAL;

  protected onSubmit(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_MODAL_SUBMITTED, {
      location: this.analyticsLocation
    });
    this.dialogRef.close({ subscribed: true });
  }

  protected onDismiss(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_MODAL_DISMISSED, {
      location: this.analyticsLocation
    });
    this.dialogRef.close({ subscribed: false });
  }
}
