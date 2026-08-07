import { BlockModel } from '../../models';
import { BlockRepository } from '../repositories/BlockRepository';
import { CreateModelInput, UpdateModelInput } from '../../models/base';
import { blockSchema } from '../../validators/realestateSchemas';

export class BlockService {
  private repository: BlockRepository;

  constructor() {
    this.repository = new BlockRepository();
  }

  public async getBlock(id: string): Promise<BlockModel | null> {
    return this.repository.findById(id);
  }

  public async createBlock(data: CreateModelInput<BlockModel>, userId: string): Promise<BlockModel> {
    blockSchema.parse(data);
    return this.repository.create(data, userId);
  }

  public async updateBlock(id: string, data: UpdateModelInput<BlockModel>, userId: string): Promise<BlockModel> {
    const existing = await this.repository.findById(id);
    if (existing) {
      blockSchema.parse({ ...existing, ...data });
    }
    return this.repository.update(id, data, userId);
  }
}
