import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { loadJson, removeJson, saveJson } from '../../shared/storage';

import { loginRequest } from './authApi';
import type { AuthResponse, LoginCredentials, User } from './types';

type AuthState = {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const storageKey = 'task-manager-auth';

const persistedAuth = loadJson<AuthResponse | null>(storageKey, null);

const initialState: AuthState = {
  user: persistedAuth?.user ?? null,
  token: persistedAuth?.token ?? null,
  status: 'idle',
  error: null
};

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials) => {
  return loginRequest(credentials);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      removeJson(storageKey);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        saveJson(storageKey, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unable to sign in';
      });
  }
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
