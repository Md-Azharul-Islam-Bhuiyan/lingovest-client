import {
  TAuthInitialState,
  TPayment,
  TShoppingCartInitialState,
  TWishListInitialState,
} from '../types/commonTypes';

import {
  authAccessKey,
  authRefreshKey,
} from '@/constant/authkey';
import { getCookie } from '@/utils/cookieHelper';
import { decodeToken } from '@/utils/tokenHelper';

const storedAccessToken = getCookie(authAccessKey);
const storedRefreshToken = getCookie(authRefreshKey);
const storedUser = decodeToken(storedAccessToken);

export const authInitialState: TAuthInitialState = {
  user: storedUser,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
};

export const wishListInitialState: TWishListInitialState = {
  wishedProducts: [],
};

export const shoppingCartInitialState: TShoppingCartInitialState = {
  cartProducts: [],
};

export const paymentInitialState: TPayment = {
  cartProducts: [],
  appliedCoupon: '',
  discount: 0,
  subtotal: 0,
  totalToBePaid: 0,
};
