export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageSrc: string;
  imageAlt: string;
  date: string;
  author: string;
  commentsCount: number;
  readMoreUrl: string;
}

export interface BlogSection {
  title: string;
  subtitle: string;
}
