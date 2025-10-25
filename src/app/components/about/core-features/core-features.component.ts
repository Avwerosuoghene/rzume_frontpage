import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreFeaturesSection, CoreFeature, CORE_FEATURES_SECTION, CORE_FEATURES } from '../../../core/models';
import { CoreFeatureComponent } from './core-feature/core-feature.component';

@Component({
  selector: 'app-core-features',
  standalone: true,
  imports: [CommonModule, CoreFeatureComponent],
  templateUrl: './core-features.component.html',
  styleUrls: ['./core-features.component.scss']
})
export class CoreFeaturesComponent {
  sectionData: CoreFeaturesSection = CORE_FEATURES_SECTION;
  coreFeatures: CoreFeature[] = CORE_FEATURES;
}
