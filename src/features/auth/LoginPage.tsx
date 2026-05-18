import { FormEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { login } from './authSlice';

type LocationState = {
  from?: { pathname?: string };
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { token, status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123');
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/tasks';

  if (token) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await dispatch(login({ email, password }));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 dark:bg-gray-900 dark:text-slate-100">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-reef dark:text-teal-300">
            Task Management
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in to your workspace</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-reef/30 transition focus:ring-4 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-reef/30 transition focus:ring-4 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p role="alert" className="text-sm text-ember">{error}</p> : null}

          <button
            className="w-full rounded-md bg-reef px-4 py-2 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
