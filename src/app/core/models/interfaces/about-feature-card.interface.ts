export interface AboutFeatureCard {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'image';
  backgroundColor: 'light-blue' | 'blue';
  imageSrc?: string;
  imageAlt?: string;
}
