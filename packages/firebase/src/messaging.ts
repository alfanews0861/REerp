import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { getFirebaseInstance } from './config';

export async function requestFCMToken(vapidKey: string): Promise<string | null> {
  const { messaging } = getFirebaseInstance();
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('FCM Notification permission not granted');
      return null;
    }
    return await getToken(messaging, { vapidKey });
  } catch (error) {
    console.error('Failed to register FCM push token:', error);
    return null;
  }
}

export function subscribeToFCMNotifications(callback: (payload: MessagePayload) => void): (() => void) | null {
  const { messaging } = getFirebaseInstance();
  if (!messaging) return null;
  return onMessage(messaging, callback);
}
