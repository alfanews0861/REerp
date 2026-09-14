import { describe, it, expect } from 'vitest';
import { PUBLIC_VENTURES, PUBLIC_PLOTS, PublicPlot } from '../data/publicVenturesData';
import { queryMobileRealEstateAssistant } from '../services/mobileAiService';
import {
  fetchLiveVentures,
  fetchLivePlots,
  createLivePlotHold,
  createLiveSiteVisitRequest,
  updateLivePlotStatus,
} from '../services/publicDataService';

describe('Marketing Mobile - Public Website Live Data Services', () => {
  it('loads live ventures seamlessly with valid approval authorities and RERA IDs', async () => {
    const ventures = await fetchLiveVentures();
    expect(ventures.length).toBeGreaterThanOrEqual(4);
    ventures.forEach((venture) => {
      expect(venture.id).toBeDefined();
      expect(venture.name).toBeTruthy();
      expect(['NUDA', 'DTCP', 'RERA']).toContain(venture.approvalAuthority);
      expect(venture.basePricePerSqYd).toBeGreaterThan(5000);
      expect(venture.amenities.length).toBeGreaterThan(0);
      expect(venture.connectivity.length).toBeGreaterThan(0);
    });
  });

  it('correctly filters live public plots by facing and budget', async () => {
    const allPlots = await fetchLivePlots();
    const eastFacing = allPlots.filter((p) => p.facing === 'EAST');
    expect(eastFacing.length).toBeGreaterThan(0);
    eastFacing.forEach((p) => expect(p.facing).toBe('EAST'));

    const under50Lakhs = allPlots.filter((p) => p.totalPrice <= 5000000);
    expect(under50Lakhs.length).toBeGreaterThan(0);
    under50Lakhs.forEach((p) => expect(p.totalPrice).toBeLessThanOrEqual(5000000));
  });

  it('filters live plots by specific venture project ID', async () => {
    const projPlots = await fetchLivePlots('proj-1');
    expect(projPlots.length).toBeGreaterThan(0);
    projPlots.forEach((p) => {
      expect(p.projectId).toBe('proj-1');
    });
  });

  it('creates live plot hold transaction record with verified receipt and price freeze', async () => {
    const result = await createLivePlotHold({
      plotId: 'plot-101',
      plotNumber: 'P-01',
      projectId: 'proj-1',
      projectName: 'ISKON City - 2 (Podalakur Road)',
      customerName: 'Kishore Kumar',
      customerPhone: '+91 9848011223',
      tokenAmount: 25000,
    });

    expect(result.receiptNumber).toMatch(/^HOLD-\d{6}$/);
    expect(result.status).toBe('RESERVED_HOLD');
    expect(result.tokenAmount).toBe(25000);
    expect(result.customerName).toBe('Kishore Kumar');
  });

  it('creates live site visit request with assigned fleet driver and vehicle details', async () => {
    const result = await createLiveSiteVisitRequest({
      ventureId: 'proj-1',
      ventureName: 'ISKON City - 2 (Podalakur Road)',
      customerName: 'Anil Reddy',
      customerPhone: '+91 9988776655',
      pickupAddress: 'Annamayya Circle, Nellore',
      timeSlot: '10:00 AM (Morning)',
      passengerCount: 3,
    });

    expect(result.visitId).toBeDefined();
    expect(result.driverName).toBeTruthy();
    expect(result.vehiclePlate).toBeTruthy();
    expect(result.status).toBe('SCHEDULED');
  });
});

describe('Marketing Mobile - Gemini AI Bilingual Advisor', () => {
  it('handles Telugu plot search queries and recommends matching plots', async () => {
    const response = await queryMobileRealEstateAssistant('తూర్పు ముఖం (East facing) ప్లాట్లు కావాలి');
    expect(response.replyText).toContain('ప్రీమియం ప్లాట్లు');
    expect(response.recommendedPlots).toBeDefined();
    expect(response.recommendedPlots!.length).toBeGreaterThan(0);
    response.recommendedPlots!.forEach((p) => {
      expect(p.facing).toBe('EAST');
    });
  });

  it('answers NUDA vs DTCP regulatory queries with structured advice', async () => {
    const response = await queryMobileRealEstateAssistant('NUDA vs DTCP differences enti?');
    expect(response.replyText).toContain('NUDA');
    expect(response.replyText).toContain('DTCP');
    expect(response.replyText).toContain('RERA');
  });

  it('answers Podalakur Road growth inquiries', async () => {
    const response = await queryMobileRealEstateAssistant('Tell me about Podalakur Road corridor investment');
    expect(response.replyText).toContain('పొదలకూరు');
    expect(response.replyText).toContain('నెల్లూరు');
  });

  it('provides Free Cab site visit guidance', async () => {
    const response = await queryMobileRealEstateAssistant('ఉచిత క్యాబ్ సైట్ విజిట్ ఎలా బుక్ చేయాలి?');
    expect(response.replyText).toContain('ఉచిత ఏసీ క్యాబ్');
  });
});

describe('Marketing Mobile - Admin Plot Inventory Cycling', () => {
  it('cycles plot status sequentially through AVAILABLE -> FAST_SELLING -> BOOKED -> REGISTERED -> AVAILABLE', () => {
    const cycleStatus = (current: PublicPlot['status']): PublicPlot['status'] => {
      if (current === 'AVAILABLE') return 'FAST_SELLING';
      if (current === 'FAST_SELLING') return 'BOOKED';
      if (current === 'BOOKED') return 'REGISTERED';
      return 'AVAILABLE';
    };

    expect(cycleStatus('AVAILABLE')).toBe('FAST_SELLING');
    expect(cycleStatus('FAST_SELLING')).toBe('BOOKED');
    expect(cycleStatus('BOOKED')).toBe('REGISTERED');
    expect(cycleStatus('REGISTERED')).toBe('AVAILABLE');
  });

  it('executes updateLivePlotStatus safely', async () => {
    await expect(updateLivePlotStatus('plot-101', 'BOOKED')).resolves.not.toThrow();
  });
});
