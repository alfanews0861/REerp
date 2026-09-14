import { describe, it, expect } from 'vitest';
import { projectSchema, plotSchema } from '../validators/realestateSchemas';

describe('Project Validators', () => {
  it('should fail validation on empty project', () => {
    const result = projectSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should validate a correct project', () => {
    const validProject = {
      id: 'proj-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-1',
      updatedBy: 'user-1',
      isActive: true,
      isDeleted: false,
      version: 1,
      name: 'Test Project',
      code: 'TP-01',
      projectType: 'RESIDENTIAL',
      status: 'PLANNING',
      location: {
        country: 'India',
        state: 'Andhra Pradesh',
        district: 'Nellore',
        mandal: 'Nellore Rural',
        village: 'Podalakur Road',
        surveyNumbers: ['123', '456']
      },
      members: {
        companyId: 'comp-1',
        branchId: 'branch-1',
        marketingTeamIds: [],
        salesTeamIds: [],
        legalTeamIds: [],
        financeTeamIds: []
      },
      pricing: {
        basePrice: 5000,
        currentPrice: 5500
      },
      amenities: {
        hasRoads: true,
        hasElectricity: true,
        hasWater: true,
        hasDrainage: false,
        hasParks: true,
        hasCompoundWall: true,
        hasStreetLights: true,
        hasClubHouse: false,
        hasTemple: false
      },
      media: {
        photos: [],
        videos: [],
        droneImages: [],
        images360: []
      },
      totalArea: 10,
      areaUnit: 'ACRES',
      totalLayoutsCount: 1,
      totalBlocksCount: 5,
      totalPlotsCount: 100
    };

    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should validate a correct plot', () => {
    const validPlot = {
      id: 'plot-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-1',
      updatedBy: 'user-1',
      isActive: true,
      isDeleted: false,
      version: 1,
      projectId: 'proj-1',
      layoutId: 'lay-1',
      blockId: 'blk-1',
      plotNumber: 'P-101',
      facing: 'EAST',
      length: 60,
      width: 40,
      area: 2400,
      areaUnit: 'SQ_FT',
      isCornerPlot: false,
      roadWidth: 30,
      price: 12000000,
      status: 'AVAILABLE',
      isAvailable: true
    };
    
    const result = plotSchema.safeParse(validPlot);
    expect(result.success).toBe(true);
  });
});
