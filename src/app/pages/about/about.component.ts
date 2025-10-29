import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  HeaderConfig,
  AUTH_URLS
} from '../../core/models';
import { MatButtonModule } from '@angular/material/button';
import { ScrollHeaderHelper, HeaderTheme, ScrollHeaderConfig, NavigationHelper } from '../../core/helpers';

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
export class AboutComponent implements OnInit, AfterViewInit {
  private static readonly DOM_READY_DELAY_MS = 100;
  private static readonly SCROLL_BUFFER_DISTANCE_PX = 100;
  
  heroData: HeroSection = ABOUT_HERO;
  headerConfig: HeaderConfig = HEADER_CONFIG;
  
  private readonly scrollHelper: ScrollHeaderHelper;
  private readonly scrollConfig: ScrollHeaderConfig = {
    bufferDistance: AboutComponent.SCROLL_BUFFER_DISTANCE_PX,
    initialTheme: HeaderTheme.DARK,
    darkTheme: HeaderTheme.DARK,
    lightTheme: HeaderTheme.LIGHT
  };
  
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;

  constructor() {
    this.scrollHelper = new ScrollHeaderHelper(this.scrollConfig);
  }

  ngOnInit(): void {
    this.setActiveNavigation();
  }

  ngAfterViewInit(): void {
    this.initializeScrollHelper();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollHelper.checkScrollPosition();
  }

  get isHeaderDark(): boolean {
    return this.scrollHelper.isDarkTheme();
  }

  private initializeScrollHelper(): void {
    this.scrollHelper.setTargetElement(this.heroSection);
    
    setTimeout(() => {
      this.scrollHelper.checkScrollPosition();
    }, AboutComponent.DOM_READY_DELAY_MS);
  }

  private setActiveNavigation(): void {
    this.headerConfig = NavigationHelper.setActiveNavigation(this.headerConfig, '/about');
  }

  navigateToSignUp(): void {
    window.open(AUTH_URLS.registerUrl, '_blank');
  }
}
