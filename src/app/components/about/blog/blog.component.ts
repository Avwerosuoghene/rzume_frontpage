import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { 
  BlogSection, 
  BLOG_SECTION,
  BLOG_POSTS_NEWEST_FIRST,
  BlogPagePost
} from '../../../core/models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, BlogPostComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  sectionData: BlogSection = BLOG_SECTION;
  blogPosts: BlogPagePost[] = BLOG_POSTS_NEWEST_FIRST.slice(0, 3);
}
