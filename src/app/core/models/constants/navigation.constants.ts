import { HeaderConfig, NavigationItem } from '../interfaces';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'about', label: 'About', route: '/about' },
  { id: 'features', label: 'Features', route: '/features' },
  { id: 'faq', label: 'FAQ', route: '/faq' },
  { id: 'blog', label: 'Blog', route: '/blog' }
];

export const HEADER_CONFIG: HeaderConfig = {
  logoSrc: 'assets/icons/rzume_logo_white.svg',
  logoAlt: 'Rzume Logo',
  navigationItems: NAVIGATION_ITEMS,
  loginText: 'Login',
  signUpText: 'Sign up'
};
