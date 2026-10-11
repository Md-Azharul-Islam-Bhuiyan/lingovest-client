// client/src/redux/api/curriculumApi.ts
import { baseApi } from './baseApi';

export interface ICurriculumLevel {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  worldTheme: string;
  accentColor: string;
  bgGradient: string;
  totalDays: number;
  completedDaysCount?: number;
  progressPercent?: number;
  isUnlocked?: boolean;
  currentDay?: number;
}

export interface ICurriculumDaySummary {
  id: string;
  levelCode: string;
  dayNumber: number;
  title: string;
  description: string;
  phase: string;
  type: 'lesson' | 'review' | 'assessment';
  estimatedMinutes: number;
  focusGrammarTopic: string;
  isMilestone: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  status?: 'completed' | 'in_progress' | 'available' | 'locked';
  _count?: {
    exercises: number;
  };
}

export interface IGrammarLesson {
  id: string;
  dayId: string;
  levelCode: string;
  topic: string;
  title: string;
  conceptOverview: string;
  whyItMatters: string;
  ruleExplanation: string;
  formula?: string;
  examples: { de: string; en: string; highlight?: string; note?: string }[];
  commonMistakes: { incorrect: string; correct: string; explanation: string }[];
  quickTips: string[];
  everydayApplication?: string;
  audioPhrases?: { de: string; en: string }[];
  day?: {
    id: string;
    dayNumber: number;
    phase: string;
    type: string;
    estimatedMinutes: number;
  };
}

export interface ICurriculumExercise {
  id: string;
  dayId: string;
  levelCode: string;
  exerciseType: 'multiple_choice' | 'sentence_builder' | 'fill_blank' | 'matching_pairs' | 'case_detective' | 'verb_conjugation' | 'find_mistake';
  prompt: string;
  instruction: string;
  options: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  sentenceTokens?: string[];
  matchingPairs?: { left: string; right: string }[];
  hints: string[];
  explanation: string;
  xpValue: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ICurriculumDayDetail extends ICurriculumDaySummary {
  level: ICurriculumLevel;
  lesson?: IGrammarLesson;
  exercises: ICurriculumExercise[];
}

export interface ILearnerProgress {
  id: string;
  userId: string;
  currentLevel: string;
  xp: number;
  streakDays: number;
  experienceMode: 'playful' | 'calm' | 'focus';
  dailyGoalMinutes: number;
  completedDays: string[];
  levelDayProgress: Record<string, number>;
  achievements: { id: string; name: string; icon: string; description: string; unlockedAt: string }[];
  srsReviewItems: { id: string; levelCode: string; dayNumber: number; nextReviewDate?: string; repetitions?: number }[];
  lastStudiedAt: string;
}

export const curriculumApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurriculumLevels: builder.query<{ data: ICurriculumLevel[] }, void>({
      query: () => ({
        url: '/curriculum/levels',
        method: 'GET',
      }),
      providesTags: ['curriculum', 'learnerProgress'],
    }),

    getLevelSchedule: builder.query<{ data: { level: ICurriculumLevel; days: ICurriculumDaySummary[] } }, string>({
      query: (levelCode) => ({
        url: `/curriculum/schedule/${levelCode}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, levelCode) => [
        { type: 'curriculum', id: levelCode },
        'learnerProgress',
      ],
    }),

    getCurriculumDay: builder.query<{ data: ICurriculumDayDetail }, { levelCode: string; dayNumber: number }>({
      query: ({ levelCode, dayNumber }) => ({
        url: `/curriculum/day/${levelCode}/${dayNumber}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { levelCode, dayNumber }) => [
        { type: 'curriculum', id: `${levelCode}_${dayNumber}` },
      ],
    }),

    getGrammarLibrary: builder.query<{ data: IGrammarLesson[] }, { level?: string; search?: string }>({
      query: (params) => ({
        url: '/curriculum/grammar-library',
        method: 'GET',
        params,
      }),
      providesTags: ['curriculum'],
    }),

    getMyProgress: builder.query<{ data: ILearnerProgress }, void>({
      query: () => ({
        url: '/curriculum/progress/me',
        method: 'GET',
      }),
      providesTags: ['learnerProgress'],
    }),

    completeDay: builder.mutation<
      { data: { progress: ILearnerProgress; xpEarned: number; isFirstTimeCompletion: boolean; newStreak: number; unlockedAchievements: any[] } },
      { levelCode: string; dayNumber: number; score: number; totalQuestions: number; xpEarned: number }
    >({
      query: (body) => ({
        url: '/curriculum/progress/complete-day',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['curriculum', 'learnerProgress'],
    }),

    updateLearnerSettings: builder.mutation<
      { data: ILearnerProgress },
      { experienceMode?: 'playful' | 'calm' | 'focus'; dailyGoalMinutes?: number; currentLevel?: string }
    >({
      query: (body) => ({
        url: '/curriculum/progress/settings',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['learnerProgress', 'curriculum'],
    }),

    getSrsReviewQueue: builder.query<{ data: { dueCount: number; items: any[] } }, void>({
      query: () => ({
        url: '/curriculum/srs/queue',
        method: 'GET',
      }),
      providesTags: ['learnerProgress'],
    }),
  }),
});

export const {
  useGetCurriculumLevelsQuery,
  useGetLevelScheduleQuery,
  useGetCurriculumDayQuery,
  useGetGrammarLibraryQuery,
  useGetMyProgressQuery,
  useCompleteDayMutation,
  useUpdateLearnerSettingsMutation,
  useGetSrsReviewQueueQuery,
} = curriculumApi;
