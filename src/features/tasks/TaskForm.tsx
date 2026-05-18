import { FormEvent, useEffect, useState } from 'react';

import type { Task, TaskDraft, TaskPriority, TaskStatus } from './types';

type TaskFormProps = {
  task?: Task | null;
  onSubmit: (task: TaskDraft) => Promise<void> | void;
  onCancel: () => void;
};

const defaultDraft: TaskDraft = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: new Date().toISOString().slice(0, 10)
};

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(defaultDraft);

  useEffect(() => {
    setDraft(task ?? defaultDraft);
  }, [task]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(draft);
    setDraft(defaultDraft);
  }

  return (
    <form
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Title</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none ring-reef/30 focus:ring-4 dark:border-gray-600 dark:bg-gray-900"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none ring-reef/30 focus:ring-4 dark:border-gray-600 dark:bg-gray-900"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Status</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            value={draft.status}
            onChange={(event) => setDraft({ ...draft, status: event.target.value as TaskStatus })}
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Priority</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            value={draft.priority}
            onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskPriority })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Due date</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            type="date"
            value={draft.dueDate}
            onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
            required
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-4 py-2 font-medium dark:border-gray-600"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="rounded-md bg-reef px-4 py-2 font-semibold text-white">
          {task ? 'Save task' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
