export enum AnalyticsEvent {
  // Page Views
  PAGE_VIEW = 'page_view',
  
  // Button Clicks
  SIGNUP_BUTTON_CLICKED = 'signup_button_clicked',
  LOGIN_BUTTON_CLICKED = 'login_button_clicked',
  CTA_BUTTON_CLICKED = 'cta_button_clicked',
  NEWSLETTER_BUTTON_CLICKED = 'newsletter_button_clicked',
  
  // Content Engagement
  BLOG_POST_CLICKED = 'blog_post_clicked',
  POPULAR_POST_CLICKED = 'popular_post_clicked',
  FEATURE_CARD_CLICKED = 'feature_card_clicked',
  
  // Forms
  NEWSLETTER_SUBMITTED = 'newsletter_submitted',
  NEWSLETTER_ERROR = 'newsletter_error',
  FORM_SUBMIT = 'form_submit'
}
