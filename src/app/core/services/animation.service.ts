import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private scrollListeners: Map<Element, () => void> = new Map();

  initHeroScrollAnimation(
    heroElement: HTMLElement,
    imageElement: HTMLElement
  ): void {
    const handleScroll = () => {
      const rect = heroElement.getBoundingClientRect();
      const heroHeight = heroElement.offsetHeight;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / heroHeight));
      
      const zoomScale = 1 + (scrollProgress * 0.2);
      
      imageElement.style.transform = `scale(${zoomScale})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    this.scrollListeners.set(heroElement, () => {
      window.removeEventListener('scroll', handleScroll);
    });

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
}
