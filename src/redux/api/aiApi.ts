import { baseApi } from './baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    generateDescription: build.mutation({
      query: (data) => ({
        url: '/ai/generate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGenerateDescriptionMutation } = aiApi;
