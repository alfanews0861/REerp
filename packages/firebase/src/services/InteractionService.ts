import { InteractionModel } from '../models/interaction';
import { InteractionRepository } from '../repositories/InteractionRepository';

export class InteractionService {
  private repository: InteractionRepository;

  constructor() {
    this.repository = new InteractionRepository();
  }

  /**
   * Records a new interaction, associating it with a person.
   * Ensures timeline engine immutability and logs the action.
   */
  public async recordInteraction(data: Omit<InteractionModel, 'id' | 'isArchived' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isActive' | 'isDeleted' | 'version'>, performedByUserId: string): Promise<InteractionModel> {
    if (!data.personId) {
      throw new Error('Every interaction must belong to one Person.');
    }

    const interactionData: Omit<InteractionModel, 'id'> = {
      ...data,
      isArchived: false,
    } as unknown as Omit<InteractionModel, 'id'>;

    const created = await this.repository.create(interactionData, performedByUserId);

    return created;
  }

  /**
   * Archives an interaction instead of deleting it, maintaining immutability.
   */
  public async archiveInteraction(id: string, performedByUserId: string): Promise<void> {
    // Interactions cannot be deleted, only archived.
    // We update our custom isArchived flag, and also leverage soft delete
    await this.repository.update(id, { isArchived: true }, performedByUserId);
    await this.repository.softDelete(id, performedByUserId);
  }

  /**
   * Deletion is intentionally not supported to maintain an immutable timeline.
   */
  public async deleteInteraction(_id: string): Promise<void> {
    throw new Error('Interactions cannot be deleted. Use archiveInteraction instead.');
  }

  /**
   * Fetches the complete interaction timeline for a specific person.
   */
  public async getTimelineForPerson(personId: string, options?: { maxResults?: number }): Promise<InteractionModel[]> {
    const interactions = await this.repository.findByPersonId(personId, options);
    return interactions;
  }

  /**
   * Retrieves an activity feed across all interactions in the system.
   */
  public async getActivityFeed(limitCount: number = 50): Promise<InteractionModel[]> {
    return this.repository.getActivityFeed(limitCount);
  }
}

export const interactionService = new InteractionService();
