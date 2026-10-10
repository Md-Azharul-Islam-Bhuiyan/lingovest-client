import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  authAccessKey,
  authEmailVerifiedKey,
  authRefreshKey,
} from '../../constant/authkey';
import { authInitialState } from '../initialStates';
import { RootState } from '../store';
import { removeCookie, setCookie } from '../../utils/cookieHelper';
import { TAuthInitialState } from '../../types/commonTypes';

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<TAuthInitialState>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      if (accessToken && refreshToken) {
        setCookie(authAccessKey, accessToken);
        setCookie(authRefreshKey, refreshToken);
        setCookie(authEmailVerifiedKey, user?.isEmailVerified ? 'true' : 'false');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<TAuthInitialState>>) => {
      const { user, accessToken, refreshToken } = action.payload;
      if (user !== undefined) state.user = user;
      if (accessToken !== undefined) state.accessToken = accessToken;
      if (refreshToken !== undefined) state.refreshToken = refreshToken;

      if (accessToken || refreshToken || user?.isEmailVerified !== undefined) {
        if (state.accessToken) setCookie(authAccessKey, state.accessToken);
        if (state.refreshToken) setCookie(authRefreshKey, state.refreshToken);
        if (state.user?.isEmailVerified !== undefined) {
          setCookie(authEmailVerifiedKey, state.user.isEmailVerified ? 'true' : 'false');
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      removeCookie(authAccessKey);
      removeCookie(authRefreshKey);
      removeCookie(authEmailVerifiedKey);
    },
  },
});

export const { setUser, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.accessToken;
export const useCurrentUser = (state: RootState) => state.auth.user;
