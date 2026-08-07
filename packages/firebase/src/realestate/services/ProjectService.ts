import { ProjectModel } from '../../models';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { CreateModelInput, UpdateModelInput } from '../../models/base';
import { projectSchema } from '../../validators/realestateSchemas';

export class ProjectService {
  private repository: ProjectRepository;

  constructor() {
    this.repository = new ProjectRepository();
  }

  public async getProject(id: string): Promise<ProjectModel | null> {
    return this.repository.findById(id);
  }

  public async createProject(data: CreateModelInput<ProjectModel>, userId: string): Promise<ProjectModel> {
    projectSchema.parse(data);
    return this.repository.create(data, userId);
  }

  public async updateProject(id: string, data: UpdateModelInput<ProjectModel>, userId: string): Promise<ProjectModel> {
    const existing = await this.repository.findById(id);
    if (existing) {
      projectSchema.parse({ ...existing, ...data });
    }
    return this.repository.update(id, data, userId);
  }
}
