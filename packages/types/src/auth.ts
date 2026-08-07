import { UserProfile } from './user';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

export interface AuthSession {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  customClaims: Record<string, unknown>;
}
