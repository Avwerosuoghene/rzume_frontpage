export interface ImageSources {
  webp: string;
  fallback: string;
}

export interface ResponsiveImageSources {
  mobile: ImageSources;
  tablet: ImageSources;
  desktop: ImageSources;
}

export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export class ImageOptimizationHelper {
  private static webpSupported: boolean | null = null;
  private static observers: Map<Element, IntersectionObserver> = new Map();

  /**
   * Check if browser supports WebP format
   */
  static checkWebPSupport(): boolean {
    if (this.webpSupported !== null) {
      return this.webpSupported;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this.webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return this.webpSupported;
  }

  /**
   * Get optimized image sources with WebP fallback
   */
  static getOptimizedSources(imagePath: string): ImageSources {
    const pathParts = imagePath.split('.');
    const extension = pathParts.pop();
    const basePath = pathParts.join('.');
    
    return {
      webp: `${basePath}.webp`,
      fallback: imagePath
    };
  }

  /**
   * Get responsive image sources for different screen sizes
   */
  static getResponsiveSources(basePath: string): ResponsiveImageSources {
    return {
      mobile: {
        webp: `${basePath}-mobile.webp`,
        fallback: `${basePath}-mobile.jpg`
      },
      tablet: {
        webp: `${basePath}-tablet.webp`,
        fallback: `${basePath}-tablet.jpg`
      },
      desktop: {
        webp: `${basePath}-desktop.webp`,
        fallback: `${basePath}-desktop.jpg`
      }
    };
  }

  /**
   * Preload critical images
   */
  static preloadImages(imagePaths: string[]): void {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });
  }

  /**
   * Load image with fallback support
   */
  static loadImage(imagePath: string, fallbackPath?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(imagePath);
      img.onerror = () => {
        if (fallbackPath) {
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve(fallbackPath);
          fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${imagePath} and fallback: ${fallbackPath}`));
          fallbackImg.src = fallbackPath;
        } else {
          reject(new Error(`Failed to load image: ${imagePath}`));
        }
      };
      
      img.src = imagePath;
    });
  }

  /**
   * Initialize lazy loading for background images
   */
  static initBackgroundLazyLoad(
    element: HTMLElement,
    imagePath: string,
    options: LazyLoadOptions = {}
  ): void {
    const {
      threshold = 0.1,
      rootMargin = '0px',
      onLoad,
      onError
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadBackgroundImage(entry.target as HTMLElement, imagePath)
              .then(() => {
                entry.target.classList.add('loaded');
                onLoad?.();
              })
              .catch(() => {
                entry.target.classList.add('error');
                onError?.();
              });
            
            observer.unobserve(entry.target);
            this.observers.delete(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    this.observers.set(element, observer);
  }

  /**
   * Load background image with WebP support and fallback
   */
  private static loadBackgroundImage(element: HTMLElement, imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sources = this.getOptimizedSources(imagePath);
      const supportsWebP = this.checkWebPSupport();
      
      const primaryPath = supportsWebP ? sources.webp : sources.fallback;
      
      this.loadImage(primaryPath, sources.fallback)
        .then(loadedPath => {
          element.style.backgroundImage = `url('${loadedPath}')`;
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Initialize lazy loading for img elements
   */
  static initImageLazyLoad(
    img: HTMLImageElement,
    imagePath: string,
    options: LazyLoadOptions = {}
  ): void {
    const {
      threshold = 0.1,
      rootMargin = '0px',
      onLoad,
      onError
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const imgElement = entry.target as HTMLImageElement;
            const sources = this.getOptimizedSources(imagePath);
            const supportsWebP = this.checkWebPSupport();
            
            const primaryPath = supportsWebP ? sources.webp : sources.fallback;
            
            this.loadImage(primaryPath, sources.fallback)
              .then(loadedPath => {
                imgElement.src = loadedPath;
                imgElement.classList.add('loaded');
                onLoad?.();
              })
              .catch(() => {
                imgElement.classList.add('error');
                onError?.();
              });
            
            observer.unobserve(entry.target);
            this.observers.delete(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(img);
    this.observers.set(img, observer);
  }

  /**
   * Get the best image source based on browser support
   */
  static getBestImageSource(imagePath: string): string {
    const sources = this.getOptimizedSources(imagePath);
    return this.checkWebPSupport() ? sources.webp : sources.fallback;
  }

  /**
   * Cleanup observers for specific element
   */
  static cleanup(element: Element): void {
    const observer = this.observers.get(element);
    if (observer) {
      observer.unobserve(element);
      observer.disconnect();
      this.observers.delete(element);
    }
  }

  /**
   * Cleanup all observers
   */
  static cleanupAll(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}
