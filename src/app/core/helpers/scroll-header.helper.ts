import { ElementRef } from '@angular/core';

export interface ScrollHeaderConfig {
  bufferDistance: number;
  initialTheme: HeaderTheme;
  darkTheme: HeaderTheme;
  lightTheme: HeaderTheme;
}

export enum HeaderTheme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface ScrollPosition {
  current: number;
  threshold: number;
}

export class ScrollHeaderHelper {
  private static readonly DEFAULT_BUFFER_DISTANCE = 100;
  private static readonly DEFAULT_INITIAL_THEME = HeaderTheme.DARK;
  
  private config: ScrollHeaderConfig;
  private targetElement: ElementRef | null = null;
  private currentTheme: HeaderTheme;

  constructor(config?: Partial<ScrollHeaderConfig>) {
    this.config = {
      bufferDistance: config?.bufferDistance ?? ScrollHeaderHelper.DEFAULT_BUFFER_DISTANCE,
      initialTheme: config?.initialTheme ?? ScrollHeaderHelper.DEFAULT_INITIAL_THEME,
      darkTheme: HeaderTheme.DARK,
      lightTheme: HeaderTheme.LIGHT
    };
    this.currentTheme = this.config.initialTheme;
  }

  /**
   * Set the target element to track for scroll position
   */
  setTargetElement(element: ElementRef): void {
    this.targetElement = element;
  }

  /**
   * Check current scroll position and determine header theme
   */
  checkScrollPosition(): HeaderTheme {
    if (!this.isElementAvailable()) {
      return this.currentTheme;
    }

    const scrollData = this.calculateScrollPosition();
    this.currentTheme = this.determineTheme(scrollData);
    
    return this.currentTheme;
  }

  /**
   * Get current theme without recalculating
   */
  getCurrentTheme(): HeaderTheme {
    return this.currentTheme;
  }

  /**
   * Check if theme should be dark based on current scroll position
   */
  isDarkTheme(): boolean {
    return this.checkScrollPosition() === HeaderTheme.DARK;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ScrollHeaderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  private isElementAvailable(): boolean {
    return !!(this.targetElement && this.targetElement.nativeElement);
  }

  private calculateScrollPosition(): ScrollPosition {
    if (!this.targetElement?.nativeElement) {
      return { current: 0, threshold: 0 };
    }

    const element = this.targetElement.nativeElement;
    const elementBottom = element.offsetTop + element.offsetHeight;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = elementBottom - this.config.bufferDistance;

    return {
      current: currentScroll,
      threshold: threshold
    };
  }

  private determineTheme(scrollData: ScrollPosition): HeaderTheme {
    return scrollData.current < scrollData.threshold 
      ? this.config.darkTheme 
      : this.config.lightTheme;
  }
}
