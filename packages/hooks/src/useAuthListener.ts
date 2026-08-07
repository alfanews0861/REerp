import { useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '@real-estate-erp/firebase';
import { UserProfile } from '@real-estate-erp/types';

export interface UseAuthListenerResult {
  user: UserProfile | null;
  isLoading: boolean;
}

export function useAuthListener(): UseAuthListenerResult {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((updatedUser) => {
      setUser(updatedUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading };
}
