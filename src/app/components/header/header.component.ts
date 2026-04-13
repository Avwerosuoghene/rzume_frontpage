import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderConfig, ANALYTICS_LOCATIONS } from '../../core/models';
import { AnalyticsEvent } from '../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {
  @Input() headerConfig!: HeaderConfig;
  @Input() isDark: boolean = true;
  
  isMenuOpen = false;
  private analyticsService = inject(AnalyticsService);

  constructor(private router: Router) {}
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateToLogin(): void {
    this.analyticsService.track(AnalyticsEvent.LOGIN_BUTTON_CLICKED, {
      location: ANALYTICS_LOCATIONS.HEADER,
      destination: this.headerConfig.loginUrl
    });
    window.open(this.headerConfig.loginUrl, '_blank');
  }

  navigateToSignUp(): void {
    this.analyticsService.track(AnalyticsEvent.SIGNUP_BUTTON_CLICKED, {
      location: ANALYTICS_LOCATIONS.HEADER,
      destination: this.headerConfig.signUpUrl
    });
    window.open(this.headerConfig.signUpUrl, '_blank');
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }
}
