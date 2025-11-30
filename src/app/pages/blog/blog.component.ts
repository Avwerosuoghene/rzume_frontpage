import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AUTH_URLS,
  HEADER_CONFIG,
  HeaderConfig
} from '../../core/models';
import { NavigationHelper } from '../../core/helpers';
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
    window.open(AUTH_URLS.registerUrl, '_blank');
  }
}
