import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ANALYTICS_LOCATIONS, BlogPagePost } from '../../../../core/models';
import { AnalyticsEvent } from '../../../../core/models/enums/analytics-events.enum';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent {
  @Input() post!: BlogPagePost;
  private analyticsService = inject(AnalyticsService);

  onReadMoreClick(): void {
    this.analyticsService.track(AnalyticsEvent.BLOG_POST_CLICKED, {
      post_id: this.post.id,
      post_title: this.post.title,
      location: ANALYTICS_LOCATIONS.ABOUT_BLOG_SECTION
    });
  }
}
