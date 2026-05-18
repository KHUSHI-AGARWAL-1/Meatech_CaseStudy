import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { resetMockData } from '../mocks/handlers';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  resetMockData();
  localStorage.clear();
  document.documentElement.className = '';
  vi.restoreAllMocks();
});

afterAll(() => server.close());
