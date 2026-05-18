import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '../../mocks/server';

import { ApiError, apiClient } from './client';

describe('apiClient', () => {
  it('returns json and attaches auth headers', async () => {
    server.use(
      http.get('/api/probe', ({ request }) => {
        return HttpResponse.json({ token: request.headers.get('Authorization') });
      })
    );

    await expect(apiClient('/probe', { token: 'abc' })).resolves.toEqual({
      token: 'Bearer abc'
    });
  });

  it('throws api errors with response messages', async () => {
    server.use(
      http.get('/api/failure', () => {
        return HttpResponse.json({ message: 'Nope' }, { status: 418 });
      })
    );

    await expect(apiClient('/failure')).rejects.toEqual(new ApiError('Nope', 418));
  });

  it('uses a fallback message when an error response has no json body', async () => {
    server.use(
      http.get('/api/empty-failure', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(apiClient('/empty-failure')).rejects.toEqual(new ApiError('Request failed', 500));
  });

  it('uses a fallback message when an error message is null', async () => {
    server.use(
      http.get('/api/null-message', () => {
        return HttpResponse.json({ message: null }, { status: 400 });
      })
    );

    await expect(apiClient('/null-message')).rejects.toEqual(new ApiError('Request failed', 400));
  });
});
