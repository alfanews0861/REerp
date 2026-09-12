import { describe, it, expect } from 'vitest';
import { queryGeminiRealEstateAssistant } from './geminiAiService';
import { PUBLIC_PLOTS } from '../data/venturesData';

describe('Gemini Real Estate AI Assistant Service', () => {
  it('should match plots under specified budget in English', async () => {
    const response = await queryGeminiRealEstateAssistant('Show me plots under 30 Lakhs', 'en', PUBLIC_PLOTS);
    expect(response.replyText).toContain('premium plots');
    expect(response.recommendedPlots).toBeDefined();
    expect(response.recommendedPlots!.length).toBeGreaterThan(0);
    response.recommendedPlots!.forEach((plot) => {
      expect(plot.totalPrice).toBeLessThanOrEqual(3000000 * 1.2);
    });
  });

  it('should match plots under specified budget in Telugu', async () => {
    const response = await queryGeminiRealEstateAssistant('నా బడ్జెట్ 30 లక్షలు, తూర్పు ముఖం ప్లాట్లు చూపించు', 'te', PUBLIC_PLOTS);
    expect(response.replyText).toContain('అత్యుత్తమ ప్లాట్లు');
    expect(response.recommendedPlots).toBeDefined();
    expect(response.recommendedPlots!.length).toBeGreaterThan(0);
    expect(response.recommendedPlots![0].facing).toBe('EAST');
  });

  it('should explain HMDA vs DTCP differences in English and Telugu', async () => {
    const enResponse = await queryGeminiRealEstateAssistant('What is the difference between HMDA and DTCP?', 'en');
    expect(enResponse.replyText).toContain('Hyderabad Metropolitan Development Authority');
    expect(enResponse.replyText).toContain('Directorate of Town & Country Planning');

    const teResponse = await queryGeminiRealEstateAssistant('HMDA మరియు DTCP మధ్య తేడా ఏమిటి?', 'te');
    expect(teResponse.replyText).toContain('హైదరాబాద్ మెట్రోపాలిటన్ డెవలప్‌మెంట్ అథారిటీ');
  });

  it('should explain 48-Hour token hold details', async () => {
    const holdResponse = await queryGeminiRealEstateAssistant('How does 48-Hour hold work?', 'en');
    expect(holdResponse.replyText).toContain('100% Money-Back Guarantee');
    expect(holdResponse.replyText).toContain('Instant Price Freeze');
  });
});
