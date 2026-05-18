import { apiClient } from '../../shared/api/client';

import type { Task, TaskDraft } from './types';

export function fetchTasksRequest(token: string) {
  return apiClient<Task[]>('/tasks', { token });
}

export function createTaskRequest(token: string, task: TaskDraft) {
  return apiClient<Task>('/tasks', {
    method: 'POST',
    token,
    body: task
  });
}

export function updateTaskRequest(token: string, id: string, task: TaskDraft) {
  return apiClient<Task>(`/tasks/${id}`, {
    method: 'PUT',
    token,
    body: task
  });
}

export function deleteTaskRequest(token: string, id: string) {
  return apiClient<{ id: string }>(`/tasks/${id}`, {
    method: 'DELETE',
    token
  });
}
