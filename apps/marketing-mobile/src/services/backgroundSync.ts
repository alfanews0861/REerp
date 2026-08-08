import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_SYNC_TASK = 'background-sync-task';

export interface OfflineMutation {
  id: string;
  type: 'VISIT_START' | 'VISIT_ARRIVAL' | 'VISIT_COMPLETE';
  payload: any;
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
  
  // Idempotency / deduplication logic: 
  // If a mutation for the same visitId and type already exists, don't duplicate.
  const isDuplicate = queue.some(m => m.type === newMutation.type && m.payload.visitId === newMutation.payload.visitId);
  if (!isDuplicate) {
    queue.push(newMutation);
    await AsyncStorage.setItem('offline_mutations', JSON.stringify(queue));
  }
}

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
        
        // Sync each mutation
        for (const mutation of mutations) {
          // Since we are mocking the API call in this implementation for now,
          // In a real app we'd call the respective API endpoints based on mutation.type
          console.log('Syncing mutation:', mutation);
          // e.g. await fetch(...)
        }
        
        // On success, clear the queue
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

export async function registerBackgroundSync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
