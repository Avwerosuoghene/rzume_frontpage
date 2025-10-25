import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { 
  TestimonialsSection, 
  Testimonial, 
  TESTIMONIALS, 
  TESTIMONIALS_SECTION
} from '../../../core/models';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TestimonialComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent implements OnInit {
  sectionData: TestimonialsSection = TESTIMONIALS_SECTION;
  testimonials: Testimonial[] = TESTIMONIALS;
  
  swiperBreakpoints = {
    768: {
      slidesPerView: 3,
      spaceBetween: 32,
      slidesPerGroup: 3
    }
  };
  
  ngOnInit(): void {
    // Register Swiper custom elements
    register();
  }
}
