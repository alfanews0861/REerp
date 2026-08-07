import { useAuthContext } from '@real-estate-erp/firebase';

export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    role: user?.role || null,
    tenantId: user?.tenantId || null,
    email: user?.email || '',
    displayName: user?.displayName || '',
  };
}
