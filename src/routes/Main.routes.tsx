import AboutUs from '@/pages/AboutUs';
import Faq from '@/pages/Faq';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import Signup from '@/pages/Signup';
import Support from '@/pages/Support';
import AllNews from '@/pages/AllNews';
import NewsDetails from '@/pages/NewsDetails';
import LearnerVocabulary from '@/pages/LearnerVocabulary';
import LearnerReading from '@/pages/LearnerReading';
import LearnerListening from '@/pages/LearnerListening';
import LearnerQuizzes from '@/pages/LearnerQuizzes';
import LearningWorlds from '@/pages/LearningWorlds';
import CurriculumCalendar from '@/pages/CurriculumCalendar';
import LessonPlayer from '@/pages/LessonPlayer';
import GrammarLibrary from '@/pages/GrammarLibrary';

export const mainRoutePaths = [
  { index: true, element: <Home /> },
  // German Learning Core Curriculum & 60-Day Interactive Platform
  { path: 'curriculum', element: <LearningWorlds /> },
  { path: 'curriculum/:levelCode', element: <CurriculumCalendar /> },
  { path: 'lesson/:levelCode/:dayNumber', element: <LessonPlayer /> },
  { path: 'grammar', element: <GrammarLibrary /> },

  // German Learning Additional Practice Modules
  { path: 'vocabulary', element: <LearnerVocabulary /> },
  { path: 'reading', element: <LearnerReading /> },
  { path: 'listening', element: <LearnerListening /> },
  { path: 'quizzes', element: <LearnerQuizzes /> },

  // General & Support Pages
  { path: 'about-us', element: <AboutUs /> },
  { path: 'faq', element: <Faq /> },
  { path: 'blogs', element: <AllNews /> },
  { path: 'blog/:id', element: <NewsDetails /> },
  { path: 'support', element: <Support /> },
  { path: 'login', element: <Login /> },
  { path: 'forgot-password', element: <ResetPassword /> },
  { path: 'signup', element: <Signup /> },
];
