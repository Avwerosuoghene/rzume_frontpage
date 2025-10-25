export interface CarouselConfig {
  mobileItemsPerView: number;
  desktopItemsPerView: number;
  desktopBreakpoint: number;
  autoScrollInterval: number;
  scrollBehavior: ScrollBehavior;
}

export interface CarouselState {
  currentIndex: number;
  itemsPerView: number;
  totalPages: number;
  totalItems: number;
}

export class CarouselHelper {
  
  /**
   * Calculate items per view based on screen width
   */
  static getItemsPerView(config: CarouselConfig): number {
    return window.innerWidth >= config.desktopBreakpoint 
      ? config.desktopItemsPerView 
      : config.mobileItemsPerView;
  }
  
  /**
   * Calculate total pages based on items and items per view
   */
  static calculateTotalPages(totalItems: number, itemsPerView: number): number {
    return Math.ceil(totalItems / itemsPerView);
  }
  
  /**
   * Calculate current index based on scroll position
   */
  static calculateCurrentIndex(
    scrollLeft: number, 
    scrollWidth: number, 
    totalItems: number, 
    itemsPerView: number
  ): number {
    const itemWidth = scrollWidth / totalItems;
    const slideWidth = itemWidth * itemsPerView;
    return Math.round(scrollLeft / slideWidth);
  }
  
  /**
   * Calculate scroll position for a given index
   */
  static calculateScrollPosition(
    index: number, 
    scrollWidth: number, 
    totalItems: number, 
    itemsPerView: number
  ): number {
    const itemWidth = scrollWidth / totalItems;
    return index * itemWidth * itemsPerView;
  }
  
  /**
   * Get next index with wrap-around
   */
  static getNextIndex(currentIndex: number, totalPages: number): number {
    return (currentIndex + 1) % totalPages;
  }
  
  /**
   * Get previous index with wrap-around
   */
  static getPreviousIndex(currentIndex: number, totalPages: number): number {
    return currentIndex === 0 ? totalPages - 1 : currentIndex - 1;
  }
  
  /**
   * Validate index is within bounds
   */
  static isValidIndex(index: number, totalPages: number): boolean {
    return index >= 0 && index < totalPages;
  }
  
  /**
   * Scroll container to specific position
   */
  static scrollToPosition(
    container: HTMLElement, 
    position: number, 
    behavior: ScrollBehavior = 'smooth'
  ): void {
    container.scrollTo({
      left: position,
      behavior
    });
  }
  
  /**
   * Create indicators array
   */
  static createIndicators(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  
  /**
   * Setup auto-scroll interval
   */
  static setupAutoScroll(
    callback: () => void, 
    interval: number
  ): number {
    return window.setInterval(callback, interval);
  }
  
  /**
   * Clear auto-scroll interval
   */
  static clearAutoScroll(intervalId: number | null): void {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}
