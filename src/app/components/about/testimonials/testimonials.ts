import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { TestimonialsSection, Testimonial, TESTIMONIALS, TESTIMONIALS_SECTION } from '../../../core/models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TestimonialComponent],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent {
  sectionData: TestimonialsSection = TESTIMONIALS_SECTION;
  testimonials: Testimonial[] = TESTIMONIALS;
}
