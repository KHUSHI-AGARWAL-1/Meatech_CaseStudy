import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import { loadJson, saveJson } from '../../shared/storage';

import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasksRequest,
  updateTaskRequest
} from './tasksApi';
import type { Task, TaskDraft, TaskStatus } from './types';

type TasksState = {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: TaskStatus | 'all';
};

const storageKey = 'task-manager-tasks';

const initialState: TasksState = {
  items: loadJson<Task[]>(storageKey, []),
  status: 'idle',
  error: null,
  filter: 'all'
};

function authToken(state: RootState) {
  const token = state.auth.token;
  if (!token) throw new Error('Missing auth token');
  return token;
}

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
  'tasks/fetch',
  async (_, { getState }) => fetchTasksRequest(authToken(getState()))
);

export const createTask = createAsyncThunk<Task, TaskDraft, { state: RootState }>(
  'tasks/create',
  async (task, { getState }) => createTaskRequest(authToken(getState()), task)
);

export const updateTask = createAsyncThunk<Task, { id: string; task: TaskDraft }, { state: RootState }>(
  'tasks/update',
  async ({ id, task }, { getState }) => updateTaskRequest(authToken(getState()), id, task)
);

export const deleteTask = createAsyncThunk<string, string, { state: RootState }>(
  'tasks/delete',
  async (id, { getState }) => {
    await deleteTaskRequest(authToken(getState()), id);
    return id;
  }
);

function persist(items: Task[]) {
  saveJson(storageKey, items);
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<TasksState['filter']>) {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        persist(state.items);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unable to load tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        persist(state.items);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
        persist(state.items);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
        persist(state.items);
      });
  }
});

export const { setFilter } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
