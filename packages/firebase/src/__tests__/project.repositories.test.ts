import { describe, it, expect } from 'vitest';
import { ProjectRepository, PlotRepository } from '../realestate/repositories';

describe('Project Repositories', () => {
  it('should instantiate ProjectRepository', () => {
    const repo = new ProjectRepository();
    expect(repo).toBeDefined();
  });

  it('should instantiate PlotRepository and have bulk methods', () => {
    const repo = new PlotRepository();
    expect(repo).toBeDefined();
    expect(repo.bulkImport).toBeTypeOf('function');
    expect(repo.bulkUpdate).toBeTypeOf('function');
  });
});
