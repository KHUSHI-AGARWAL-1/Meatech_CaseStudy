import { createSlice } from '@reduxjs/toolkit';

import { loadJson, saveJson } from '../../shared/storage';

type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
};

const storageKey = 'task-manager-theme';

const initialState: ThemeState = {
  mode: loadJson<ThemeMode>(storageKey, 'light')
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      saveJson(storageKey, state.mode);
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
