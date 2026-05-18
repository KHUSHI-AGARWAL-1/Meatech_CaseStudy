import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../features/auth/authSlice';
import { tasksReducer } from '../features/tasks/tasksSlice';
import { themeReducer } from '../features/theme/themeSlice';

const reducer = {
  auth: authReducer,
  tasks: tasksReducer,
  theme: themeReducer
};

export const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer,
    preloadedState: preloadedState as RootState
  });
}
