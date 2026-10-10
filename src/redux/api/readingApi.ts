import { baseApi } from './baseApi';

export const readingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllReading: build.query({
      query: (params?: string) => ({
        url: `/reading${params ? `?${params}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['reading'],
    }),
    getSingleReading: build.query({
      query: (id: string) => ({
        url: `/reading/${id}`,
        method: 'GET',
      }),
      providesTags: ['reading'],
    }),
    createReading: build.mutation({
      query: (data) => ({
        url: '/reading',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['reading'],
    }),
    updateReading: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/reading/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['reading'],
    }),
    deleteReading: build.mutation({
      query: (id: string) => ({
        url: `/reading/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['reading'],
    }),
    aiGenerateReading: build.mutation({
      query: (data: { level: string; topic: string; count?: number; customPrompt?: string }) => ({
        url: '/reading/ai-generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['reading'],
    }),
  }),
});

export const {
  useGetAllReadingQuery,
  useGetSingleReadingQuery,
  useCreateReadingMutation,
  useUpdateReadingMutation,
  useDeleteReadingMutation,
  useAiGenerateReadingMutation,
} = readingApi;
