import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import firebase from '../../firebase';

export const getAllProducts = createAsyncThunk('products/getAllProducts', async () => {
  return await firebase.fetchCollection('products');
});

export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async ({ productId, imageUrl }) => {
    const isDeleted = await firebase.deleteDocument('products', productId);
    const fileRef = await firebase.storage.refFromURL(imageUrl);
    fileRef.delete();
    if (isDeleted) return productId;
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: {
    [getAllProducts.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllProducts.fulfilled]: (state, { payload }) => {
      state.allProducts = payload;
      state.isLoading = false;
    },
    [getAllProducts.rejected]: (state) => {
      state.isLoading = false;
    },
    [removeProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [removeProduct.fulfilled]: (state, { payload }) => {
      state.allProducts = state.allProducts.filter(({ id }) => id !== payload);
      state.isLoading = false;
    },
    [removeProduct.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const productsSelector = (state) => state.products.allProducts;
export const isLoadingSelector = (state) => state.products.isLoading;
export default productsSlice.reducer;
