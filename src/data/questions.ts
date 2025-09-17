import { Question } from '../types';

export const generateQuestions = (careerPath: string): Question[] => {
  const questionBank: Record<string, Question[]> = {
    'software-engineer': [
      {
        id: 'se-1',
        question: 'How comfortable are you with JavaScript programming?',
        type: 'scale',
        skill: 'JavaScript'
      },
      {
        id: 'se-2',
        question: 'Which best describes your experience with React?',
        type: 'multiple-choice',
        options: ['Never used it', 'Basic understanding', 'Built several projects', 'Expert level'],
        skill: 'React'
      },
      {
        id: 'se-3',
        question: 'How would you rate your problem-solving abilities in coding challenges?',
        type: 'scale',
        skill: 'Problem Solving'
      },
      {
        id: 'se-4',
        question: 'What is your experience with version control systems like Git?',
        type: 'multiple-choice',
        options: ['No experience', 'Basic commands', 'Comfortable with branching', 'Advanced workflows'],
        skill: 'Version Control'
      },
      {
        id: 'se-5',
        question: 'How confident are you in database design and management?',
        type: 'scale',
        skill: 'Database Management'
      }
    ],
    'data-scientist': [
      {
        id: 'ds-1',
        question: 'What is your proficiency level in Python for data analysis?',
        type: 'scale',
        skill: 'Python'
      },
      {
        id: 'ds-2',
        question: 'How familiar are you with machine learning algorithms?',
        type: 'multiple-choice',
        options: ['Not familiar', 'Know basic concepts', 'Implemented several models', 'Expert in ML'],
        skill: 'Machine Learning'
      },
      {
        id: 'ds-3',
        question: 'Rate your statistical analysis knowledge',
        type: 'scale',
        skill: 'Statistics'
      },
      {
        id: 'ds-4',
        question: 'How comfortable are you with SQL for data querying?',
        type: 'scale',
        skill: 'SQL'
      },
      {
        id: 'ds-5',
        question: 'What is your experience with data visualization tools?',
        type: 'multiple-choice',
        options: ['Never used any', 'Basic charts', 'Advanced visualizations', 'Expert in multiple tools'],
        skill: 'Data Visualization'
      }
    ],
    'product-manager': [
      {
        id: 'pm-1',
        question: 'How experienced are you in strategic planning and roadmapping?',
        type: 'scale',
        skill: 'Strategic Planning'
      },
      {
        id: 'pm-2',
        question: 'What is your experience with user experience research?',
        type: 'multiple-choice',
        options: ['No experience', 'Basic understanding', 'Conducted user studies', 'Expert researcher'],
        skill: 'User Experience'
      },
      {
        id: 'pm-3',
        question: 'Rate your leadership and team management skills',
        type: 'scale',
        skill: 'Leadership'
      },
      {
        id: 'pm-4',
        question: 'How familiar are you with Agile methodologies?',
        type: 'multiple-choice',
        options: ['Not familiar', 'Basic knowledge', 'Experienced practitioner', 'Certified expert'],
        skill: 'Agile Methodology'
      },
      {
        id: 'pm-5',
        question: 'Rate your analytical and data interpretation skills',
        type: 'scale',
        skill: 'Analytics'
      }
    ],
    'ux-designer': [
      {
        id: 'ux-1',
        question: 'How proficient are you in user research methodologies?',
        type: 'scale',
        skill: 'User Research'
      },
      {
        id: 'ux-2',
        question: 'What is your experience with design tools like Figma or Sketch?',
        type: 'multiple-choice',
        options: ['Never used', 'Basic skills', 'Proficient user', 'Advanced expert'],
        skill: 'Design Tools'
      },
      {
        id: 'ux-3',
        question: 'Rate your wireframing and prototyping abilities',
        type: 'scale',
        skill: 'Prototyping'
      },
      {
        id: 'ux-4',
        question: 'How comfortable are you with usability testing?',
        type: 'scale',
        skill: 'Usability Testing'
      },
      {
        id: 'ux-5',
        question: 'What is your experience with information architecture?',
        type: 'multiple-choice',
        options: ['Not familiar', 'Basic understanding', 'Created site maps', 'Expert in IA'],
        skill: 'Information Architecture'
      }
    ],
    'digital-marketer': [
      {
        id: 'dm-1',
        question: 'How experienced are you with SEO and SEM strategies?',
        type: 'scale',
        skill: 'SEO/SEM'
      },
      {
        id: 'dm-2',
        question: 'What is your proficiency in social media marketing?',
        type: 'multiple-choice',
        options: ['Beginner', 'Some experience', 'Managed campaigns', 'Expert strategist'],
        skill: 'Social Media Marketing'
      },
      {
        id: 'dm-3',
        question: 'Rate your content creation and marketing skills',
        type: 'scale',
        skill: 'Content Marketing'
      },
      {
        id: 'dm-4',
        question: 'How comfortable are you with marketing analytics tools?',
        type: 'scale',
        skill: 'Analytics'
      },
      {
        id: 'dm-5',
        question: 'What is your experience with PPC advertising?',
        type: 'multiple-choice',
        options: ['No experience', 'Basic campaigns', 'Optimized ads', 'Advanced strategist'],
        skill: 'PPC Advertising'
      }
    ],
    'cybersecurity-analyst': [
      {
        id: 'cs-1',
        question: 'How proficient are you in network security principles?',
        type: 'scale',
        skill: 'Network Security'
      },
      {
        id: 'cs-2',
        question: 'What is your experience with threat analysis and detection?',
        type: 'multiple-choice',
        options: ['No experience', 'Basic knowledge', 'Analyzed threats', 'Expert analyst'],
        skill: 'Threat Analysis'
      },
      {
        id: 'cs-3',
        question: 'Rate your incident response capabilities',
        type: 'scale',
        skill: 'Incident Response'
      },
      {
        id: 'cs-4',
        question: 'How familiar are you with security tools and technologies?',
        type: 'scale',
        skill: 'Security Tools'
      },
      {
        id: 'cs-5',
        question: 'What is your experience with risk assessment?',
        type: 'multiple-choice',
        options: ['Not familiar', 'Basic understanding', 'Conducted assessments', 'Expert evaluator'],
        skill: 'Risk Assessment'
      }
    ]
  };

  return questionBank[careerPath] || [];
};