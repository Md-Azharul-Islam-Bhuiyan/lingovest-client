import { baseApi } from './baseApi';

const normalizeProductsResponse = (response: any) => {
  const root = response?.data ?? response;
  const products = Array.isArray(root?.data)
    ? root.data
    : Array.isArray(root)
    ? root
    : Array.isArray(response?.data)
    ? response.data
    : [];
  const meta = root?.meta ?? response?.meta ?? {};

  // Keep backward compatibility for components that read:
  // - data?.data?.map(...)
  // - data?.data?.data?.map(...)
  const productsWithCompat = Object.assign([...products], {
    data: products,
    meta,
  });

  return {
    ...response,
    data: productsWithCompat,
    meta,
  };
};

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (productData) => {
        return {
          url: '/products',
          method: 'POST',
          body: productData,
        };
      },
      invalidatesTags: ['products'],
    }),
    getProducts: builder.query({
      query: (query) => {
        return {
          url: `/products?${query}`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => normalizeProductsResponse(response),
      providesTags: ['products'],
    }),
    getSingleProduct: builder.query({
      query: (id) => {
        return {
          url: `/products/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['product'],
    }),
    getAllProductsOfAVendorToManage: builder.query({
      query: (query) => {
        return {
          url: `/products/manage-products?${query}`,
          method: 'GET',
        };
      },
      providesTags: ['product', 'products'],
    }),
    updateProduct: builder.mutation({
      query: (productData) => {
        return {
          url: `/products/${productData?.id}`,
          method: 'PATCH',
          body: productData,
        };
      },
      invalidatesTags: ['products', 'product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `/products/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['product', 'products'],
    }),
    deleteMultipleProducts: builder.mutation({
      query: (deleteContainer) => {
        return {
          url: `/products`,
          method: 'DELETE',
          body: {
            productIds: deleteContainer,
          },
        };
      },
      invalidatesTags: ['product', 'products'],
    }),
    approveProduct: builder.mutation({
      query: (id) => {
        return {
          url: `/products/${id}`,
          method: 'PATCH',
          body: { status: 'APPROVED' },
        };
      },
      invalidatesTags: ['products', 'product'],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteMultipleProductsMutation,
  useGetAllProductsOfAVendorToManageQuery,
  useApproveProductMutation,
} = productApi;
