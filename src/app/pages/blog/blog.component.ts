import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AUTH_URLS,
  HEADER_CONFIG,
  HeaderConfig,
  ANALYTICS_LOCATIONS
} from '../../core/models';
import { NavigationHelper } from '../../core/helpers';
import { AnalyticsEvent } from '../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { BlogSeoService } from '../../core/services/blog-seo.service';
import {
  BlogPagePost,
  BLOG_PAGE_POSTS,
  BLOG_POSTS_NEWEST_FIRST,
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
    MatButtonModule,
    RouterLink
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
  private blogSeo = inject(BlogSeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setActiveNavigation();
    this.destroyRef.onDestroy(() => this.blogSeo.reset());

    // The URL is the single source of truth for which post is shown: /blog/:slug,
    // whether the visitor arrived from the blog list, a homepage card, a shared link, or the sidebar.
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.handleSlug(params.get('slug')));
  }

  private handleSlug(slug: string | null): void {
    const post = BLOG_PAGE_POSTS.find(candidate => candidate.slug === slug);
    if (!post) {
      this.router.navigate(['/blog'], { replaceUrl: true });
      return;
    }
    this.showPost(post);
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

    // The routerLink handles navigation; the page stays mounted, so scroll back to the top.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private showPost(post: BlogPagePost): void {
    this.featuredPost = post;
    this.popularPosts = this.getOtherPosts(post);
    this.blogSeo.setPost(post);
  }

  private getOtherPosts(currentPost: BlogPagePost): BlogPagePost[] {
    return BLOG_POSTS_NEWEST_FIRST.filter(post => post.id !== currentPost.id).slice(0, 4);
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
