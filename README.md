# AI Career Path Predictor

An intelligent career guidance platform powered by AI that provides personalized learning recommendations and skill assessments.

## 🚀 Features

- **AI-Powered Assessments**: Dynamic question generation using Google Gemini AI
- **Skill Gap Analysis**: Detailed analysis of current vs required skills
- **Personalized Learning Paths**: Custom roadmaps based on career goals
- **Progress Tracking**: Comprehensive analytics and achievement system
- **Career Comparison**: Side-by-side analysis of different career paths
- **Market Insights**: Real-time industry data and hiring trends

## 🛠️ Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd cap-courseai
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 3. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings → API to get your URL and anon key
3. Run the database migrations in your Supabase dashboard:
   - Go to SQL Editor
   - Copy and run each migration file from `supabase/migrations/`

### 4. Gemini AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 5. Run the Application
```bash
npm run dev
```

## 📊 Database Schema

The application uses three main tables:
- **users**: User profiles and authentication data
- **assessments**: Career assessment results and responses
- **user_progress**: Learning progress and skill tracking

## 🤖 AI Features

- **Adaptive Questions**: Questions that adapt based on user responses
- **Intelligent Analysis**: Deep insights from user assessment data
- **Personalized Recommendations**: AI-generated learning paths
- **Dynamic Content**: Real-time question generation

## 🎯 Academic Research

This project is designed for academic research in:
- AI-powered career guidance systems
- Personalized learning path generation
- Skill gap analysis and assessment
- Educational technology and user experience

## 🔧 Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: Google Gemini API
- **Build Tool**: Vite
- **Styling**: Custom liquid glass morphism design

## 📝 Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, Theme)
├── data/              # Static data and mock data
├── lib/               # External service configurations
├── services/          # API service layers
├── types/             # TypeScript type definitions
└── styles/            # CSS and styling files
```

## 🎨 Design System

The application features a modern liquid glass morphism design with:
- Responsive layouts for all screen sizes
- Dark/light mode support
- Smooth animations and micro-interactions
- Accessible color schemes and typography

## 📈 Future Enhancements

- Integration with job boards and career platforms
- Advanced analytics and reporting
- Mobile application development
- Machine learning model improvements
- Multi-language support

---
