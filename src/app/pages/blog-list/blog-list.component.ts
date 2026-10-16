import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ANALYTICS_LOCATIONS, AUTH_URLS, HEADER_CONFIG } from '../../core/models';
import { NavigationHelper } from '../../core/helpers';
import { AnalyticsEvent } from '../../core/models/enums/analytics-events.enum';
import {
  BLOG_PAGE_POSTS,
  BLOG_POSTS_NEWEST_FIRST,
  BlogPagePost,
  FEATURED_POST,
  NEWSLETTER_SIGNUP
} from '../../core/models/mocks';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { BlogSeoService } from '../../core/services/blog-seo.service';

const LIST_DESCRIPTION =
  'Practical advice on tracking applications, following up, and staying consistent until you land the role.';

@Component({
  selector: 'app-blog-list',
  imports: [HeaderComponent, FooterComponent, MatButtonModule, RouterLink, NgOptimizedImage],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly blogSeo = inject(BlogSeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly headerConfig = NavigationHelper.setActiveNavigation(HEADER_CONFIG, '/blog');
  readonly description = LIST_DESCRIPTION;
  readonly featuredPost = FEATURED_POST;
  readonly featuredLabel = FEATURED_POST.isFeatured ? 'FEATURED' : 'LATEST';
  readonly otherPosts = BLOG_POSTS_NEWEST_FIRST.filter(post => post.id !== FEATURED_POST.id);
  readonly signup = NEWSLETTER_SIGNUP;

  ngOnInit(): void {
    // Links shared before posts had their own URLs look like /blog?postId=N.
    const legacyPost = BLOG_PAGE_POSTS.find(
      post => post.id === this.route.snapshot.queryParamMap.get('postId')
    );
    if (legacyPost) {
      this.router.navigate(['/blog', legacyPost.slug], { replaceUrl: true });
      return;
    }

    this.blogSeo.setListPage(LIST_DESCRIPTION);
    this.destroyRef.onDestroy(() => this.blogSeo.reset());
  }

  onPostClick(post: BlogPagePost, position: 'featured' | 'grid'): void {
    this.analyticsService.track(AnalyticsEvent.BLOG_POST_CLICKED, {
      post_id: post.id,
      post_title: post.title,
      location: ANALYTICS_LOCATIONS.BLOG_LIST,
      position
    });
  }

  navigateToSignUp(): void {
    this.analyticsService.track(AnalyticsEvent.NEWSLETTER_BUTTON_CLICKED, {
      location: ANALYTICS_LOCATIONS.BLOG_LIST,
      button_text: this.signup.buttonText,
      destination: AUTH_URLS.registerUrl
    });
    window.open(AUTH_URLS.registerUrl, '_blank');
  }
}
