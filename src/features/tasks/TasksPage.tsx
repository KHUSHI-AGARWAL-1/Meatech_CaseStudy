import { LogOut, Moon, Plus, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../auth/authSlice';
import { toggleTheme } from '../theme/themeSlice';

import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { createTask, deleteTask, fetchTasks, setFilter, updateTask } from './tasksSlice';
import type { Task, TaskDraft, TaskStatus } from './types';

const filters: Array<TaskStatus | 'all'> = ['all', 'todo', 'in-progress', 'done'];

const filterLabels: Record<TaskStatus | 'all', string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done'
};

export function TasksPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, filter } = useAppSelector((state) => state.tasks);
  const theme = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    void dispatch(fetchTasks());
  }, [dispatch]);

  const visibleTasks = useMemo(
    () => (filter === 'all' ? items : items.filter((task) => task.status === filter)),
    [filter, items]
  );

  async function handleSubmit(task: TaskDraft) {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask.id, task }));
    } else {
      await dispatch(createTask(task));
    }
    setEditingTask(null);
    setIsFormOpen(false);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingTask(null);
    setIsFormOpen(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome, {user?.name}</p>
            <h1 className="text-2xl font-semibold">Tasks</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              aria-label="Toggle dark mode"
              className="rounded-md border border-slate-300 p-2 dark:border-gray-600"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 font-medium dark:border-gray-600"
              onClick={() => dispatch(logout())}
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  filter === item
                    ? 'bg-reef text-white'
                    : 'border border-slate-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                }`}
                onClick={() => dispatch(setFilter(item))}
              >
                {filterLabels[item]}
              </button>
            ))}
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-reef px-4 py-2 font-semibold text-white"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={18} />
            New task
          </button>
        </div>

        {isFormOpen ? (
          <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeForm} />
        ) : null}

        {status === 'loading' ? <p className="text-sm text-slate-500">Loading tasks...</p> : null}
        {error ? <p role="alert" className="text-sm text-ember">{error}</p> : null}

        <div className="grid gap-3 md:grid-cols-2">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={(id) => void dispatch(deleteTask(id))}
            />
          ))}
        </div>

        {status !== 'loading' && visibleTasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-gray-600 dark:text-slate-400">
            No tasks match this view.
          </p>
        ) : null}
      </section>
    </main>
  );
}
