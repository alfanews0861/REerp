import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_SYNC_TASK = 'background-sync-task';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Example: fetch queued offline mutations from AsyncStorage
    const offlineQueue = await AsyncStorage.getItem('offline_mutations');
    if (offlineQueue) {
      const mutations = JSON.parse(offlineQueue);
      if (mutations.length > 0) {
        // Implement logic to sync each mutation to the backend
        // e.g., syncing expenses, visit completions
        
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
