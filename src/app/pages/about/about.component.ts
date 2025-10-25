import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/about/hero/hero.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AboutFeaturesComponent } from '../../components/about/about-features/about-features';
import { CoreFeaturesComponent } from '../../components/about/core-features/core-features.component';
import { TestimonialsComponent } from '../../components/about/testimonials/testimonials';
import { BlogComponent } from '../../components/about/blog/blog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { 
  ABOUT_HERO, 
  HEADER_CONFIG,
  HeroSection,
  HeaderConfig
} from '../../core/models';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    HeaderComponent,
    AboutFeaturesComponent,
    CoreFeaturesComponent,
    TestimonialsComponent,
    BlogComponent,
    FooterComponent,
    MatButtonModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  heroData: HeroSection = ABOUT_HERO;
  headerConfig: HeaderConfig = HEADER_CONFIG;

  ngOnInit(): void {
    this.setActiveNavigation();
  }

  private setActiveNavigation(): void {
    this.headerConfig = {
      ...this.headerConfig,
      navigationItems: this.headerConfig.navigationItems.map(item => ({
        ...item,
        isActive: item.route === '/about'
      }))
    };
  }
}
