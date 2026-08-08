import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteVisitService } from '../services/SiteVisitService';
import * as functions from '../functions';
import { LocationData, VisitFeedback, VisitOutcome } from '@real-estate-erp/types';

vi.mock('../repositories/concreteRepositories', () => {
  return {
    SiteVisitRepository: vi.fn().mockImplementation(() => ({
      create: vi.fn().mockResolvedValue({ id: 'visit-1', personId: 'p-1', assignedExecutiveId: 'e-1', leadOwnerId: 'l-1' }),
      findById: vi.fn().mockResolvedValue({ id: 'visit-1', personId: 'p-1', assignedExecutiveId: 'e-1', leadOwnerId: 'l-1', checkInTime: new Date().toISOString() }),
      update: vi.fn().mockImplementation((id, data) => Promise.resolve({ id, ...data, personId: 'p-1', assignedExecutiveId: 'e-1', leadOwnerId: 'l-1' })),
    })),
  };
});

vi.mock('../services/InteractionService', () => {
  return {
    InteractionService: vi.fn().mockImplementation(() => ({
      recordInteraction: vi.fn().mockResolvedValue(true),
    })),
    interactionService: {
      recordInteraction: vi.fn().mockResolvedValue(true),
    },
  };
});

vi.mock('../functions', () => ({
  callCloudFunction: vi.fn().mockResolvedValue({}),
}));

describe('SiteVisitService', () => {
  let service: SiteVisitService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SiteVisitService();
  });

  it('should create visit and dispatch EVENT', async () => {
    const input = {
      personId: 'p-1',
      assignedExecutiveId: 'e-1',
      scheduledDate: new Date().toISOString(),
      scheduledStartTime: new Date().toISOString(),
      visitStatus: 'SCHEDULED' as any,
      visitMode: 'DIRECT_TO_SITE' as any,
      expectedVisitors: 1,
      companyId: 'c-1',
      branchId: 'b-1',
      projectId: 'proj-1',
      leadOwnerId: 'l-1',
      visitLocationType: 'SITE' as any,
      siteLocation: { latitude: 0, longitude: 0 } as any,
      isRevisit: false,
      visitSource: 'WALK_IN' as any
    };
    
    const res = await service.createVisit(input, 'user-1');
    expect(res).toBeDefined();
    
    expect(functions.callCloudFunction).toHaveBeenCalledWith('publishEvent', expect.objectContaining({
      eventType: 'SITE_VISIT_CREATED',
      aggregateId: 'visit-1'
    }));
  });

  it('should start visit, update repo, and dispatch EVENT', async () => {
    const loc: LocationData = { latitude: 10, longitude: 20 };
    const res = await service.startVisit('visit-1', loc, 'user-1');
    
    expect(res.visitStatus).toBe('IN_PROGRESS');
    expect(functions.callCloudFunction).toHaveBeenCalledWith('publishEvent', expect.objectContaining({
      eventType: 'SITE_VISIT_STARTED',
      aggregateId: 'visit-1'
    }));
  });

  it('should mark arrival and dispatch EVENT', async () => {
    const loc: LocationData = { latitude: 10, longitude: 20 };
    const res = await service.markSiteArrival('visit-1', loc, 'user-1');
    
    expect(res.arrivalTime).toBeDefined();
    expect(functions.callCloudFunction).toHaveBeenCalledWith('publishEvent', expect.objectContaining({
      eventType: 'SITE_ARRIVED',
      aggregateId: 'visit-1'
    }));
  });

  it('should complete visit and dispatch EVENT', async () => {
    const loc: LocationData = { latitude: 10, longitude: 20 };
    const feedback: VisitFeedback = {
      customerRating: 4,
      notes: 'Good'
    };
    const outcome: VisitOutcome = 'HOT';
    
    const res = await service.completeVisit('visit-1', loc, feedback, outcome, 'user-1');
    
    expect(res.visitStatus).toBe('COMPLETED');
    expect(res.outcome).toBe('HOT');
    expect(functions.callCloudFunction).toHaveBeenCalledWith('publishEvent', expect.objectContaining({
      eventType: 'SITE_VISIT_COMPLETED',
      aggregateId: 'visit-1'
    }));
  });

  it('should mark no show and dispatch EVENT', async () => {
    const res = await service.markNoShow('visit-1', 'user-1');
    
    expect(res.visitStatus).toBe('CUSTOMER_NO_SHOW');
    expect(functions.callCloudFunction).toHaveBeenCalledWith('publishEvent', expect.objectContaining({
      eventType: 'SITE_VISIT_NO_SHOW',
      aggregateId: 'visit-1'
    }));
  });
});
