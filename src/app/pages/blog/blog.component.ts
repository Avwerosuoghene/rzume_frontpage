import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  popularPosts: BlogPagePost[] = this.getOtherPosts(FEATURED_POST);
  newsletterData: NewsletterSignup = NEWSLETTER_SIGNUP;

  isHeaderDark: boolean = false;
  private analyticsService = inject(AnalyticsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setActiveNavigation();
    // The postId query param is the single source of truth for which post is shown,
    // whether the visitor arrived from a homepage card, a shared link, or a sidebar click.
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const targetPost = BLOG_PAGE_POSTS.find(post => post.id === params.get('postId'));
        this.showPost(targetPost ?? FEATURED_POST);
      });
  }

  private setActiveNavigation(): void {
    this.headerConfig = NavigationHelper.setActiveNavigation(this.headerConfig, '/blog');
  }

  onPopularPostClick(post: BlogPagePost): void {
    this.analyticsService.track(AnalyticsEvent.POPULAR_POST_CLICKED, {
      post_id: post.id,
      post_title: post.title,
      location: ANALYTICS_LOCATIONS.BLOG_SIDEBAR
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { postId: post.id },
      queryParamsHandling: 'merge'
    });
  }

  private showPost(post: BlogPagePost): void {
    this.featuredPost = post;
    this.popularPosts = this.getOtherPosts(post);
  }

  private getOtherPosts(currentPost: BlogPagePost): BlogPagePost[] {
    return BLOG_PAGE_POSTS.filter(post => post.id !== currentPost.id).slice(0, 4);
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
