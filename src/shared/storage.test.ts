import { describe, expect, it } from 'vitest';

import { loadJson, removeJson, saveJson } from './storage';

describe('storage helpers', () => {
  it('loads fallback values and stored json', () => {
    expect(loadJson('missing', 'fallback')).toBe('fallback');

    saveJson('theme', 'dark');

    expect(loadJson('theme', 'light')).toBe('dark');
  });

  it('removes values and tolerates malformed json', () => {
    localStorage.setItem('broken', '{');

    expect(loadJson('broken', 'fallback')).toBe('fallback');

    saveJson('auth', { token: 'abc' });
    removeJson('auth');

    expect(localStorage.getItem('auth')).toBeNull();
  });
});
