import { describe, expect, it } from 'vitest';

import { themeReducer, toggleTheme } from './themeSlice';

describe('themeSlice', () => {
  it('toggles theme and persists the preference', () => {
    let state = themeReducer(undefined, toggleTheme());

    expect(state.mode).toBe('dark');
    expect(localStorage.getItem('task-manager-theme')).toBe('"dark"');

    state = themeReducer(state, toggleTheme());

    expect(state.mode).toBe('light');
  });
});
