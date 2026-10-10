import { baseApi } from './baseApi';

export const quizApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllQuizzes: build.query({
      query: (params?: string) => ({
        url: `/quizzes${params ? `?${params}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['quizzes'],
    }),
    getSingleQuiz: build.query({
      query: (id: string) => ({
        url: `/quizzes/${id}`,
        method: 'GET',
      }),
      providesTags: ['quizzes'],
    }),
    createQuiz: build.mutation({
      query: (data) => ({
        url: '/quizzes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['quizzes'],
    }),
    updateQuiz: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/quizzes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['quizzes'],
    }),
    deleteQuiz: build.mutation({
      query: (id: string) => ({
        url: `/quizzes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['quizzes'],
    }),
    deleteQuizItem: build.mutation({
      query: (itemId: string) => ({
        url: `/quizzes/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['quizzes'],
    }),
    aiGenerateQuiz: build.mutation({
      query: (data: { level: string; topic: string; type?: string; quizId?: string; count?: number; customPrompt?: string }) => ({
        url: '/quizzes/ai-generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['quizzes'],
    }),
  }),
});

export const {
  useGetAllQuizzesQuery,
  useGetSingleQuizQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useDeleteQuizItemMutation,
  useAiGenerateQuizMutation,
} = quizApi;
