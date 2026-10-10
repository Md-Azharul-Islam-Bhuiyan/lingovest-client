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

export const mainRoutePaths = [
  { index: true, element: <Home /> },
  // German Learning Core Learner Modules
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
