export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  backgroundColor?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatarSrc: string;
  avatarAlt: string;
}

export interface CoreFeature {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
}
