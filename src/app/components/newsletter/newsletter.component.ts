import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NewsletterFormIframeComponent } from './newsletter-form-iframe/newsletter-form-iframe.component';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [NewsletterFormIframeComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterComponent {}
