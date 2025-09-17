import { CareerPath } from '../types';

export interface CompanyHiring {
  id: string;
  name: string;
  type: 'MNC' | 'Service' | 'Product' | 'Startup';
  logo: string;
  freshersIntake: number;
  seniorsIntake: number;
  locations: string[];
  salaryRange: {
    fresher: string;
    experienced: string;
  };
  requirements: string[];
  applicationLink: string;
  hiringStatus: 'Active' | 'Seasonal' | 'Closed';
}

export interface MarketInsights {
  careerPath: string;
  competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  demandTrend: 'Growing' | 'Stable' | 'Declining';
  totalJobs: number;
  averageApplications: number;
  keyFocusAreas: string[];
  criticalTopics: string[];
  industryGrowth: string;
  emergingSkills: string[];
}

export const companyHiringData: Record<string, CompanyHiring[]> = {
  'software-engineer': [
    {
      id: 'google-swe',
      name: 'Google',
      type: 'MNC',
      logo: '🔍',
      freshersIntake: 2500,
      seniorsIntake: 1800,
      locations: ['Bangalore', 'Hyderabad', 'Mumbai', 'Gurgaon'],
      salaryRange: {
        fresher: '₹18-25 LPA',
        experienced: '₹35-80 LPA'
      },
      requirements: ['Strong DSA', 'System Design', 'CS Fundamentals'],
      applicationLink: 'https://careers.google.com',
      hiringStatus: 'Active'
    },
    {
      id: 'microsoft-swe',
      name: 'Microsoft',
      type: 'MNC',
      logo: '🪟',
      freshersIntake: 2000,
      seniorsIntake: 1500,
      locations: ['Bangalore', 'Hyderabad', 'Noida'],
      salaryRange: {
        fresher: '₹16-22 LPA',
        experienced: '₹30-70 LPA'
      },
      requirements: ['C#/.NET', 'Azure', 'Problem Solving'],
      applicationLink: 'https://careers.microsoft.com',
      hiringStatus: 'Active'
    },
    {
      id: 'tcs-swe',
      name: 'Tata Consultancy Services',
      type: 'Service',
      logo: '🏢',
      freshersIntake: 40000,
      seniorsIntake: 15000,
      locations: ['Pan India'],
      salaryRange: {
        fresher: '₹3.5-7 LPA',
        experienced: '₹8-25 LPA'
      },
      requirements: ['Java/Python', 'Database', 'Communication'],
      applicationLink: 'https://careers.tcs.com',
      hiringStatus: 'Active'
    },
    {
      id: 'infosys-swe',
      name: 'Infosys',
      type: 'Service',
      logo: '💼',
      freshersIntake: 35000,
      seniorsIntake: 12000,
      locations: ['Bangalore', 'Pune', 'Chennai', 'Hyderabad'],
      salaryRange: {
        fresher: '₹4-8 LPA',
        experienced: '₹10-30 LPA'
      },
      requirements: ['Full Stack Development', 'Cloud', 'Agile'],
      applicationLink: 'https://careers.infosys.com',
      hiringStatus: 'Active'
    },
    {
      id: 'amazon-swe',
      name: 'Amazon',
      type: 'MNC',
      logo: '📦',
      freshersIntake: 3000,
      seniorsIntake: 2000,
      locations: ['Bangalore', 'Chennai', 'Hyderabad'],
      salaryRange: {
        fresher: '₹20-28 LPA',
        experienced: '₹40-90 LPA'
      },
      requirements: ['AWS', 'Distributed Systems', 'Leadership Principles'],
      applicationLink: 'https://amazon.jobs',
      hiringStatus: 'Active'
    }
  ],
  'data-scientist': [
    {
      id: 'google-ds',
      name: 'Google',
      type: 'MNC',
      logo: '🔍',
      freshersIntake: 800,
      seniorsIntake: 1200,
      locations: ['Bangalore', 'Hyderabad'],
      salaryRange: {
        fresher: '₹22-30 LPA',
        experienced: '₹45-100 LPA'
      },
      requirements: ['ML/AI', 'Statistics', 'Python/R'],
      applicationLink: 'https://careers.google.com',
      hiringStatus: 'Active'
    },
    {
      id: 'microsoft-ds',
      name: 'Microsoft',
      type: 'MNC',
      logo: '🪟',
      freshersIntake: 600,
      seniorsIntake: 900,
      locations: ['Bangalore', 'Hyderabad'],
      salaryRange: {
        fresher: '₹20-28 LPA',
        experienced: '₹40-85 LPA'
      },
      requirements: ['Azure ML', 'Deep Learning', 'Statistics'],
      applicationLink: 'https://careers.microsoft.com',
      hiringStatus: 'Active'
    },
    {
      id: 'accenture-ds',
      name: 'Accenture',
      type: 'Service',
      logo: '🔷',
      freshersIntake: 5000,
      seniorsIntake: 3000,
      locations: ['Bangalore', 'Mumbai', 'Chennai', 'Pune'],
      salaryRange: {
        fresher: '₹6-12 LPA',
        experienced: '₹15-40 LPA'
      },
      requirements: ['Analytics', 'Business Intelligence', 'Consulting'],
      applicationLink: 'https://careers.accenture.com',
      hiringStatus: 'Active'
    }
  ],
  'product-manager': [
    {
      id: 'google-pm',
      name: 'Google',
      type: 'MNC',
      logo: '🔍',
      freshersIntake: 200,
      seniorsIntake: 800,
      locations: ['Bangalore', 'Gurgaon'],
      salaryRange: {
        fresher: '₹25-35 LPA',
        experienced: '₹50-120 LPA'
      },
      requirements: ['Product Strategy', 'Analytics', 'Leadership'],
      applicationLink: 'https://careers.google.com',
      hiringStatus: 'Active'
    },
    {
      id: 'flipkart-pm',
      name: 'Flipkart',
      type: 'Product',
      logo: '🛒',
      freshersIntake: 150,
      seniorsIntake: 400,
      locations: ['Bangalore', 'Delhi'],
      salaryRange: {
        fresher: '₹18-25 LPA',
        experienced: '₹35-70 LPA'
      },
      requirements: ['E-commerce', 'User Research', 'Data Analysis'],
      applicationLink: 'https://careers.flipkart.com',
      hiringStatus: 'Active'
    }
  ],
  'ux-designer': [
    {
      id: 'adobe-ux',
      name: 'Adobe',
      type: 'MNC',
      logo: '🎨',
      freshersIntake: 300,
      seniorsIntake: 500,
      locations: ['Bangalore', 'Noida'],
      salaryRange: {
        fresher: '₹12-18 LPA',
        experienced: '₹25-55 LPA'
      },
      requirements: ['Design Systems', 'Prototyping', 'User Research'],
      applicationLink: 'https://careers.adobe.com',
      hiringStatus: 'Active'
    },
    {
      id: 'zomato-ux',
      name: 'Zomato',
      type: 'Product',
      logo: '🍕',
      freshersIntake: 100,
      seniorsIntake: 200,
      locations: ['Gurgaon', 'Bangalore'],
      salaryRange: {
        fresher: '₹8-15 LPA',
        experienced: '₹18-40 LPA'
      },
      requirements: ['Mobile UX', 'Food Tech', 'User Journey'],
      applicationLink: 'https://careers.zomato.com',
      hiringStatus: 'Active'
    }
  ],
  'digital-marketer': [
    {
      id: 'google-dm',
      name: 'Google',
      type: 'MNC',
      logo: '🔍',
      freshersIntake: 500,
      seniorsIntake: 800,
      locations: ['Mumbai', 'Bangalore', 'Gurgaon'],
      salaryRange: {
        fresher: '₹8-15 LPA',
        experienced: '₹20-45 LPA'
      },
      requirements: ['Google Ads', 'Analytics', 'Digital Strategy'],
      applicationLink: 'https://careers.google.com',
      hiringStatus: 'Active'
    },
    {
      id: 'byju-dm',
      name: "BYJU'S",
      type: 'Product',
      logo: '📚',
      freshersIntake: 800,
      seniorsIntake: 600,
      locations: ['Bangalore', 'Mumbai', 'Delhi'],
      salaryRange: {
        fresher: '₹6-12 LPA',
        experienced: '₹15-35 LPA'
      },
      requirements: ['EdTech Marketing', 'Performance Marketing', 'Content'],
      applicationLink: 'https://careers.byjus.com',
      hiringStatus: 'Seasonal'
    }
  ],
  'cybersecurity-analyst': [
    {
      id: 'microsoft-cs',
      name: 'Microsoft',
      type: 'MNC',
      logo: '🪟',
      freshersIntake: 400,
      seniorsIntake: 800,
      locations: ['Bangalore', 'Hyderabad'],
      salaryRange: {
        fresher: '₹15-22 LPA',
        experienced: '₹30-65 LPA'
      },
      requirements: ['Azure Security', 'Threat Intelligence', 'Compliance'],
      applicationLink: 'https://careers.microsoft.com',
      hiringStatus: 'Active'
    },
    {
      id: 'deloitte-cs',
      name: 'Deloitte',
      type: 'Service',
      logo: '🔒',
      freshersIntake: 1200,
      seniorsIntake: 2000,
      locations: ['Mumbai', 'Bangalore', 'Chennai', 'Hyderabad'],
      salaryRange: {
        fresher: '₹8-15 LPA',
        experienced: '₹18-50 LPA'
      },
      requirements: ['Risk Assessment', 'Compliance', 'Security Consulting'],
      applicationLink: 'https://careers.deloitte.com',
      hiringStatus: 'Active'
    }
  ]
};

