import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BlogPagePost } from '../models/mocks/blog.mock';

const DESCRIPTION_MAX_LENGTH = 160;

/**
 * Gives the blog list and each blog post their own browser title, meta description and
 * canonical URL (plus Open Graph tags for posts), and restores the site-wide defaults from
 * index.html when the page closes.
 */
@Injectable({ providedIn: 'root' })
export class BlogSeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly defaultTitle = this.title.getTitle();
  private readonly defaultDescription =
    this.meta.getTag('name="description"')?.content ?? '';
  private readonly defaultCanonical = this.getCanonicalLink()?.href ?? '';

  setPost(post: BlogPagePost): void {
    const origin = this.document.location.origin;
    const url = `${origin}/blog/${post.slug}`;
    const description = this.toDescription(post.content);

    this.title.setTitle(`${post.title} | Rzume Blog`);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:title', content: post.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: `${origin}/${encodeURI(post.imageUrl)}` });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.setCanonical(url);
  }

  setListPage(description: string): void {
    this.title.setTitle('Blog | Rzume');
    this.meta.updateTag({ name: 'description', content: description });
    this.setCanonical(`${this.document.location.origin}/blog`);
  }

  reset(): void {
    this.title.setTitle(this.defaultTitle);
    this.meta.updateTag({ name: 'description', content: this.defaultDescription });
    ['og:type', 'og:title', 'og:description', 'og:url', 'og:image'].forEach(property =>
      this.meta.removeTag(`property="${property}"`)
    );
    this.meta.removeTag('name="twitter:card"');
    this.setCanonical(this.defaultCanonical);
  }

  /** First paragraph of the post as plain text, trimmed to a search-snippet length. */
  private toDescription(html: string): string {
    // DOMParser builds an inert document, so nothing in the post's HTML loads or runs.
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const text = (parsed.querySelector('p')?.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text.length <= DESCRIPTION_MAX_LENGTH) {
      return text;
    }
    return `${text.slice(0, text.lastIndexOf(' ', DESCRIPTION_MAX_LENGTH - 1))}…`;
  }

  private setCanonical(href: string): void {
    const link = this.getCanonicalLink();
    if (link && href) {
      link.href = href;
    }
  }

  private getCanonicalLink(): HTMLLinkElement | null {
    return this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  }
}
