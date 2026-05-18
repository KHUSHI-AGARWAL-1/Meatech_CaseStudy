import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';
import { renderWithProviders } from './test/render';

const authState = {
  user: { id: 'user-1', name: 'test-user', email: 'test@example.com' },
  token: 'mock.jwt.token',
  status: 'idle' as const,
  error: null
};

describe('App', () => {
  it('protects task routes and signs in with mocked JWT auth', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
    expect(await screen.findByText('Plan sprint priorities')).toBeInTheDocument();
  });

  it('shows invalid login errors', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />, { route: '/login' });

    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'bad@example.com');
    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });

  it('creates, filters, edits, deletes, toggles theme, and logs out', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />, {
      preloadedState: { auth: authState }
    });

    expect(await screen.findByText('Plan sprint priorities')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new task/i }));
    await user.type(screen.getByLabelText(/title/i), 'Write test plan');
    await user.type(screen.getByLabelText(/description/i), 'Cover login and task flows');
    await user.selectOptions(screen.getByLabelText(/status/i), 'done');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'low');
    await user.clear(screen.getByLabelText(/due date/i));
    await user.type(screen.getByLabelText(/due date/i), '2026-05-31');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    expect(await screen.findByText('Write test plan')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByText('Write test plan')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Plan sprint priorities')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /edit write test plan/i }));
    await user.clear(screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Write launch plan');
    await user.click(screen.getByRole('button', { name: /save task/i }));

    expect(await screen.findByText('Write launch plan')).toBeInTheDocument();

    const card = screen.getByText('Write launch plan').closest('article');
    expect(card).not.toBeNull();
    await user.click(within(card as HTMLElement).getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(screen.queryByText('Write launch plan')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /toggle dark mode/i }));
    expect(document.documentElement).toHaveClass('dark');

    await user.click(screen.getByRole('button', { name: /sign out/i }));
    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('cancels task creation', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />, {
      preloadedState: { auth: authState }
    });

    expect(await screen.findByText('Plan sprint priorities')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new task/i }));
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByRole('button', { name: /create task/i })).not.toBeInTheDocument();
  });

  it('shows the loading state while task data is pending', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: authState,
        tasks: { items: [], status: 'loading', error: null, filter: 'all' }
      }
    });

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('shows task loading errors', async () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { ...authState, token: 'invalid-token' }
      }
    });

    expect(await screen.findByRole('alert')).toHaveTextContent('Unauthorized');
  });

  it('redirects an authenticated user away from login', async () => {
    renderWithProviders(<App />, {
      route: '/login',
      preloadedState: { auth: authState }
    });

    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
  });
});
