import { baseApi } from './baseApi';

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['categories'],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['categories'],
    }),
    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: ['category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: categoryData,
      }),
      invalidatesTags: ['categories', 'category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['categories'],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
