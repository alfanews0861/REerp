import { useSessionContext } from '@real-estate-erp/firebase';

export function useSession() {
  const {
    activeSession,
    activeSessions,
    isLoadingSession,
    terminateSession,
    refreshSessions,
  } = useSessionContext();

  return {
    activeSession,
    activeSessions,
    isLoadingSession,
    terminateSession,
    refreshSessions,
  };
}
