import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseInstance } from '../config';
import { UserSession } from '@real-estate-erp/types';
import { getDeviceId, getDeviceInfo } from './deviceValidation';

const SESSION_DURATION_HOURS = 24;

export class SessionManager {
  public static async createSession(uid: string): Promise<UserSession> {
    const { db } = getFirebaseInstance();
    const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const deviceId = getDeviceId();
    const info = getDeviceInfo();

    const now = new Date();
    const expires = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

    const sessionData: UserSession = {
      sessionId,
      uid,
      deviceId,
      deviceInfo: {
        browser: info.userAgent.includes('Chrome')
          ? 'Chrome'
          : info.userAgent.includes('Firefox')
          ? 'Firefox'
          : 'Browser',
        os: info.userAgent.includes('Win') ? 'Windows' : 'OS',
        platform: navigator.platform,
        userAgent: info.userAgent,
      },
      createdAt: now.toISOString(),
      lastActiveAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      isActive: true,
    };

    const sessionRef = doc(db, 'users', uid, 'sessions', sessionId);
    await setDoc(sessionRef, {
      ...sessionData,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });

    localStorage.setItem('erp_active_session_id', sessionId);
    return sessionData;
  }

  public static async updateHeartbeat(uid: string, sessionId: string): Promise<void> {
    const { db } = getFirebaseInstance();
    const sessionRef = doc(db, 'users', uid, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      lastActiveAt: serverTimestamp(),
    });
  }

  public static async terminateSession(uid: string, sessionId: string): Promise<void> {
    const { db } = getFirebaseInstance();
    const sessionRef = doc(db, 'users', uid, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      isActive: false,
    });
    if (localStorage.getItem('erp_active_session_id') === sessionId) {
      localStorage.removeItem('erp_active_session_id');
    }
  }

  public static async getActiveSessions(uid: string): Promise<UserSession[]> {
    const { db } = getFirebaseInstance();
    const q = query(
      collection(db, 'users', uid, 'sessions'),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => docSnap.data() as UserSession);
  }

  public static async restoreSession(uid: string): Promise<UserSession | null> {
    const sessionId = localStorage.getItem('erp_active_session_id');
    if (!sessionId) return null;

    const { db } = getFirebaseInstance();
    const sessionRef = doc(db, 'users', uid, 'sessions', sessionId);
    const snap = await getDoc(sessionRef);

    if (!snap.exists()) return null;

    const data = snap.data() as UserSession;
    if (!data.isActive || new Date(data.expiresAt) < new Date()) {
      await this.terminateSession(uid, sessionId);
      return null;
    }

    await this.updateHeartbeat(uid, sessionId);
    return data;
  }
}
