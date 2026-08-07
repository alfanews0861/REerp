import { LeadCaptureRequestDTO } from './dto';
import { LeadValidator } from './validators';
import { LeadMatchingService } from './LeadMatchingService';
import { CampaignAttributionService } from './CampaignAttributionService';
import { LeadFactory } from './LeadFactory';
import { LeadRepository } from '../../repositories/LeadRepository';
import { LeadModel } from '../../models/leads';
import { InteractionService } from '../InteractionService';

// Fallback to simpler Workflow executor or just skip importing if we don't have it directly.
// As per requirement, every Lead starts a Workflow.
import { WorkflowExecutor } from '../workflow/WorkflowExecutor';

export class LeadAcquisitionService {
  private leadMatchingService: LeadMatchingService;
  private campaignAttributionService: CampaignAttributionService;
  private leadRepository: LeadRepository;
  private interactionService: InteractionService;
  private workflowExecutor: WorkflowExecutor;

  constructor() {
    this.leadMatchingService = new LeadMatchingService();
    this.campaignAttributionService = new CampaignAttributionService();
    this.leadRepository = new LeadRepository();
    this.interactionService = new InteractionService();
    this.workflowExecutor = new WorkflowExecutor();
  }

  public async acquireLead(dto: LeadCaptureRequestDTO, userId: string = 'SYSTEM'): Promise<LeadModel> {
    // 1. Validation
    LeadValidator.validateCaptureRequest(dto);

    // 2. Duplicate Detection & Person Matching
    const matchResult = await this.leadMatchingService.matchOrCreatePerson(dto, userId);

    // 3. Campaign Attribution & Scoring
    const attribution = this.campaignAttributionService.calculateAttribution(dto);

    // 4. Construct Lead Model via Factory
    const leadInput = LeadFactory.createNewLead(dto, matchResult.personId, attribution);

    // 5. Create Lead
    const lead = await this.leadRepository.create(leadInput, userId);

    // 6. Create First Interaction (Timeline Event)
    await this.interactionService.recordInteraction({
      personId: matchResult.personId,
      type: 'NOTE', // Standard fallback, can be derived from source
      projectId: dto.projectId,
      date: new Date().toISOString(),
      status: 'COMPLETED',
      priority: 'MEDIUM',
      notes: `Lead acquired from ${dto.sourceCode}`,
    }, userId);

    // 7. Start Workflow
    // Example: Start a default Lead Workflow for this new Lead.
    // In a real scenario, this relies on finding a specific WorkflowDefinition.
    // We will trigger a cloud function or call the executor directly.
    try {
      await this.workflowExecutor.startWorkflow(
        'DEFAULT_LEAD_WORKFLOW', // definitionId
        lead.id,                 // entityId
        'Lead',                  // entityType
        userId,                  // userId
        {}                       // context
      );
    } catch (error) {
      console.warn('Failed to start workflow during lead acquisition:', error);
    }

    return lead;
  }
}
