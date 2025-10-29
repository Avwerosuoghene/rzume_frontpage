import { HeaderConfig } from '../models';


export class NavigationHelper {
  
  static setActiveNavigation(headerConfig: HeaderConfig, activeRoute: string): HeaderConfig {
    return {
      ...headerConfig,
      navigationItems: headerConfig.navigationItems.map(item => ({
        ...item,
        isActive: item.route === activeRoute
      }))
    };
  }

  static clearActiveNavigation(headerConfig: HeaderConfig): HeaderConfig {
    return {
      ...headerConfig,
      navigationItems: headerConfig.navigationItems.map(item => ({
        ...item,
        isActive: false
      }))
    };
  }

  static getActiveNavigationItem(headerConfig: HeaderConfig) {
    return headerConfig.navigationItems.find(item => item.isActive);
  }

  static isRouteActive(headerConfig: HeaderConfig, route: string): boolean {
    return headerConfig.navigationItems.some(item => item.route === route && item.isActive);
  }
}
