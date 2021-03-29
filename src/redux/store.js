import { configureStore } from '@reduxjs/toolkit';

import userSlice, { verifyAuthStatus } from './slices/userSlice';
import productsSlice from './slices/productsSlice';

export const configureAppStore = () => {
  const store = configureStore({
    reducer: {
      user: userSlice,
      products: productsSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

  store.dispatch(verifyAuthStatus());

  return store;
};
