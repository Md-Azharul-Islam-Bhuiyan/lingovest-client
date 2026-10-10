import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import {
  logout,
  setUser,
} from '../features/authSlice';
import { RootState } from '../store';
import { API_BASE_URL } from '@/constant/config';

const FALLBACK_API_BASE_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL.slice(0, -4)
  : null;

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState)?.auth?.accessToken;

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const fallbackBaseQuery = FALLBACK_API_BASE_URL
  ? fetchBaseQuery({
      baseUrl: FALLBACK_API_BASE_URL,
      credentials: 'include',
      prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState)?.auth?.accessToken;

        if (accessToken) {
          headers.set('authorization', `Bearer ${accessToken}`);
        }

        return headers;
      },
    })
  : null;

const runFallbackRequest = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  if (!fallbackBaseQuery) {
    return null;
  }

  return fallbackBaseQuery(args, api, extraOptions);
};

const refreshTokenUrl = `${API_BASE_URL}/auth/refresh-token`;

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 404 && FALLBACK_API_BASE_URL) {
    const fallbackResult = await runFallbackRequest(args, api, extraOptions);
    if (fallbackResult && !fallbackResult.error) {
      result = fallbackResult;
    }
  }

  if (result?.error?.status === 401) {
    const response = await fetch(refreshTokenUrl, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();
    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          accessToken: data?.data?.accessToken,
          refreshToken: data?.data?.refreshToken || (api.getState() as RootState).auth.refreshToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);

      if (result?.error?.status === 404 && FALLBACK_API_BASE_URL) {
        const fallbackResult = await runFallbackRequest(args, api, extraOptions);
        if (fallbackResult && !fallbackResult.error) {
          result = fallbackResult;
        }
      }
    } else {
      api.dispatch(logout());
    }
  }

  if (result?.error) {
    const isGetRequest =
      typeof args === 'string' ||
      !args.method ||
      args.method.toUpperCase() === 'GET';

    // Do not show intrusive sirens for background queries (e.g. logos) or unauthenticated guest requests
    if (!isGetRequest && result.error.status !== 401) {
      const errorMessage = (result.error.data as any)?.message;
      toast.error(errorMessage || 'Something went wrong', {
        position: 'top-right',
        duration: 1500,
        icon: '🚨',
      });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    'user',
    'products',
    'product',
    'orders',
    'order',
    'coupons',
    'reviews',
    'review',
    'categories',
    'category',
    'brands',
    'brand',
    'subcategories',
    'subcategory',
    'siteSettings',
    'news',
    'logos',
    'activeLogo',
    'quizzes',
    'listening',
    'reading',
    'vocabulary',
  ],
  endpoints: () => ({}),
});
