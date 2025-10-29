import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { 
  HEADER_CONFIG,
  HeaderConfig
} from '../../core/models';
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

  ngOnInit(): void {
    this.setActiveNavigation();
  }

  private setActiveNavigation(): void {
    this.headerConfig = {
      ...this.headerConfig,
      navigationItems: this.headerConfig.navigationItems.map(item => ({
        ...item,
        isActive: item.route === '/blog'
      }))
    };
  }
}
