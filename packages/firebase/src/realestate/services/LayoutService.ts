import { LayoutModel } from '../../models';
import { LayoutRepository } from '../repositories/LayoutRepository';
import { CreateModelInput, UpdateModelInput } from '../../models/base';
import { layoutSchema } from '../../validators/realestateSchemas';

export class LayoutService {
  private repository: LayoutRepository;

  constructor() {
    this.repository = new LayoutRepository();
  }

  public async getLayout(id: string): Promise<LayoutModel | null> {
    return this.repository.findById(id);
  }

  public async createLayout(data: CreateModelInput<LayoutModel>, userId: string): Promise<LayoutModel> {
    layoutSchema.parse(data);
    return this.repository.create(data, userId);
  }

  public async updateLayout(id: string, data: UpdateModelInput<LayoutModel>, userId: string): Promise<LayoutModel> {
    const existing = await this.repository.findById(id);
    if (existing) {
      layoutSchema.parse({ ...existing, ...data });
    }
    return this.repository.update(id, data, userId);
  }
}
