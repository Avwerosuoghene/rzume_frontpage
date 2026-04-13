import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AUTH_URLS,
  HEADER_CONFIG,
  HeaderConfig,
  ANALYTICS_LOCATIONS
} from '../../core/models';
import { NavigationHelper } from '../../core/helpers';
import { AnalyticsEvent } from '../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import {
  BlogPagePost,
  BLOG_PAGE_POSTS,
  FEATURED_POST,
  POPULAR_POSTS,
  NEWSLETTER_SIGNUP,
  NewsletterSignup
} from '../../core/models/mocks';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatButtonModule
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  headerConfig: HeaderConfig = HEADER_CONFIG;
  featuredPost: BlogPagePost = FEATURED_POST;
  popularPosts: BlogPagePost[] = POPULAR_POSTS;
  newsletterData: NewsletterSignup = NEWSLETTER_SIGNUP;

  isHeaderDark: boolean = false;
  private analyticsService = inject(AnalyticsService);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.setActiveNavigation();
    this.route.queryParams.subscribe(params => {
      const postId = params['postId'];
      if (postId) {
        const targetPost = BLOG_PAGE_POSTS.find(post => post.id === postId);
        if (targetPost) {
          this.loadPostAsFeatured(targetPost);
        }
      }
    });
  }

  private setActiveNavigation(): void {
    this.headerConfig = NavigationHelper.setActiveNavigation(this.headerConfig, '/blog');
  }

  loadPostAsFeatured(post: BlogPagePost): void {
    this.analyticsService.track(AnalyticsEvent.POPULAR_POST_CLICKED, {
      post_id: post.id,
      post_title: post.title,
      location: ANALYTICS_LOCATIONS.BLOG_SIDEBAR
    });
    
    this.featuredPost = post;
    this.updatePopularPosts(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { postId: post.id },
      queryParamsHandling: 'merge'
    });
  }

  private updatePopularPosts(newFeaturedPost: BlogPagePost): void {
    const allOtherPosts = BLOG_PAGE_POSTS.filter(post => post.id !== newFeaturedPost.id);

    this.popularPosts = allOtherPosts.slice(0, 4);
  }

  navigateToSignUp(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_BUTTON_CLICKED, {
      location: ANALYTICS_LOCATIONS.BLOG_SIDEBAR,
      button_text: this.newsletterData.buttonText,
      destination: AUTH_URLS.registerUrl
    });
    window.open(AUTH_URLS.registerUrl, '_blank');
  }
}
