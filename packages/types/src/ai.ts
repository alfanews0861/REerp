import { AIInsight } from './dashboard';

/**
 * Common metrics interface expected by AI providers.
 * Sent as structured data rather than raw customer data.
 */
export interface AIMetricsPayload {
  leadVolume: number;
  leadConversion: number; // Percentage
  siteVisitConversion: number; // Percentage
  bookingConversion: number; // Percentage
  paymentConversion: number; // Percentage
  registrationConversion: number; // Percentage
  responseTime: number; // Hours or Minutes
  noShowRate: number; // Percentage
  vehicleUtilization?: number; // Percentage
  inventoryVelocity?: number; // Units per month
  campaignCost?: number;
  revenue: number;
  commission: number;
  afterSalesBacklog: number;
}

export interface AIInsightProvider {
  /**
   * Given a set of structured metrics, generate factual, actionable insights.
   */
  generateInsights(metrics: AIMetricsPayload, _contextData?: Record<string, any>): Promise<AIInsight[]>;
}

export class RuleBasedInsightProvider implements AIInsightProvider {
  async generateInsights(metrics: AIMetricsPayload, _contextData?: Record<string, any>): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    const timestamp = new Date().toISOString();
    const provider = 'RuleBasedEngine';

    if (metrics.siteVisitConversion < 10) {
      insights.push({
        metric: 'Site Visit Conversion',
        observation: 'Low conversion rate from site visits to bookings.',
        evidence: `Site visit conversion is currently at ${metrics.siteVisitConversion.toFixed(1)}%.`,
        severity: 'HIGH',
        possibleCause: 'Sales pitch ineffective, lack of follow-up, or mismatched customer expectations on-site.',
        recommendedAction: 'Conduct ride-along with field executives to evaluate site visit quality.',
        confidence: 'HIGH'
      });
    }

    if (metrics.noShowRate > 25) {
      insights.push({
        metric: 'Site Visit No-Show Rate',
        observation: 'High rate of customer no-shows for scheduled site visits.',
        evidence: `No-show rate is ${metrics.noShowRate.toFixed(1)}%.`,
        severity: 'MEDIUM',
        possibleCause: 'Insufficient reminder calls or customers booking visits without strong intent.',
        recommendedAction: 'Implement automated WhatsApp reminders 24h and 2h before visits.',
        confidence: 'HIGH'
      });
    }

    if (metrics.afterSalesBacklog > 50) {
      insights.push({
        metric: 'After-Sales Backlog',
        observation: 'Significant accumulation of unresolved after-sales cases.',
        evidence: `There are ${metrics.afterSalesBacklog} open after-sales cases.`,
        severity: 'HIGH',
        possibleCause: 'Understaffed after-sales team or delays in registration document procurement.',
        recommendedAction: 'Review age of open cases and allocate additional staff temporarily.',
        confidence: 'HIGH'
      });
    }

    // Embed provider metadata into insights
    return insights.map(i => ({ ...i, generatedAt: timestamp, provider }));
  }
}

export class LLMInsightProvider implements AIInsightProvider {
  async generateInsights(_metrics: AIMetricsPayload, _contextData?: Record<string, any>): Promise<AIInsight[]> {
    const timestamp = new Date().toISOString();
    const provider = 'LLMProvider';
    // Implementation stub for actual LLM integration
    // Example: const response = await fetch('https://api.openai.com/...', { body: JSON.stringify(metrics) })
    
    return [
      {
        metric: 'LLM Analytics',
        observation: 'LLM Integration pending.',
        evidence: 'Metrics received but LLM logic is stubbed.',
        severity: 'LOW',
        possibleCause: 'Awaiting implementation.',
        recommendedAction: 'Implement LLM adapter.',
        confidence: 'LOW',
      } as AIInsight
    ].map(i => ({ ...i, generatedAt: timestamp, provider }));
  }
}
