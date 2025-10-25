import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreFeature } from '../../../../core/models';

@Component({
  selector: 'app-core-feature',
  imports: [CommonModule],
  templateUrl: './core-feature.component.html',
  styleUrl: './core-feature.component.scss'
})
export class CoreFeatureComponent {
  @Input() feature!: CoreFeature;
}
