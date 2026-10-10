import { baseApi } from './baseApi';

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (query = '') => ({ url: `/coupons?${query}`, method: 'GET' }),
      providesTags: ['coupons'],
    }),
    getSingleCoupon: builder.query({
      query: (id: string) => ({ url: `/coupons/${id}`, method: 'GET' }),
      providesTags: ['coupons'],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({ url: '/coupons', method: 'POST', body: data }),
      invalidatesTags: ['coupons'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/coupons/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['coupons'],
    }),
    deleteCoupon: builder.mutation({
      query: (id: string) => ({ url: `/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['coupons'],
    }),
    applyCoupon: builder.mutation({
      query: (data: { code: string; totalAmount: number }) => ({
        url: '/coupons/apply',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetSingleCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponApi;
