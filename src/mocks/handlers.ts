import { http, HttpResponse } from 'msw';

import type { Task, TaskDraft } from '../features/tasks/types';

import { mockToken, mockUser, seedTasks } from './data';

let tasks: Task[] = [...seedTasks];
const tasksStorageKey = 'task-manager-tasks';

function readTasks() {
  try {
    const storedTasks = localStorage.getItem(tasksStorageKey);
    tasks = storedTasks ? (JSON.parse(storedTasks) as Task[]) : tasks;
  } catch {
    tasks = [...seedTasks];
  }

  return tasks;
}

function writeTasks(nextTasks: Task[]) {
  tasks = nextTasks;
  localStorage.setItem(tasksStorageKey, JSON.stringify(tasks));
}

function unauthorized() {
  return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

function hasAuth(request: Request) {
  return request.headers.get('Authorization') === `Bearer ${mockToken}`;
}

export function resetMockData() {
  tasks = [...seedTasks];
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === mockUser.email && body.password === 'test123') {
      return HttpResponse.json({ token: mockToken, user: mockUser });
    }

    return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }),

  http.get('/api/tasks', ({ request }) => {
    if (!hasAuth(request)) return unauthorized();
    return HttpResponse.json(readTasks());
  }),

  http.post('/api/tasks', async ({ request }) => {
    if (!hasAuth(request)) return unauthorized();

    const draft = (await request.json()) as TaskDraft;
    const task: Task = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    writeTasks([task, ...readTasks()]);

    return HttpResponse.json(task, { status: 201 });
  }),

  http.put('/api/tasks/:id', async ({ params, request }) => {
    if (!hasAuth(request)) return unauthorized();

    const id = String(params.id);
    const draft = (await request.json()) as TaskDraft;
    const currentTasks = readTasks();
    const existing = currentTasks.find((task) => task.id === id);

    if (!existing) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const updated = { ...existing, ...draft };
    writeTasks(currentTasks.map((task) => (task.id === id ? updated : task)));

    return HttpResponse.json(updated);
  }),

  http.delete('/api/tasks/:id', ({ params, request }) => {
    if (!hasAuth(request)) return unauthorized();

    const id = String(params.id);
    writeTasks(readTasks().filter((task) => task.id !== id));

    return HttpResponse.json({ id });
  })
];
