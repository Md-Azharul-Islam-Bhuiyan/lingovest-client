import { baseApi } from './baseApi';

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (brandData) => ({
        url: '/brands',
        method: 'POST',
        body: brandData,
      }),
      invalidatesTags: ['brands'],
    }),
    getAllBrands: builder.query({
      query: (query) => ({
        url: query ? `/brands?${query}` : '/brands',
        method: 'GET',
      }),
      providesTags: ['brands'],
    }),
    getSingleBrand: builder.query({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'GET',
      }),
      providesTags: ['brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...brandData }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body: brandData,
      }),
      invalidatesTags: ['brands', 'brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['brands'],
    }),
    approveBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body: { status: 'APPROVED' },
      }),
      invalidatesTags: ['brands', 'brand'],
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetAllBrandsQuery,
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useApproveBrandMutation,
} = brandApi;
