import { describe, it, expect } from 'vitest';
import { ProjectService, PlotService } from '../realestate/services';

describe('Project Services', () => {
  it('should instantiate ProjectService', () => {
    const service = new ProjectService();
    expect(service).toBeDefined();
  });

  it('should instantiate PlotService and have bulk methods', () => {
    const service = new PlotService();
    expect(service).toBeDefined();
    expect(service.bulkImportPlots).toBeTypeOf('function');
    expect(service.bulkUpdatePlotPrices).toBeTypeOf('function');
  });
});
