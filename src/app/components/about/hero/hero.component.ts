import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSection, AUTH_URLS } from '../../../core/models';
import { MatButtonModule } from '@angular/material/button';
import { AnimationService } from '../../../core/services';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @Input() heroData!: HeroSection;
  @Input() showButtons: boolean = true;
  @Input() isDark: boolean = true;

  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('heroImage') heroImage!: ElementRef<HTMLElement>;

  constructor(private animationService: AnimationService) {}

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
    window.open(AUTH_URLS.registerUrl, '_blank');
  }

  navigateToNewsletter(): void {
    const newsletterSection = document.querySelector('.newsletter-section');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
