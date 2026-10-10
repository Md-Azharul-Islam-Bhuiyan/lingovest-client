import { baseApi } from './baseApi';

const logoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLogos: builder.query({
      query: () => ({ url: '/logos', method: 'GET' }),
      providesTags: ['logos'],
    }),
    getActiveLogo: builder.query({
      query: () => ({ url: '/logos/active', method: 'GET' }),
      providesTags: ['activeLogo'],
    }),
    createLogo: builder.mutation({
      query: (data) => ({ url: '/logos', method: 'POST', body: data }),
      invalidatesTags: ['logos'],
    }),
    activateLogo: builder.mutation({
      query: (id) => ({ url: `/logos/activate/${id}`, method: 'PATCH' }),
      invalidatesTags: ['logos', 'activeLogo'],
    }),
    deleteLogo: builder.mutation({
      query: (id) => ({ url: `/logos/${id}`, method: 'DELETE' }),
      invalidatesTags: ['logos'],
    }),
  }),
});

export const {
  useGetAllLogosQuery,
  useGetActiveLogoQuery,
  useCreateLogoMutation,
  useActivateLogoMutation,
  useDeleteLogoMutation,
} = logoApi;
