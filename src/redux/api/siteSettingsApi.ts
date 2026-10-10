import { baseApi } from './baseApi';

const siteSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteSettings: builder.query({
      query: () => ({ url: '/site-settings', method: 'GET' }),
      providesTags: ['siteSettings'],
    }),
    updateSiteSettings: builder.mutation({
      query: (data) => ({ url: '/site-settings', method: 'PATCH', body: data }),
      invalidatesTags: ['siteSettings'],
    }),
  }),
});

export const { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } = siteSettingsApi;
