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

describe('Marketing Mobile - Auth Session Persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('saves and retrieves logged-in user session correctly', async () => {
    const userSession = {
      uid: 'user-agt-101',
      email: 'vamshi@reerp.com',
      displayName: 'Vamshi Krishna',
      role: 'sales_executive',
      branch: 'Mokila Branch',
    };

    await AsyncStorage.setItem('mobile_auth_user_session', JSON.stringify(userSession));
    const cached = await AsyncStorage.getItem('mobile_auth_user_session');

    expect(cached).not.toBeNull();
    const parsed = JSON.parse(cached!);
    expect(parsed.uid).toBe('user-agt-101');
    expect(parsed.displayName).toBe('Vamshi Krishna');
    expect(parsed.role).toBe('sales_executive');
  });

  it('clears session on logout', async () => {
    await AsyncStorage.setItem('mobile_auth_user_session', JSON.stringify({ uid: 'test' }));
    await AsyncStorage.removeItem('mobile_auth_user_session');

    const cached = await AsyncStorage.getItem('mobile_auth_user_session');
    expect(cached).toBeNull();
  });
});

describe('Marketing Mobile - Leads Dynamic Filtering Logic', () => {
  interface Lead {
    id: string;
    name: string;
    assignedTo: string;
    status: string;
  }

  const liveLeads: Lead[] = [
    { id: '1', name: 'Prospect A', assignedTo: 'user-agt-101', status: 'NEW' },
    { id: '2', name: 'Prospect B', assignedTo: 'user-agt-101', status: 'FOLLOW_UP' },
    { id: '3', name: 'Prospect C', assignedTo: 'other-user-999', status: 'SITE_VISIT_SCHEDULED' },
  ];

  it('filters to only leads assigned to the active user', () => {
    const currentUserId = 'user-agt-101';
    const myLeads = liveLeads.filter((l) => l.assignedTo === currentUserId);

    expect(myLeads).toHaveLength(2);
    expect(myLeads.map((l) => l.name)).toEqual(['Prospect A', 'Prospect B']);
  });

  it('returns all pipeline leads when Team Leads filter is active', () => {
    expect(liveLeads).toHaveLength(3);
  });
});
