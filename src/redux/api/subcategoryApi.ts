import { baseApi } from './baseApi';

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (subCategoryData) => ({
        url: '/subcategories',
        method: 'POST',
        body: subCategoryData,
      }),
      invalidatesTags: ['subcategories'],
    }),
    getAllSubCategories: builder.query({
      query: (query) => ({
        url: query ? `/subcategories?${query}` : '/subcategories',
        method: 'GET',
      }),
      providesTags: ['subcategories'],
    }),
    getSingleSubCategory: builder.query({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: 'GET',
      }),
      providesTags: ['subcategory'],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, ...subCategoryData }) => ({
        url: `/subcategories/${id}`,
        method: 'PATCH',
        body: subCategoryData,
      }),
      invalidatesTags: ['subcategories', 'subcategory'],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subcategories'],
    }),
  }),
});

export const {
  useCreateSubCategoryMutation,
  useGetAllSubCategoriesQuery,
  useGetSingleSubCategoryQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
