import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const ZOHO_OPTIN_URL =
  'https://hwyk-zgpm.maillist-manage.com/ua/Optin?od=11287ecd4bf5c2&zx=135c9c79d&tD=115ecde4ef50a7933&sD=115ecde4ef50a78ad';

@Component({
  selector: 'app-newsletter-form-iframe',
  standalone: true,
  templateUrl: './newsletter-form-iframe.component.html',
  styleUrl: './newsletter-form-iframe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterFormIframeComponent {
  // Zoho's own hosted form is ~195px tall regardless of width; overridable per placement.
  @Input() height = '220px';

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly iframeUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(ZOHO_OPTIN_URL);
}
