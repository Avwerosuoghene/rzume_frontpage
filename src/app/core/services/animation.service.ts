import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private scrollListeners: Map<Element, () => void> = new Map();

  initHeroScrollAnimation(heroElement: HTMLElement, imageElement: HTMLElement): void {
    const handleScroll = () => {
      const rect = heroElement.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / heroElement.offsetHeight));
      imageElement.style.transform = `scale(${1 + (scrollProgress * 0.2)})`;
    };

    this.addScrollListener(heroElement, handleScroll);
    handleScroll();
  }

  initStaggeredCardAnimation(elements: HTMLElement[], staggerDelay: number = 150): void {
    this.prepareElementsForAnimation(elements);
    this.createStaggeredObserver(elements, staggerDelay);
  }

  initCTAScrollAnimation(ctaElement: HTMLElement, imageElement?: HTMLElement): void {
    const targetElement = imageElement || ctaElement;
    
    const handleScroll = () => {
      const rect = ctaElement.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, 
        (window.innerHeight - rect.top) / (window.innerHeight + ctaElement.offsetHeight)
      ));
      targetElement.style.transform = `scale(${1 + (scrollProgress * 0.1)})`;
    };

    this.addScrollListener(ctaElement, handleScroll);
    handleScroll();
  }

  cleanupElement(element: Element): void {
    const cleanup = this.scrollListeners.get(element);
    if (cleanup) {
      cleanup();
      this.scrollListeners.delete(element);
    }
  }

  cleanupAll(): void {
    this.scrollListeners.forEach(cleanup => cleanup());
    this.scrollListeners.clear();
  }

  private addScrollListener(element: HTMLElement, handler: () => void): void {
    window.addEventListener('scroll', handler, { passive: true });
    this.scrollListeners.set(element, () => window.removeEventListener('scroll', handler));
  }

  private prepareElementsForAnimation(elements: HTMLElement[]): void {
    elements.forEach(element => element.classList.add('animate-ready'));
  }

  private createStaggeredObserver(elements: HTMLElement[], delay: number): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.remove('animate-ready');
              entry.target.classList.add('animate-in');
            }, index * delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(element => observer.observe(element));
  }
}
