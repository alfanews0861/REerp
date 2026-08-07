import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { UserSession } from '@real-estate-erp/types';
import { SessionManager } from '../session/sessionManager';
import { useAuthContext } from './AuthContext';

export interface SessionContextType {
  activeSession: UserSession | null;
  activeSessions: UserSession[];
  isLoadingSession: boolean;
  terminateSession: (sessionId: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);

  const refreshSessions = useCallback(async () => {
    if (!user) {
      setActiveSession(null);
      setActiveSessions([]);
      setIsLoadingSession(false);
      return;
    }

    try {
      let currentSession = await SessionManager.restoreSession(user.uid);
      if (!currentSession) {
        currentSession = await SessionManager.createSession(user.uid);
      }
      setActiveSession(currentSession);

      const allActive = await SessionManager.getActiveSessions(user.uid);
      setActiveSessions(allActive);
    } catch {
      setActiveSession(null);
    } finally {
      setIsLoadingSession(false);
    }
  }, [user]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  // Heartbeat every 5 minutes
  useEffect(() => {
    if (!user || !activeSession) return;

    const interval = setInterval(() => {
      SessionManager.updateHeartbeat(user.uid, activeSession.sessionId);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, activeSession]);

  const handleTerminateSession = async (sessionId: string) => {
    if (!user) return;
    await SessionManager.terminateSession(user.uid, sessionId);
    await refreshSessions();
  };

  const value: SessionContextType = {
    activeSession,
    activeSessions,
    isLoadingSession,
    terminateSession: handleTerminateSession,
    refreshSessions,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
