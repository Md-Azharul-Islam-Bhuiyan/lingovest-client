import { baseApi } from './baseApi';

export const listeningApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllListening: build.query({
      query: (params?: string) => ({
        url: `/listening${params ? `?${params}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['listening'],
    }),
    getSingleListening: build.query({
      query: (id: string) => ({
        url: `/listening/${id}`,
        method: 'GET',
      }),
      providesTags: ['listening'],
    }),
    createListening: build.mutation({
      query: (data) => ({
        url: '/listening',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['listening'],
    }),
    updateListening: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/listening/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['listening'],
    }),
    deleteListening: build.mutation({
      query: (id: string) => ({
        url: `/listening/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['listening'],
    }),
    aiGenerateListening: build.mutation({
      query: (data: { level: string; topic: string; count?: number; customPrompt?: string }) => ({
        url: '/listening/ai-generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['listening'],
    }),
  }),
});

export const {
  useGetAllListeningQuery,
  useGetSingleListeningQuery,
  useCreateListeningMutation,
  useUpdateListeningMutation,
  useDeleteListeningMutation,
  useAiGenerateListeningMutation,
} = listeningApi;
