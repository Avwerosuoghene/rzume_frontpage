import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderConfig } from '../../core/models';

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

  constructor(private router: Router) {}
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateToLogin(): void {
    window.open(this.headerConfig.loginUrl, '_blank');
  }

  navigateToSignUp(): void {
    window.open(this.headerConfig.signUpUrl, '_blank');
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }
}
