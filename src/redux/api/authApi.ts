import { baseApi } from './baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => {
        return {
          url: '/auth/login',
          method: 'POST',
          body: loginData,
        };
      },
      invalidatesTags: ['user'],
    }),
    signup: builder.mutation({
      query: (signupData) => {
        return {
          url: '/auth/register',
          method: 'POST',
          body: signupData,
        };
      },
      invalidatesTags: ['user'],
    }),
    getProfile: builder.query({
      query: () => {
        return {
          url: '/auth/get-profile',
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => {
        return {
          url: '/auth/change-password',
          method: 'POST',
          body: passwordData,
        };
      },
    }),
    updateProfile: builder.mutation({
      query: (profileDataToBeUpdated) => {
        return {
          url: '/auth/update-profile',
          method: 'PUT',
          body: profileDataToBeUpdated,
        };
      },
      invalidatesTags: ['user'],
    }),
    getAdminOverviewMetaData: builder.query({
      query: () => {
        return {
          url: '/auth/getadminoverviewdata',
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    getVendorOverviewMetaData: builder.query({
      query: () => {
        return {
          url: '/auth/getvendoroverviewdata',
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    getCustomerOverviewMetaData: builder.query({
      query: () => {
        return {
          url: '/auth/getcustomeroverviewdata',
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    getAllVendorsForAdmin: builder.query({
      query: (query) => {
        return {
          url: `/auth/getallvendors?${query}`,
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    getAllCustomers: builder.query({
      query: (query) => {
        return {
          url: `/auth/getallcustomers?${query}`,
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    getAllUsers: builder.query({
      query: (query) => {
        return {
          url: `/users${query ? `?${query}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),
    createUserByAdmin: builder.mutation({
      query: (userData) => {
        return {
          url: '/users',
          method: 'POST',
          body: userData,
        };
      },
      invalidatesTags: ['user'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: 'ACTIVE' | 'BLOCKED' | 'PENDING' }) => {
        return {
          url: `/users/${id}/status`,
          method: 'PATCH',
          body: { status },
        };
      },
      invalidatesTags: ['user'],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `/users/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['user'],
    }),
    blockOrUnblockUser: builder.mutation({
      query: (blockOrUnblockData) => {
        return {
          url: '/auth/blockorunblockuser',
          method: 'PUT',
          body: {
            id: blockOrUnblockData.id,
            block: blockOrUnblockData.block,
          },
        };
      },
      invalidatesTags: ['user'],
    }),
    updateUser: builder.mutation({
      query: (userData) => {
        return {
          url: `/users/${userData.id}`,
          method: 'PATCH',
          body: {
            role: userData.role,
          },
        };
      },
      invalidatesTags: ['user'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useGetAdminOverviewMetaDataQuery,
  useGetVendorOverviewMetaDataQuery,
  useGetCustomerOverviewMetaDataQuery,
  useGetAllVendorsForAdminQuery,
  useGetAllCustomersQuery,
  useGetAllUsersQuery,
  useCreateUserByAdminMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useBlockOrUnblockUserMutation,
  useUpdateUserMutation,
} = authApi;
