import { AboutFeature, AboutFeatureCard, CoreFeature, CoreFeaturesSection, HeroSection, TestimonialsSection } from "../interfaces";

export const CORE_FEATURES_SECTION: CoreFeaturesSection = {
  title: 'Our Core Features'
};

export const TESTIMONIALS_SECTION: TestimonialsSection = {
  title: 'What people say about us',
  subtitle: 'Don\'t just take our word for it. Here\'s what our community has to say.'
};

export const ABOUT_FEATURE_CARDS: AboutFeatureCard[] = [
  {
    id: 'why-us',
    title: 'Why us',
    description: 'Most job seekers juggle spreadsheets or rely on memory — and end up missing deadlines, forgetting applications, or feeling lost when interview invites finally arrive.',
    type: 'text',
    backgroundColor: 'light-blue'
  },
  {
    id: 'what-we-do',
    title: 'What we do',
    description: 'Rzume makes your job hunt effortless with an intuitive tracker that stores your applications, organizes your resumes, and reminds you when it\'s time to follow up.',
    type: 'text',
    backgroundColor: 'blue'
  },
  {
    id: 'image-card',
    title: '',
    description: '',
    type: 'image',
    backgroundColor: 'light-blue',
    imageSrc: 'assets/images/boy_on_laptop.jpg',
    imageAlt: 'Person using laptop'
  },
  {
    id: 'how-we-do-it',
    title: 'How we do it',
    description: 'Rzume is starting as a lightweight tool to help you stop losing track of your job applications — we are building in public, shaped by real feedback, and constantly improving.',
    type: 'text',
    backgroundColor: 'light-blue'
  }
];

export const ABOUT_FEATURES_SECTION = {
  label: 'About',
  title: 'Less chaos, more momentum.'
};

export const ABOUT_HERO: HeroSection = {
  title: 'Never lose track of an opportunity again.',
  subtitle: 'Keep all your resumes and applications in one place.',
  primaryButtonText: 'Sign up free',
  secondaryButtonText: 'Join our newsletter',
  backgroundImageSrc: 'assets/images/professional-woman.jpg',
  backgroundImageAlt: 'Professional woman working on laptop'
};

export const ABOUT_FEATURES: AboutFeature[] = [
  {
    id: 'why-us',
    title: 'Why us',
    description: 'Most job seekers juggle spreadsheets or rely on memory — and end up missing deadlines, forgetting applications, or feeling lost when interview invites finally arrive.',
    imageSrc: 'assets/placeholders/why-us.png',
    imageAlt: 'Why choose us illustration',
    backgroundColor: '#EBF4FF'
  },
  {
    id: 'what-we-do',
    title: 'What we do',
    description: 'Rzume creates your job hunt effortless with an intuitive tracker that stores your applications, organizes your resumes, and reminds you when it\'s time to follow up.',
    imageSrc: 'assets/placeholders/what-we-do.png',
    imageAlt: 'What we do illustration',
    backgroundColor: '#3E7FFF'
  },
  {
    id: 'how-we-do-it',
    title: 'How we do it',
    description: 'Rzume is starting as a lightweight tool to help you stop losing track of your job applications — we are building in public, shaped by real feedback, and constantly improving.',
    imageSrc: 'assets/placeholders/how-we-do-it.png',
    imageAlt: 'How we do it illustration',
    backgroundColor: '#EBF4FF'
  }
];

export const CORE_FEATURES: CoreFeature[] = [
  {
    id: 'track-applications',
    title: 'Track Multiple Applications',
    description: 'Keep all your job applications organized in one place.',
    iconSrc: 'assets/icons/stacked_documents.svg',
    iconAlt: 'Track applications icon'
  },
  {
    id: 'smart-reminders',
    title: 'Smart Follow-Up Reminders',
    description: 'Get notified when it\'s time to follow up on your applications.',
    iconSrc: 'assets/icons/follow_up_icon.svg',
    iconAlt: 'Smart reminders icon'
  },
  {
    id: 'accessible-anywhere',
    title: 'Accessible Anywhere',
    description: 'Cloud-based access to see your job search progress anywhere.',
    iconSrc: 'assets/icons/accessible_icon.svg',
    iconAlt: 'Accessible anywhere icon'
  }
];