export const marketInsights: Record<string, MarketInsights> = {
  'software-engineer': {
    careerPath: 'Software Engineer',
    competitionLevel: 'Very High',
    demandTrend: 'Growing',
    totalJobs: 450000,
    averageApplications: 150,
    keyFocusAreas: [
      'Data Structures & Algorithms',
      'System Design',
      'Problem Solving',
      'Communication Skills',
      'Version Control (Git)'
    ],
    criticalTopics: [
      'Arrays, Strings, Linked Lists',
      'Trees, Graphs, Dynamic Programming',
      'Database Design & Optimization',
      'Microservices Architecture',
      'Cloud Platforms (AWS/Azure)',
      'API Design & Development',
      'Testing & Debugging',
      'Code Review & Best Practices'
    ],
    industryGrowth: '22% (Much faster than average)',
    emergingSkills: ['AI/ML Integration', 'DevOps', 'Kubernetes', 'Serverless']
  },
  'data-scientist': {
    careerPath: 'Data Scientist',
    competitionLevel: 'High',
    demandTrend: 'Growing',
    totalJobs: 85000,
    averageApplications: 200,
    keyFocusAreas: [
      'Statistical Analysis',
      'Machine Learning',
      'Data Visualization',
      'Business Acumen',
      'Programming (Python/R)'
    ],
    criticalTopics: [
      'Supervised & Unsupervised Learning',
      'Feature Engineering',
      'Model Evaluation & Validation',
      'SQL & Database Management',
      'Statistical Hypothesis Testing',
      'Data Cleaning & Preprocessing',
      'Deep Learning Frameworks',
      'A/B Testing & Experimentation'
    ],
    industryGrowth: '35% (Much faster than average)',
    emergingSkills: ['MLOps', 'AutoML', 'Edge AI', 'Explainable AI']
  },
  'product-manager': {
    careerPath: 'Product Manager',
    competitionLevel: 'Very High',
    demandTrend: 'Growing',
    totalJobs: 65000,
    averageApplications: 300,
    keyFocusAreas: [
      'Product Strategy',
      'User Research',
      'Data Analysis',
      'Stakeholder Management',
      'Market Research'
    ],
    criticalTopics: [
      'Product Roadmapping',
      'User Story Writing',
      'Competitive Analysis',
      'Metrics & KPIs',
      'Agile/Scrum Methodologies',
      'Customer Journey Mapping',
      'Pricing Strategy',
      'Go-to-Market Planning'
    ],
    industryGrowth: '19% (Much faster than average)',
    emergingSkills: ['AI Product Management', 'Growth Hacking', 'Platform Strategy']
  },
  'ux-designer': {
    careerPath: 'UX/UI Designer',
    competitionLevel: 'High',
    demandTrend: 'Growing',
    totalJobs: 95000,
    averageApplications: 120,
    keyFocusAreas: [
      'User Research',
      'Design Thinking',
      'Prototyping',
      'Visual Design',
      'Usability Testing'
    ],
    criticalTopics: [
      'Information Architecture',
      'Wireframing & Mockups',
      'Design Systems',
      'Accessibility (WCAG)',
      'Mobile-First Design',
      'Interaction Design',
      'User Personas & Journey Maps',
      'Design Tools Mastery'
    ],
    industryGrowth: '13% (Faster than average)',
    emergingSkills: ['Voice UI', 'AR/VR Design', 'Design Ops', 'Ethical Design']
  },
  'digital-marketer': {
    careerPath: 'Digital Marketing Specialist',
    competitionLevel: 'Medium',
    demandTrend: 'Growing',
    totalJobs: 180000,
    averageApplications: 80,
    keyFocusAreas: [
      'SEO/SEM',
      'Content Marketing',
      'Social Media Strategy',
      'Analytics',
      'Campaign Management'
    ],
    criticalTopics: [
      'Google Ads & Facebook Ads',
      'Email Marketing Automation',
      'Conversion Rate Optimization',
      'Marketing Funnels',
      'Brand Positioning',
      'Influencer Marketing',
      'Marketing Attribution',
      'Customer Segmentation'
    ],
    industryGrowth: '10% (Faster than average)',
    emergingSkills: ['Marketing Automation', 'AI-Powered Marketing', 'Privacy-First Marketing']
  },
  'cybersecurity-analyst': {
    careerPath: 'Cybersecurity Analyst',
    competitionLevel: 'Medium',
    demandTrend: 'Growing',
    totalJobs: 120000,
    averageApplications: 90,
    keyFocusAreas: [
      'Threat Detection',
      'Risk Assessment',
      'Security Tools',
      'Incident Response',
      'Compliance'
    ],
    criticalTopics: [
      'Network Security Protocols',
      'Vulnerability Assessment',
      'Security Information & Event Management (SIEM)',
      'Penetration Testing',
      'Cryptography',
      'Security Frameworks (NIST, ISO)',
      'Cloud Security',
      'Digital Forensics'
    ],
    industryGrowth: '31% (Much faster than average)',
    emergingSkills: ['Zero Trust Architecture', 'Cloud Security', 'AI Security', 'IoT Security']
  }
};