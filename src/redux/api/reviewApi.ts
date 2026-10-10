import { baseApi } from './baseApi';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId: string) => ({
        url: `/reviews/${productId}`,
        method: 'GET',
      }),
      providesTags: ['reviews'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['reviews'],
    }),
  }),
});

export const { useGetProductReviewsQuery, useCreateReviewMutation } = reviewApi;
