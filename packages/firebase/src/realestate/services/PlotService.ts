import { PlotModel } from '../../models';
import { PlotRepository } from '../repositories/PlotRepository';
import { CreateModelInput, UpdateModelInput } from '../../models/base';
import { plotSchema } from '../../validators/realestateSchemas';
import { AuditLogRepository } from '../../repositories/concreteRepositories';

export class PlotService {
  private repository: PlotRepository;

  constructor() {
    this.repository = new PlotRepository();
  }

  public async getPlot(id: string): Promise<PlotModel | null> {
    return this.repository.findById(id);
  }

  public async createPlot(data: CreateModelInput<PlotModel>, userId: string): Promise<PlotModel> {
    plotSchema.parse(data);
    return this.repository.create(data, userId);
  }

  public async updatePlot(id: string, data: UpdateModelInput<PlotModel>, userId: string): Promise<PlotModel> {
    const existing = await this.repository.findById(id);
    if (existing) {
      plotSchema.parse({ ...existing, ...data });
    }
    return this.repository.update(id, data, userId);
  }

  public async bulkImportPlots(plots: Omit<PlotModel, 'id' | 'createdAt' | 'updatedAt' | 'version'>[], userId: string): Promise<void> {
    // Validate all before proceeding
    plots.forEach(plot => {
      plotSchema.parse({
        ...plot,
        id: 'temp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      });
    });
    return this.repository.bulkImport(plots, userId);
  }

  public async bulkUpdatePlotPrices(updates: { id: string; price: number }[], userId: string): Promise<void> {
    const updatePayloads = updates.map(u => ({ id: u.id, data: { price: u.price } }));
    await this.repository.bulkUpdate(updatePayloads, userId);
    
    // Create audit logs for the price updates
    const auditRepo = new AuditLogRepository();
    
    for (const update of updates) {
      await auditRepo.create({
        action: 'update',
        entityType: 'Plot',
        entityId: update.id,
        userId: userId,
        newState: { price: update.price },
        ipAddress: '',
        userAgent: ''
      }, userId);
    }
  }
}
