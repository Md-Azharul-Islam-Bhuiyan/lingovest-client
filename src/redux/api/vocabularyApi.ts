import { baseApi } from './baseApi';

export const vocabularyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllVocabulary: build.query({
      query: (params?: string) => ({
        url: `/vocabulary${params ? `?${params}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['vocabulary'],
    }),
    getSingleVocabulary: build.query({
      query: (id: string) => ({
        url: `/vocabulary/${id}`,
        method: 'GET',
      }),
      providesTags: ['vocabulary'],
    }),
    createVocabulary: build.mutation({
      query: (data) => ({
        url: '/vocabulary',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['vocabulary'],
    }),
    updateVocabulary: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/vocabulary/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['vocabulary'],
    }),
    deleteVocabulary: build.mutation({
      query: (id: string) => ({
        url: `/vocabulary/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['vocabulary'],
    }),
    getVocabularyTopics: build.query({
      query: () => ({
        url: '/vocabulary/topics',
        method: 'GET',
      }),
      providesTags: ['vocabulary'],
    }),
    aiHarvestVocabulary: build.mutation({
      query: (data: { level: string; topic: string; count?: number; customPrompt?: string }) => ({
        url: '/vocabulary/ai-harvest',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['vocabulary'],
    }),
  }),
});

export const {
  useGetAllVocabularyQuery,
  useGetSingleVocabularyQuery,
  useGetVocabularyTopicsQuery,
  useCreateVocabularyMutation,
  useUpdateVocabularyMutation,
  useDeleteVocabularyMutation,
  useAiHarvestVocabularyMutation,
} = vocabularyApi;
