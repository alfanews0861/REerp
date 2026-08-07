import { BaseRepository } from '../../repositories/BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { ProjectModel } from '../../models';
import { projectConverter } from '../../converters/typedConverters';

export class ProjectRepository extends BaseRepository<ProjectModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PROJECTS, 'Project', projectConverter);
  }
}
