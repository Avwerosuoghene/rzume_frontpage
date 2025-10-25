export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  isActive?: boolean;
}

export interface HeaderConfig {
  logoSrc: string;
  logoAlt: string;
  navigationItems: NavigationItem[];
  loginText: string;
  signUpText: string;
}
