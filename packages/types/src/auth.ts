import { UserProfile } from './user';
import { CustomClaims, UserSession } from './permissions';

export interface AuthState {
  user: UserProfile | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  customClaims: CustomClaims | null;
  error: string | null;
  isRemembered: boolean;
}

export interface AuthSession {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  customClaims: CustomClaims;
  session?: UserSession;
}
