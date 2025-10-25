import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { 
  TestimonialsSection, 
  Testimonial, 
  TESTIMONIALS, 
  TESTIMONIALS_SECTION,
  CAROUSEL_CONFIG,
  CarouselHelper,
  CarouselConfig
} from '../../../core/models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TestimonialComponent],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('testimonialContainer', { static: false }) testimonialContainer!: ElementRef<HTMLDivElement>;

  sectionData: TestimonialsSection = TESTIMONIALS_SECTION;
  testimonials: Testimonial[] = TESTIMONIALS;
  carouselConfig: CarouselConfig = CAROUSEL_CONFIG;
  
  currentIndex = 0;
  autoScrollInterval: number | null = null;
  itemsPerView = 1;
  totalPages = 0;
  
  ngOnInit(): void {
    this.updateItemsPerView();
    this.calculateTotalPages();
    this.startAutoScroll();
    
    // Listen for window resize
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  ngAfterViewInit(): void {
    this.updateItemsPerView();
    this.calculateTotalPages();
    this.setupScrollListener();
  }
  
  ngOnDestroy(): void {
    this.stopAutoScroll();
    window.removeEventListener('resize', this.onResize.bind(this));
    
    // Clean up scroll listener
    if (this.testimonialContainer) {
      const container = this.testimonialContainer.nativeElement;
      container.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }
  
  private onResize(): void {
    this.updateItemsPerView();
    this.calculateTotalPages();
    this.scrollToIndex(this.currentIndex);
  }
  
  private updateItemsPerView(): void {
    this.itemsPerView = CarouselHelper.getItemsPerView(this.carouselConfig);
  }
  
  private calculateTotalPages(): void {
    this.totalPages = CarouselHelper.calculateTotalPages(this.testimonials.length, this.itemsPerView);
  }
  
  private setupScrollListener(): void {
    if (!this.testimonialContainer) return;
    
    const container = this.testimonialContainer.nativeElement;
    container.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }
  
  private onScroll(): void {
    if (!this.testimonialContainer) return;
    
    const container = this.testimonialContainer.nativeElement;
    const newIndex = CarouselHelper.calculateCurrentIndex(
      container.scrollLeft,
      container.scrollWidth,
      this.testimonials.length,
      this.itemsPerView
    );
    
    if (newIndex !== this.currentIndex && CarouselHelper.isValidIndex(newIndex, this.totalPages)) {
      this.currentIndex = newIndex;
    }
  }
  
  scrollToIndex(index: number): void {
    if (!this.testimonialContainer) return;
    
    const container = this.testimonialContainer.nativeElement;
    const scrollPosition = CarouselHelper.calculateScrollPosition(
      index,
      container.scrollWidth,
      this.testimonials.length,
      this.itemsPerView
    );
    
    CarouselHelper.scrollToPosition(container, scrollPosition, this.carouselConfig.scrollBehavior);
    this.currentIndex = index;
  }
  
  nextSlide(): void {
    const nextIndex = CarouselHelper.getNextIndex(this.currentIndex, this.totalPages);
    this.scrollToIndex(nextIndex);
  }
  
  prevSlide(): void {
    const prevIndex = CarouselHelper.getPreviousIndex(this.currentIndex, this.totalPages);
    this.scrollToIndex(prevIndex);
  }
  
  goToSlide(index: number): void {
    this.scrollToIndex(index);
  }
  
  private startAutoScroll(): void {
    this.autoScrollInterval = CarouselHelper.setupAutoScroll(
      () => this.nextSlide(),
      this.carouselConfig.autoScrollInterval
    );
  }
  
  private stopAutoScroll(): void {
    CarouselHelper.clearAutoScroll(this.autoScrollInterval);
    this.autoScrollInterval = null;
  }
  
  onMouseEnter(): void {
    this.stopAutoScroll();
  }
  
  onMouseLeave(): void {
    this.startAutoScroll();
  }
  
  get indicators(): number[] {
    return CarouselHelper.createIndicators(this.totalPages);
  }
}
