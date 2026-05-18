import type { Task } from '../features/tasks/types';

export const mockUser = {
  id: 'user-1',
  name: 'test-user',
  email: 'test@example.com'
};

export const mockToken = 'mock.jwt.token';

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Plan sprint priorities',
    description: 'Review product goals and select the highest impact work for this week.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-05-21',
    createdAt: '2026-05-18T08:30:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Refine onboarding flow',
    description: 'Tighten empty states, success copy, and first-task creation.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-05-24',
    createdAt: '2026-05-18T09:00:00.000Z'
  }
];
