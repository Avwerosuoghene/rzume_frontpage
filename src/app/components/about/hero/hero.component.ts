import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSection, AUTH_URLS, ANALYTICS_LOCATIONS } from '../../../core/models';
import { MatButtonModule } from '@angular/material/button';
import { AnimationService } from '../../../core/services';
import { AnalyticsEvent } from '../../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { MatDialog } from '@angular/material/dialog';
import { NewsletterModalComponent } from '../../newsletter/newsletter-modal/newsletter-modal.component';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private dialog = inject(MatDialog);

  @Input() heroData!: HeroSection;
  @Input() showButtons: boolean = true;
  @Input() isDark: boolean = true;

  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('heroImage') heroImage!: ElementRef<HTMLElement>;

  private analyticsService = inject(AnalyticsService);

  constructor(private animationService: AnimationService) { }

  ngAfterViewInit(): void {
    this.initializeHeroAnimation();
  }

  ngOnDestroy(): void {
    if (this.heroSection) {
      this.animationService.cleanupElement(this.heroSection.nativeElement);
    }
  }

  private initializeHeroAnimation(): void {
    if (this.heroSection && this.heroImage) {
      this.animationService.initHeroScrollAnimation(
        this.heroSection.nativeElement,
        this.heroImage.nativeElement
      );
    }
  }

  navigateToSignUp(): void {
    this.analyticsService.track(AnalyticsEvent.SIGNUP_BUTTON_CLICKED, {
      location: ANALYTICS_LOCATIONS.HERO,
      button_text: this.heroData.primaryButtonText,
      destination: AUTH_URLS.registerUrl
    });
    window.open(AUTH_URLS.registerUrl, '_blank');
  }

  navigateToNewsletter(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_BUTTON_CLICKED, {
      location: ANALYTICS_LOCATIONS.HERO,
      button_text: this.heroData.secondaryButtonText
    });

    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_MODAL_OPENED, {
      location: ANALYTICS_LOCATIONS.HERO
    });

    this.dialog.open(NewsletterModalComponent, {
      width: '90%',
      maxWidth: '600px',
      panelClass: 'newsletter-modal-container',
      backdropClass: 'newsletter-modal-backdrop',
      autoFocus: false,
      disableClose: false
    });
  }
}
