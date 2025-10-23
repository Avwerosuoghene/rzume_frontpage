import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'about' },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component')
      .then(m => m.AboutComponent)
  },
  {
    path: 'features',
    loadComponent: () => import('./pages/features/features.component')
      .then(m => m.FeaturesComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component')
      .then(m => m.FaqComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component')
      .then(m => m.BlogComponent)
  },
  { path: '**', redirectTo: '' }
];
