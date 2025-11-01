import { Component, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ABOUT_FEATURES_SECTION, AboutFeatureCard, ABOUT_FEATURE_CARDS } from '../../../core/models';
import { AnimationService } from '../../../core/services';

@Component({
  selector: 'app-about-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-features.html',
  styleUrls: ['./about-features.scss']
})
export class AboutFeaturesComponent implements AfterViewInit {
  sectionData = ABOUT_FEATURES_SECTION;
  featureCards: AboutFeatureCard[] = ABOUT_FEATURE_CARDS;

  @ViewChildren('featureCard') featureCardElements!: QueryList<ElementRef<HTMLElement>>;

  constructor(private animationService: AnimationService) {}

  ngAfterViewInit(): void {
    if (this.featureCardElements) {
      const cardElements = this.featureCardElements.map(card => card.nativeElement);
      this.animationService.initStaggeredCardAnimation(cardElements);
    }
  }
}
