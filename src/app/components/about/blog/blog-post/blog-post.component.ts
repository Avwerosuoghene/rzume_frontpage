import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../../../../core/models/blog.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent {
  @Input() post!: BlogPost;
}
