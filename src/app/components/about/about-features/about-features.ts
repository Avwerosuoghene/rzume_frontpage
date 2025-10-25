import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ABOUT_FEATURES_SECTION, AboutFeatureCard, ABOUT_FEATURE_CARDS } from '../../../core/models';

@Component({
  selector: 'app-about-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-features.html',
  styleUrls: ['./about-features.scss']
})
export class AboutFeaturesComponent {
  sectionData = ABOUT_FEATURES_SECTION;
  featureCards: AboutFeatureCard[] = ABOUT_FEATURE_CARDS;
}
