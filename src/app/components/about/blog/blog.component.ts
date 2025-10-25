import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { 
  BlogSection, 
  BlogPost, 
  BLOG_POSTS, 
  BLOG_SECTION 
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
  blogPosts: BlogPost[] = BLOG_POSTS;
}
