import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewsletterFormIframeComponent } from '../newsletter-form-iframe/newsletter-form-iframe.component';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { AnalyticsEvent } from '../../../core/models/enums/analytics-events.enum';
import { ANALYTICS_LOCATIONS } from '../../../core/models';

@Component({
  selector: 'app-newsletter-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, NewsletterFormIframeComponent],
  templateUrl: './newsletter-modal.component.html',
  styleUrl: './newsletter-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterModalComponent implements OnInit, OnDestroy {
  // The signup form is a cross-origin iframe (Zoho), so there is no way to detect a real
  // submit/success from this page — no postMessage, no readable navigation. This is a
  // best-effort guess at "the user has had time to fill in and submit the form", not a
  // confirmation. It closes regardless of whether they actually subscribed.
  private static readonly AUTO_CLOSE_DELAY_MS = 20000;

  private readonly dialogRef = inject(MatDialogRef<NewsletterModalComponent>);
  private readonly analyticsService = inject(AnalyticsService);

  protected readonly analyticsLocation = ANALYTICS_LOCATIONS.HERO_MODAL;

  private autoCloseTimeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.autoCloseTimeoutId = setTimeout(
      () => this.dialogRef.close({ subscribed: undefined }),
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
