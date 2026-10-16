import { AfterViewInit, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostComponent } from './blog-post/blog-post.component';
import {
  BlogSection,
  BLOG_SECTION,
  BLOG_POSTS_NEWEST_FIRST,
  BlogPagePost
} from '../../../core/models';
import { AnimationService } from '../../../core/services/animation.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, BlogPostComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements AfterViewInit {
  sectionData: BlogSection = BLOG_SECTION;
  blogPosts: BlogPagePost[] = BLOG_POSTS_NEWEST_FIRST.slice(0, 3);

  private animationService = inject(AnimationService);
  private revealElements = viewChildren('reveal', { read: ElementRef<HTMLElement> });

  ngAfterViewInit(): void {
    this.animationService.initStaggeredCardAnimation(
      this.revealElements().map(element => element.nativeElement)
    );
  }
}
