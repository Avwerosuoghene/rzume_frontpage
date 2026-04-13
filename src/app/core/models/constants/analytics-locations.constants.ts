/**
 * Analytics Event Location Constants
 * Defines standardized location identifiers for analytics event tracking
 */
export const ANALYTICS_LOCATIONS = {
  // Header locations
  HEADER: 'header',
  
  // Hero section
  HERO: 'hero',
  
  // About page locations
  ABOUT_CTA_SECTION: 'about_cta_section',
  
  // Blog page locations
  BLOG_SIDEBAR: 'blog_sidebar',
  
  // Footer locations
  FOOTER_NEWSLETTER: 'footer_newsletter'
} as const;

export type AnalyticsLocation = typeof ANALYTICS_LOCATIONS[keyof typeof ANALYTICS_LOCATIONS];
