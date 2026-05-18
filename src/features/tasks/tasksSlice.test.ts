import { describe, expect, it } from 'vitest';

import { createTestStore } from '../../app/store';

import { createTask, deleteTask, fetchTasks, setFilter, tasksReducer, updateTask } from './tasksSlice';
import type { Task } from './types';

const task: Task = {
  id: 'task-1',
  title: 'Ship',
  description: 'Release the app',
  status: 'todo',
  priority: 'high',
  dueDate: '2026-05-20',
  createdAt: '2026-05-18T00:00:00.000Z'
};

describe('tasksSlice', () => {
  it('handles filters and fetch states', () => {
    let state = tasksReducer(undefined, setFilter('done'));
    expect(state.filter).toBe('done');

    state = tasksReducer(state, fetchTasks.pending(''));
    expect(state.status).toBe('loading');

    state = tasksReducer(state, fetchTasks.fulfilled([task], ''));
    expect(state.items).toHaveLength(1);
    expect(localStorage.getItem('task-manager-tasks')).toContain('Ship');
  });

  it('handles task mutations', () => {
    let state = tasksReducer(undefined, createTask.fulfilled(task, '', task));
    expect(state.items[0].title).toBe('Ship');

    state = tasksReducer(
      state,
      updateTask.fulfilled({ ...task, title: 'Launch' }, '', { id: task.id, task })
    );
    expect(state.items[0].title).toBe('Launch');

    state = tasksReducer(
      state,
      updateTask.fulfilled({ ...task, id: 'missing', title: 'No-op' }, '', { id: 'missing', task })
    );
    expect(state.items[0].title).toBe('Launch');

    state = tasksReducer(state, deleteTask.fulfilled(task.id, '', task.id));
    expect(state.items).toHaveLength(0);
  });

  it('stores fetch errors', () => {
    let state = tasksReducer(undefined, fetchTasks.rejected(new Error('Missing auth token'), ''));
    expect(state.error).toBe('Missing auth token');

    state = tasksReducer(state, {
      type: fetchTasks.rejected.type,
      error: {},
      meta: { arg: undefined, requestId: '', requestStatus: 'rejected' }
    });
    expect(state.error).toBe('Unable to load tasks');
  });

  it('rejects async thunks without a token', async () => {
    const store = createTestStore();
    const result = await store.dispatch(fetchTasks());

    expect(fetchTasks.rejected.match(result)).toBe(true);
    expect(result.error.message).toBe('Missing auth token');
  });
});
