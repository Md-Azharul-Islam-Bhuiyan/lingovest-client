import { baseApi } from './baseApi';

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNews: builder.query({
      query: (onlyActive = false) => ({ url: `/news${onlyActive ? '?active=true' : ''}`, method: 'GET' }),
      providesTags: ['news'],
    }),
    getSingleNews: builder.query({
      query: (id: string) => ({ url: `/news/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'news', id } as any],
    }),
    createNews: builder.mutation({
      query: (data: { headline: string; content?: string; tag?: string; image?: string; isActive?: boolean }) => ({ url: '/news', method: 'POST', body: data }),
      invalidatesTags: ['news'],
    }),
    updateNews: builder.mutation({
      query: ({ id, ...data }: { id: string; headline?: string; content?: string; tag?: string; image?: string; isActive?: boolean }) => ({
        url: `/news/${id}`, method: 'PATCH', body: data,
      }),
      invalidatesTags: ['news'],
    }),
    deleteNews: builder.mutation({
      query: (id: string) => ({ url: `/news/${id}`, method: 'DELETE' }),
      invalidatesTags: ['news'],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetSingleNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
