import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import firebase from '../../firebase';

export const verifyAuthStatus = createAsyncThunk('user/verifyAuthStatus', async () => {
  const user = await firebase.verifyAuth();

  return {
    email: user?.email,
    id: user?.uid,
  };
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    id: null,
    authVerifyingStatus: 'idle',
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.email = payload.email;
      state.id = payload.id;
    },
    removeUser: (state) => {
      state.email = '';
      state.id = null;
    },
  },
  extraReducers: {
    [verifyAuthStatus.pending]: (state) => {
      state.authVerifyingStatus = 'pending';
    },
    [verifyAuthStatus.fulfilled]: (state, { payload }) => {
      state.email = payload.email;
      state.id = payload.id;
      state.authVerifyingStatus = 'success';
    },
    [verifyAuthStatus.rejected]: (state) => {
      state.authVerifyingStatus = 'failed';
    },
  },
});

export const currentUserSelector = (state) => state.user;
export const authVerifyingStatusSelector = (state) => state.user.authVerifyingStatus;
export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
