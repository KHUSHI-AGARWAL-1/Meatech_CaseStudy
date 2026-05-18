import { apiClient } from '../../shared/api/client';

import type { AuthResponse, LoginCredentials } from './types';

export function loginRequest(credentials: LoginCredentials) {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials
  });
}
