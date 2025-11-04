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
  description: string;
  buttonText: string;
}

export const BLOG_PAGE_POSTS: BlogPagePost[] = [
  {
    id: '1',
    title: 'Designers are meant to be loved, not to be understood.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et rhoncus mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
    content: `
      <p>Design is more than just aesthetics—it's about creating meaningful connections between users and digital experiences. In today's rapidly evolving digital landscape, designers play a crucial role in shaping how people interact with technology and each other.</p>
      
      <h2>The Evolution of Design Thinking</h2>
      <p>Over the past decade, we've witnessed a fundamental shift in how we approach design. What once was purely visual has transformed into a discipline that encompasses psychology, technology, and human behavior. Modern designers are not just creators; they are problem solvers, strategists, and advocates for user experience.</p>
      
      <p>This evolution has brought new challenges and opportunities. Designers must now consider accessibility, sustainability, and ethical implications of their work. They need to understand data analytics, user research methodologies, and emerging technologies like AI and machine learning.</p>
      
      <h3>Understanding User Needs</h3>
      <p>At the heart of great design lies empathy. Successful designers spend considerable time understanding their users' pain points, motivations, and goals. This deep understanding allows them to create solutions that truly resonate with their audience.</p>
      
      <blockquote>
        <p>"Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs</p>
      </blockquote>
      
      <p>User research has become an integral part of the design process. Through interviews, surveys, and usability testing, designers gather insights that inform their creative decisions. This data-driven approach ensures that design choices are based on real user needs rather than assumptions.</p>
      
      <h2>The Role of Technology in Modern Design</h2>
      <p>Technology continues to reshape the design landscape. From AI-powered design tools to virtual and augmented reality experiences, designers have access to an unprecedented array of capabilities. These tools not only enhance productivity but also open up new possibilities for creative expression.</p>
      
      <p>However, with great power comes great responsibility. Designers must navigate the ethical implications of these technologies, ensuring that their creations promote inclusivity, privacy, and human well-being. The challenge lies in leveraging technology to enhance human experiences rather than replace human connections.</p>
      
      <h3>Collaboration and Communication</h3>
      <p>Modern design is rarely a solo endeavor. Successful projects require close collaboration between designers, developers, product managers, and stakeholders. Effective communication skills have become as important as technical design abilities.</p>
      
      <p>Designers must be able to articulate their vision, justify their decisions, and adapt their work based on feedback. This collaborative approach leads to better outcomes and ensures that design solutions align with business objectives and user needs.</p>
    `,
    author: 'Admin',
    publishedDate: 'November 15, 2023',
    readTime: '5 min read',
    imageUrl: 'assets/images/food_platter.jpg',
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
    imageUrl: 'assets/images/pizza.png',
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
    imageUrl: 'assets/images/food_platter.jpg',
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
    imageUrl: 'assets/images/pizza.png',
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
    imageUrl: 'assets/images/pizza.png',
    category: 'Design',
    isFeatured: false
  }
];

export const NEWSLETTER_SIGNUP: NewsletterSignup = {
  title: 'Organize your job hunt once and for all',
  description: 'If your job search feels scattered or overwhelming, it’s time to try a tool designed specifically for you.',
  buttonText: 'Get Started'
};

export const FEATURED_POST = BLOG_PAGE_POSTS.find((post: BlogPagePost) => post.isFeatured) || BLOG_PAGE_POSTS[0];
export const POPULAR_POSTS = BLOG_PAGE_POSTS.filter((post: BlogPagePost) => !post.isFeatured).slice(0, 4);
