export interface BlogPagePost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
}

export interface NewsletterSignup {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}

export const BLOG_PAGE_POSTS: BlogPagePost[] = [
  {
    id: '1',
    title: 'Designers are meant to be loved, not to be understood.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.

    Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus quis lectus dapibus, ut elementum dolor id, luctus erat. Maecenas in lacinia felis. Sed vitae dui in dui consequat, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet.

    Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus quis lectus dapibus, ut elementum dolor id, luctus erat. Maecenas in lacinia felis. Sed vitae dui in dui consequat, ultrices mauris. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.`,
    author: 'Admin',
    publishedDate: 'November 15, 2023',
    readTime: '5 min read',
    imageUrl: 'assets/images/blog/featured-post.jpg',
    category: 'Design',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna.',
    author: 'Admin',
    publishedDate: 'November 10, 2023',
    readTime: '3 min read',
    imageUrl: 'assets/images/blog/post-1.jpg',
    category: 'Design',
    isFeatured: false
  },
  {
    id: '3',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna.',
    author: 'Admin',
    publishedDate: 'November 8, 2023',
    readTime: '4 min read',
    imageUrl: 'assets/images/blog/post-2.jpg',
    category: 'Development',
    isFeatured: false
  },
  {
    id: '4',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna.',
    author: 'Admin',
    publishedDate: 'November 5, 2023',
    readTime: '2 min read',
    imageUrl: 'assets/images/blog/post-3.jpg',
    category: 'Tips',
    isFeatured: false
  },
  {
    id: '5',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna.',
    author: 'Admin',
    publishedDate: 'November 3, 2023',
    readTime: '6 min read',
    imageUrl: 'assets/images/blog/post-4.jpg',
    category: 'Design',
    isFeatured: false
  }
];

export const NEWSLETTER_SIGNUP: NewsletterSignup = {
  title: 'Get More Done Together With Us',
  subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi.',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
  buttonText: 'Get Started'
};

export const FEATURED_POST = BLOG_PAGE_POSTS.find((post: BlogPagePost) => post.isFeatured) || BLOG_PAGE_POSTS[0];
export const POPULAR_POSTS = BLOG_PAGE_POSTS.filter((post: BlogPagePost) => !post.isFeatured).slice(0, 4);
