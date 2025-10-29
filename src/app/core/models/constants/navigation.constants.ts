import { HeaderConfig, NavigationItem } from '../interfaces';
import { AUTH_URLS } from './auth.constants';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'about', label: 'About', route: '/about' },
  { id: 'features', label: 'Features', route: '/features' },
  { id: 'faq', label: 'FAQ', route: '/faq' },
  { id: 'blog', label: 'Blog', route: '/blog' },
  { id: 'terms', label: 'Terms', route: '/terms-conditions' }
];

export const HEADER_CONFIG: HeaderConfig = {
  logoSrc: 'assets/icons/rzume_logo_white.svg',
  logoAlt: 'Rzume Logo',
  navigationItems: NAVIGATION_ITEMS,
  loginText: 'Login',
  signUpText: 'Sign up',
  loginUrl: AUTH_URLS.loginUrl,
  signUpUrl: AUTH_URLS.registerUrl
};
