import { LearningResource } from '../types';

export const learningResources: LearningResource[] = [
  // Software Engineering Resources
  {
    id: 'se-1',
    title: 'Complete JavaScript Course',
    type: 'course',
    provider: 'Udemy',
    duration: '69 hours',
    difficulty: 'beginner',
    rating: 4.7,
    url: '#',
    skills: ['JavaScript']
  },
  {
    id: 'se-2',
    title: 'React - The Complete Guide',
    type: 'course',
    provider: 'Udemy',
    duration: '48 hours',
    difficulty: 'intermediate',
    rating: 4.6,
    url: '#',
    skills: ['React', 'JavaScript']
  },
  {
    id: 'se-3',
    title: 'System Design Interview',
    type: 'book',
    provider: 'Amazon',
    duration: '320 pages',
    difficulty: 'advanced',
    rating: 4.5,
    url: '#',
    skills: ['System Design']
  },
  
  // Data Science Resources
  {
    id: 'ds-1',
    title: 'Python for Data Science',
    type: 'course',
    provider: 'Coursera',
    duration: '40 hours',
    difficulty: 'beginner',
    rating: 4.8,
    url: '#',
    skills: ['Python', 'Data Analysis']
  },
  {
    id: 'ds-2',
    title: 'Machine Learning Specialization',
    type: 'certification',
    provider: 'Stanford Online',
    duration: '3 months',
    difficulty: 'intermediate',
    rating: 4.9,
    url: '#',
    skills: ['Machine Learning', 'Statistics']
  },
  
  // Product Management Resources
  {
    id: 'pm-1',
    title: 'Product Management Fundamentals',
    type: 'course',
    provider: 'LinkedIn Learning',
    duration: '12 hours',
    difficulty: 'beginner',
    rating: 4.4,
    url: '#',
    skills: ['Strategic Planning', 'Leadership']
  },
  {
    id: 'pm-2',
    title: 'Agile Project Management',
    type: 'certification',
    provider: 'PMI',
    duration: '6 weeks',
    difficulty: 'intermediate',
    rating: 4.6,
    url: '#',
    skills: ['Agile Methodology']
  },
  
  // UX Design Resources
  {
    id: 'ux-1',
    title: 'User Experience Design Fundamentals',
    type: 'course',
    provider: 'Google UX Design',
    duration: '6 months',
    difficulty: 'beginner',
    rating: 4.7,
    url: '#',
    skills: ['User Research', 'Design Tools']
  },
  {
    id: 'ux-2',
    title: 'Advanced Figma Masterclass',
    type: 'course',
    provider: 'Skillshare',
    duration: '8 hours',
    difficulty: 'intermediate',
    rating: 4.5,
    url: '#',
    skills: ['Design Tools', 'Prototyping']
  },
  
  // Digital Marketing Resources
  {
    id: 'dm-1',
    title: 'Digital Marketing Specialization',
    type: 'certification',
    provider: 'Google Digital Marketing',
    duration: '4 months',
    difficulty: 'beginner',
    rating: 4.6,
    url: '#',
    skills: ['SEO/SEM', 'Analytics']
  },
  {
    id: 'dm-2',
    title: 'Social Media Marketing Mastery',
    type: 'course',
    provider: 'HubSpot Academy',
    duration: '15 hours',
    difficulty: 'intermediate',
    rating: 4.4,
    url: '#',
    skills: ['Social Media Marketing', 'Content Marketing']
  },
  
  // Cybersecurity Resources
  {
    id: 'cs-1',
    title: 'CompTIA Security+ Certification',
    type: 'certification',
    provider: 'CompTIA',
    duration: '3 months',
    difficulty: 'intermediate',
    rating: 4.7,
    url: '#',
    skills: ['Network Security', 'Security Tools']
  },
  {
    id: 'cs-2',
    title: 'Ethical Hacking Course',
    type: 'course',
    provider: 'Cybrary',
    duration: '20 hours',
    difficulty: 'advanced',
    rating: 4.5,
    url: '#',
    skills: ['Ethical Hacking', 'Threat Analysis']
  }
];