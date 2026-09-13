import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseInstance, collection, addDoc, doc, updateDoc } from '@real-estate-erp/firebase';

const BACKGROUND_SYNC_TASK = 'background-sync-task';

export interface OfflineMutation {
  id: string;
  type:
    | 'VISIT_START'
    | 'VISIT_ARRIVAL'
    | 'VISIT_COMPLETE'
    | 'ADD_EXPENSE'
    | 'PUNCH_IN'
    | 'PUNCH_OUT'
    | 'TRIP_START'
    | 'TRIP_END';
  payload: Record<string, any>;
  timestamp: string;
}

export async function queueOfflineMutation(mutation: Omit<OfflineMutation, 'id' | 'timestamp'>) {
  const newMutation: OfflineMutation = {
    ...mutation,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };

  const queueStr = await AsyncStorage.getItem('offline_mutations');
  const queue: OfflineMutation[] = queueStr ? JSON.parse(queueStr) : [];
  
  // Idempotency / deduplication logic
  const targetId = newMutation.payload?.visitId || newMutation.payload?.id || newMutation.payload?.tripId;
  const isDuplicate = queue.some((m) => {
    if (m.type !== newMutation.type) return false;
    const mId = m.payload?.visitId || m.payload?.id || m.payload?.tripId;
    return Boolean(targetId && mId && targetId === mId);
  });
  if (!isDuplicate) {
    queue.push(newMutation);
    await AsyncStorage.setItem('offline_mutations', JSON.stringify(queue));
  }
}

async function syncSingleMutation(mutation: OfflineMutation): Promise<void> {
  let db: any = null;
  try {
    const instance = getFirebaseInstance();
    db = instance?.db;
  } catch {
    return;
  }
  if (!db) return;

  switch (mutation.type) {
    case 'VISIT_START':
    case 'VISIT_ARRIVAL':
    case 'VISIT_COMPLETE': {
      const visitId = mutation.payload.visitId || mutation.payload.id;
      if (visitId) {
        await updateDoc(doc(db, 'site_visits', visitId), {
          ...mutation.payload,
          updatedAt: new Date().toISOString(),
        });
      }
      break;
    }

    case 'ADD_EXPENSE': {
      await addDoc(collection(db, 'expenses'), {
        ...mutation.payload,
        createdAt: new Date().toISOString(),
      });
      break;
    }

    case 'PUNCH_IN': {
      await addDoc(collection(db, 'attendance'), {
        ...mutation.payload,
        createdAt: new Date().toISOString(),
      });
      break;
    }

    case 'PUNCH_OUT': {
      const attId = mutation.payload.attendanceId || mutation.payload.id;
      if (attId) {
        await updateDoc(doc(db, 'attendance', attId), {
          punchOutTime: mutation.payload.punchOutTime || new Date().toISOString(),
          totalHoursWorked: mutation.payload.totalHoursWorked || 8,
          status: 'COMPLETED',
          updatedAt: new Date().toISOString(),
        });
      }
      break;
    }

    case 'TRIP_START': {
      await addDoc(collection(db, 'vehicle_trips'), {
        ...mutation.payload,
        createdAt: new Date().toISOString(),
      });
      if (mutation.payload.vehicleId) {
        await updateDoc(doc(db, 'vehicles', mutation.payload.vehicleId), {
          status: 'IN_TRANSIT',
          updatedAt: new Date().toISOString(),
        });
      }
      break;
    }

    case 'TRIP_END': {
      const tripId = mutation.payload.tripId || mutation.payload.id;
      if (tripId) {
        await updateDoc(doc(db, 'vehicle_trips', tripId), {
          ...mutation.payload,
          status: 'COMPLETED',
          updatedAt: new Date().toISOString(),
        });
      }
      if (mutation.payload.vehicleId && mutation.payload.endOdometerKm) {
        await updateDoc(doc(db, 'vehicles', mutation.payload.vehicleId), {
          currentOdometerKm: mutation.payload.endOdometerKm,
          status: 'AVAILABLE',
          updatedAt: new Date().toISOString(),
        });
      }
      break;
    }
  }
}

try {
  TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }

      const offlineQueue = await AsyncStorage.getItem('offline_mutations');
      if (offlineQueue) {
        const mutations: OfflineMutation[] = JSON.parse(offlineQueue);
        if (mutations.length > 0) {
          for (const mutation of mutations) {
            try {
              await syncSingleMutation(mutation);
            } catch (mErr) {
              console.warn('Failed to sync individual mutation:', mErr);
            }
          }
          
          // On completion, clear the queue
          await AsyncStorage.removeItem('offline_mutations');
          return BackgroundFetch.BackgroundFetchResult.NewData;
        }
      }
      
      return BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
      console.error('Background sync failed:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
} catch (e) {
  console.warn('TaskManager.defineTask skipped or not supported:', e);
}

export async function registerBackgroundSync() {
  try {
    return await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.warn('registerBackgroundSync notice:', err);
  }
}
