import { Component, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
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
export class NewsletterModalComponent implements OnDestroy {

  private static readonly AUTO_CLOSE_DELAY_MS = 2000;

  private readonly dialogRef = inject(MatDialogRef<NewsletterModalComponent>);
  private readonly analyticsService = inject(AnalyticsService);

  protected readonly analyticsLocation = ANALYTICS_LOCATIONS.HERO_MODAL;

  private autoCloseTimeoutId?: ReturnType<typeof setTimeout>;

  protected onSubmit(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_MODAL_SUBMITTED, {
      location: this.analyticsLocation
    });
    this.autoCloseTimeoutId = setTimeout(
      () => this.dialogRef.close({ subscribed: true }),
      NewsletterModalComponent.AUTO_CLOSE_DELAY_MS
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.autoCloseTimeoutId);
  }

  protected onDismiss(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_MODAL_DISMISSED, {
      location: this.analyticsLocation
    });
    this.dialogRef.close({ subscribed: false });
  }
}
