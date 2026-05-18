import { Pencil, Trash2 } from 'lucide-react';

import type { Task } from './types';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const statusLabels: Record<Task['status'], string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done'
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            aria-label={`Edit ${task.title}`}
            className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-gray-700"
            onClick={() => onEdit(task)}
          >
            <Pencil size={18} />
          </button>
          <button
            aria-label={`Delete ${task.title}`}
            className="rounded-md p-2 text-ember hover:bg-rose-50 dark:hover:bg-gray-700"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Status</dt>
          <dd className="font-medium">{statusLabels[task.status]}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Priority</dt>
          <dd className="font-medium capitalize">{task.priority}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Due</dt>
          <dd className="font-medium">{task.dueDate}</dd>
        </div>
      </dl>
    </article>
  );
}
