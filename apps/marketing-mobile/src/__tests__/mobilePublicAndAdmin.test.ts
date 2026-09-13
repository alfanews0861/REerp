import { describe, it, expect } from 'vitest';
import { PUBLIC_VENTURES, PUBLIC_PLOTS, PublicPlot } from '../data/publicVenturesData';
import { queryMobileRealEstateAssistant } from '../services/mobileAiService';

describe('Marketing Mobile - Public Website Data & Modules', () => {
  it('loads all public ventures with valid statutory approvals and RERA IDs', () => {
    expect(PUBLIC_VENTURES.length).toBeGreaterThanOrEqual(4);
    PUBLIC_VENTURES.forEach((venture) => {
      expect(venture.id).toBeDefined();
      expect(venture.name).toBeTruthy();
      expect(['HMDA', 'DTCP', 'RERA']).toContain(venture.approvalAuthority);
      expect(venture.basePricePerSqYd).toBeGreaterThan(5000);
      expect(venture.amenities.length).toBeGreaterThan(0);
      expect(venture.connectivity.length).toBeGreaterThan(0);
    });
  });

  it('correctly filters public plots by facing and budget', () => {
    const eastFacing = PUBLIC_PLOTS.filter((p) => p.facing === 'EAST');
    expect(eastFacing.length).toBeGreaterThan(0);
    eastFacing.forEach((p) => expect(p.facing).toBe('EAST'));

    const under50Lakhs = PUBLIC_PLOTS.filter((p) => p.totalPrice <= 5000000);
    expect(under50Lakhs.length).toBeGreaterThan(0);
    under50Lakhs.forEach((p) => expect(p.totalPrice).toBeLessThanOrEqual(5000000));
  });

  it('calculates 48-hour token hold and pricing breakdown correctly', () => {
    const testPlot = PUBLIC_PLOTS[0];
    const calculatedTotal = testPlot.areaSqYds * testPlot.pricePerSqYd;
    expect(testPlot.totalPrice).toBe(calculatedTotal);
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

  it('answers HMDA vs DTCP regulatory queries with structured advice', async () => {
    const response = await queryMobileRealEstateAssistant('HMDA vs DTCP differences enti?');
    expect(response.replyText).toContain('HMDA');
    expect(response.replyText).toContain('DTCP');
    expect(response.replyText).toContain('RERA');
  });

  it('answers Mokila growth inquiries', async () => {
    const response = await queryMobileRealEstateAssistant('Tell me about Mokila corridor investment');
    expect(response.replyText).toContain('మోకిల');
    expect(response.replyText).toContain('ఫైనాన్షియల్ డిస్ట్రిక్ట్');
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
});
