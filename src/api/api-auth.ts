// src/api/Api-auth.ts
import { api } from './client';
import type { ApiResponse, User } from './types';
export interface SignupResponse {
  user: User;
  token: string;
}

export interface SigninResponse {
  user: User;
  token: string;
}

export interface GoogleLoginResponse {
  user: User;
  token: string;
}

export const auth = {
  signup: (user: User, password: string) => api.post<SignupResponse>('/api/auth/signup', { ...user, password }),
  signin: (email: string, password: string) => api.post<SigninResponse>('/api/auth/signin', { email, password }),
  signout: () => api.get<ApiResponse>('/api/auth/signout'),
  /** Exchange a Google ID token (GIS credential JWT) for an app JWT. */
  googleLogin: (token: string) => api.post<GoogleLoginResponse>('/api/auth/google-login', { token }),
};
