import { describe, expect, it, vi } from 'vitest';

import { login, logout, authReducer } from './authSlice';

describe('authSlice', () => {
  it('handles login lifecycle and logout', () => {
    let state = authReducer(undefined, login.pending('', { email: 'a', password: 'b' }));

    expect(state.status).toBe('loading');

    state = authReducer(
      state,
      login.fulfilled(
        { token: 'token', user: { id: '1', name: 'test-user', email: 'test@example.com' } },
        '',
        { email: 'test@example.com', password: 'test123' }
      )
    );

    expect(state.user?.name).toBe('test-user');
    expect(localStorage.getItem('task-manager-auth')).toContain('token');

    state = authReducer(state, logout());

    expect(state.token).toBeNull();
  });

  it('stores login errors', () => {
    const state = authReducer(
      undefined,
      login.rejected(new Error('Invalid email or password'), '', {
        email: 'bad@example.com',
        password: 'bad'
      })
    );

    expect(state.error).toBe('Invalid email or password');
  });

  it('uses persisted auth and fallback error messages', async () => {
    localStorage.setItem(
      'task-manager-auth',
      JSON.stringify({ token: 'stored', user: { id: '1', name: 'Stored', email: 'stored@example.com' } })
    );
    vi.resetModules();

    const { authReducer: freshReducer, login: freshLogin } = await import('./authSlice');
    const state = freshReducer(undefined, { type: 'init' });
    const failedState = freshReducer(state, {
      type: freshLogin.rejected.type,
      error: {},
      meta: { arg: { email: 'x@example.com', password: 'bad' }, requestId: '', requestStatus: 'rejected' }
    });

    expect(state.token).toBe('stored');
    expect(failedState.error).toBe('Unable to sign in');
  });
});
