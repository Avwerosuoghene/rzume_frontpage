import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSection } from '../../../core/models';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input() heroData!: HeroSection;
  @Input() showButtons: boolean = true;
  @Input() isDark: boolean = true;
}
