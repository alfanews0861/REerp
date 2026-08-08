import { SiteVisitModel } from '../models';
import { SiteVisitRepository } from '../repositories/concreteRepositories';
import { InteractionService, interactionService } from './InteractionService';
import { CreateModelInput, UpdateModelInput } from '../models/base';
import { LocationData, VisitFeedback, VisitOutcome } from '@real-estate-erp/types';
import { callCloudFunction } from '../functions';
import { AggregateType, SiteVisitCreatedEvent, SiteVisitStartedEvent, SiteArrivedEvent, SiteVisitCompletedEvent, SiteVisitNoShowEvent } from '@real-estate-erp/events';

export class SiteVisitService {
  private repository: SiteVisitRepository;
  private interactionSvc: InteractionService;

  constructor() {
    this.repository = new SiteVisitRepository();
    this.interactionSvc = interactionService;
  }

  private async dispatchEvent(
    aggregateId: string, 
    eventType: string, 
    payload: any
  ): Promise<void> {
    try {
      await callCloudFunction('publishEvent', {
        aggregateId,
        aggregateType: AggregateType.SiteVisit,
        eventType,
        payload
      });
    } catch (err) {
      console.error(`Failed to dispatch event ${eventType} for SiteVisit ${aggregateId}:`, err);
    }
  }

  public async createVisit(input: CreateModelInput<SiteVisitModel>, userId: string): Promise<SiteVisitModel> {
    const visit = await this.repository.create({
      ...input,
      visitStatus: 'SCHEDULED',
    }, userId);

    // Record interaction for scheduling
    if (visit.personId) {
      await this.interactionSvc.recordInteraction({
        personId: visit.personId,
        type: 'SITE_VISIT',
        date: new Date().toISOString(),
        status: 'SCHEDULED',
        priority: 'MEDIUM',
        notes: `Site visit scheduled for ${visit.scheduledDate}`,
        employeeId: visit.assignedExecutiveId,
      }, userId);
    }

    await this.dispatchEvent(visit.id, 'SITE_VISIT_CREATED', {
      eventName: 'SITE_VISIT_CREATED',
      visitId: visit.id,
      leadId: visit.leadOwnerId,
      assignedExecutiveId: visit.assignedExecutiveId,
    } as SiteVisitCreatedEvent);

    return visit;
  }

  public async startVisit(visitId: string, checkInLocation: LocationData, userId: string): Promise<SiteVisitModel> {
    const visit = await this.repository.findById(visitId);
    if (!visit) throw new Error('Visit not found');

    const update: UpdateModelInput<SiteVisitModel> = {
      visitStatus: 'IN_PROGRESS',
      checkInTime: new Date().toISOString(),
      checkInLocation,
    };

    const updated = await this.repository.update(visitId, update, userId);

    if (visit.personId) {
      await this.interactionSvc.recordInteraction({
        personId: visit.personId,
        type: 'SITE_VISIT',
        date: new Date().toISOString(),
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        notes: `Site visit started`,
        employeeId: visit.assignedExecutiveId,
      }, userId);
    }

    await this.dispatchEvent(visitId, 'SITE_VISIT_STARTED', {
      eventName: 'SITE_VISIT_STARTED',
      visitId,
      leadId: visit.leadOwnerId,
      assignedExecutiveId: visit.assignedExecutiveId,
      checkInTime: update.checkInTime!,
    } as SiteVisitStartedEvent);

    return updated;
  }

  public async markSiteArrival(visitId: string, arrivalLocation: LocationData, userId: string): Promise<SiteVisitModel> {
    const update: UpdateModelInput<SiteVisitModel> = {
      arrivalTime: new Date().toISOString(),
      arrivalLocation,
    };
    const updated = await this.repository.update(visitId, update, userId);
    const visit = await this.repository.findById(visitId);

    if (visit) {
      await this.dispatchEvent(visitId, 'SITE_ARRIVED', {
        eventName: 'SITE_ARRIVED',
        visitId,
        leadId: visit.leadOwnerId,
        arrivalTime: update.arrivalTime!,
      } as SiteArrivedEvent);
    }

    return updated;
  }

  public async completeVisit(
    visitId: string, 
    completionLocation: LocationData, 
    feedback: VisitFeedback, 
    outcome: VisitOutcome, 
    userId: string
  ): Promise<SiteVisitModel> {
    const visit = await this.repository.findById(visitId);
    if (!visit) throw new Error('Visit not found');

    const checkInTime = visit.checkInTime ? new Date(visit.checkInTime).getTime() : Date.now();
    const durationMinutes = Math.round((Date.now() - checkInTime) / 60000);

    const update: UpdateModelInput<SiteVisitModel> = {
      visitStatus: 'COMPLETED',
      completionTime: new Date().toISOString(),
      completionLocation,
      visitDurationMinutes: durationMinutes,
      feedback,
      outcome,
    };

    const updated = await this.repository.update(visitId, update, userId);

    if (visit.personId) {
      await this.interactionSvc.recordInteraction({
        personId: visit.personId,
        type: 'SITE_VISIT',
        date: new Date().toISOString(),
        status: 'COMPLETED',
        priority: 'MEDIUM',
        outcome: outcome === 'BOOKED' || outcome === 'HOT' ? 'SUCCESS' : 'NEUTRAL',
        notes: `Site visit completed. Outcome: ${outcome}. Notes: ${feedback.notes}`,
        employeeId: visit.assignedExecutiveId,
      }, userId);
    }

    await this.dispatchEvent(visitId, 'SITE_VISIT_COMPLETED', {
      eventName: 'SITE_VISIT_COMPLETED',
      visitId,
      leadId: visit.leadOwnerId,
      assignedExecutiveId: visit.assignedExecutiveId,
      outcome,
    } as SiteVisitCompletedEvent);

    return updated;
  }

  public async markNoShow(visitId: string, userId: string): Promise<SiteVisitModel> {
    const visit = await this.repository.findById(visitId);
    if (!visit) throw new Error('Visit not found');

    const update: UpdateModelInput<SiteVisitModel> = {
      visitStatus: 'CUSTOMER_NO_SHOW',
    };

    const updated = await this.repository.update(visitId, update, userId);

    if (visit.personId) {
      await this.interactionSvc.recordInteraction({
        personId: visit.personId,
        type: 'SITE_VISIT',
        date: new Date().toISOString(),
        status: 'NO_SHOW',
        priority: 'MEDIUM',
        outcome: 'FAILURE',
        notes: `Customer did not show up for the site visit.`,
        employeeId: visit.assignedExecutiveId,
      }, userId);
    }

    await this.dispatchEvent(visitId, 'SITE_VISIT_NO_SHOW', {
      eventName: 'SITE_VISIT_NO_SHOW',
      visitId,
      leadId: visit.leadOwnerId,
    } as SiteVisitNoShowEvent);

    return updated;
  }
}

export const siteVisitService = new SiteVisitService();
