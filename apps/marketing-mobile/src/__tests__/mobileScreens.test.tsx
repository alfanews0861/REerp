import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory mock for AsyncStorage
const store: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => store[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn(async (key: string) => {
      delete store[key];
    }),
    clear: vi.fn(async () => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
  },
}));

vi.mock('expo-task-manager', () => ({
  defineTask: vi.fn(),
}));

vi.mock('expo-background-fetch', () => ({
  registerTaskAsync: vi.fn(),
  BackgroundFetchResult: {
    NewData: 1,
    NoData: 2,
    Failed: 3,
  },
}));

vi.mock('@react-native-community/netinfo', () => ({
  default: {
    fetch: vi.fn().mockResolvedValue({ isConnected: false }),
  },
}));

import { queueOfflineMutation } from '../services/backgroundSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Marketing Mobile - Offline Mutation Queue', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('queues a new offline mutation when offline', async () => {
    await queueOfflineMutation({
      type: 'VISIT_START',
      payload: { visitId: 'visit-101', location: { latitude: 17.385, longitude: 78.486 } },
    });

    const stored = await AsyncStorage.getItem('offline_mutations');
    expect(stored).not.toBeNull();
    const queue = JSON.parse(stored!);
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('VISIT_START');
    expect(queue[0].payload.visitId).toBe('visit-101');
  });

  it('deduplicates identical mutations for the same visitId and type', async () => {
    await queueOfflineMutation({
      type: 'VISIT_START',
      payload: { visitId: 'visit-101', location: { latitude: 17.385, longitude: 78.486 } },
    });

    // Attempting to push the same mutation again
    await queueOfflineMutation({
      type: 'VISIT_START',
      payload: { visitId: 'visit-101', location: { latitude: 17.385, longitude: 78.486 } },
    });

    const stored = await AsyncStorage.getItem('offline_mutations');
    const queue = JSON.parse(stored!);
    expect(queue).toHaveLength(1);
  });

  it('queues different mutation types for the same visitId separately', async () => {
    await queueOfflineMutation({
      type: 'VISIT_START',
      payload: { visitId: 'visit-101' },
    });

    await queueOfflineMutation({
      type: 'VISIT_ARRIVAL',
      payload: { visitId: 'visit-101' },
    });

    await queueOfflineMutation({
      type: 'VISIT_COMPLETE',
      payload: { visitId: 'visit-101', outcome: 'HOT' },
    });

    const stored = await AsyncStorage.getItem('offline_mutations');
    const queue = JSON.parse(stored!);
    expect(queue).toHaveLength(3);
    expect(queue.map((m: { type: string }) => m.type)).toEqual([
      'VISIT_START',
      'VISIT_ARRIVAL',
      'VISIT_COMPLETE',
    ]);
  });
});

describe('Marketing Mobile - Leads Filtering Logic', () => {
  interface Lead {
    id: string;
    name: string;
    isAssignedToMe: boolean;
  }

  const mockLeads: Lead[] = [
    { id: '1', name: 'John Doe', isAssignedToMe: true },
    { id: '2', name: 'Jane Smith', isAssignedToMe: true },
    { id: '3', name: 'Robert King', isAssignedToMe: false },
  ];

  const getFilter = (f: 'MY_LEADS' | 'ALL'): 'MY_LEADS' | 'ALL' => f;

  it('filters to only assigned leads when filter is MY_LEADS', () => {
    const filter = getFilter('MY_LEADS');
    const displayed = filter === 'MY_LEADS' 
      ? mockLeads.filter(l => l.isAssignedToMe) 
      : mockLeads;

    expect(displayed).toHaveLength(2);
    expect(displayed.map(l => l.name)).toEqual(['John Doe', 'Jane Smith']);
  });

  it('shows all leads when filter is ALL', () => {
    const filter = getFilter('ALL');
    const displayed = filter === 'MY_LEADS' 
      ? mockLeads.filter(l => l.isAssignedToMe) 
      : mockLeads;

    expect(displayed).toHaveLength(3);
  });
});
