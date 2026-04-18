import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NewsletterFormComponent } from './newsletter-form/newsletter-form.component';
import { ANALYTICS_LOCATIONS } from '../../core/models';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [NewsletterFormComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterComponent {
  protected readonly analyticsLocation = ANALYTICS_LOCATIONS.FOOTER_NEWSLETTER;
}