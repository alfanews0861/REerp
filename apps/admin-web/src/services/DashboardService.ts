import { ExecutiveDashboardData, CommandCenterKPIs, DashboardFilter } from '@real-estate-erp/types';

export class DashboardService {
  
  static async getCommandCenterData(filter?: DashboardFilter): Promise<ExecutiveDashboardData> {
    // In a real application, this would call a Cloud Function or perform indexed aggregations via Firestore.
    // To prevent unbounded reads, we simulate an aggregated response here.
    
    // Mock aggregated KPI data
    const kpis: CommandCenterKPIs = {
      totalLeads: 1250,
      qualifiedLeads: 420,
      siteVisits: 315,
      bookings: 120,
      fullPayments: 85,
      registrations: 45,
      
      grossSales: 450000000,
      collectedAmount: 210000000,
      outstandingAmount: 240000000,
      commissionPayable: 15000000,
      
      availableInventory: 345,
      bookedInventory: 120,
      registeredInventory: 45,
      
      afterSalesOpenCases: 12,
    };

    return {
      kpis,
      insights: this.generateMockInsights(kpis)
    };
  }

  private static generateMockInsights(kpis: CommandCenterKPIs) {
    // Basic heuristics to demonstrate AI-ready signals
    const insights = [];
    
    if (kpis.siteVisits > 0 && (kpis.bookings / kpis.siteVisits) < 0.1) {
      insights.push({
        metric: 'Site Visit Conversion',
        observation: 'Low conversion rate from site visits to bookings.',
        evidence: `315 site visits resulted in only ${kpis.bookings} bookings.`,
        severity: 'HIGH',
        possibleCause: 'Sales pitch ineffective or mismatched customer expectations on-site.',
        recommendedAction: 'Conduct ride-along with field executives to evaluate site visit quality.',
        confidence: 'HIGH'
      });
    }

    if (kpis.outstandingAmount > kpis.collectedAmount) {
      insights.push({
        metric: 'Outstanding Collections',
        observation: 'Outstanding amounts exceed collected amounts.',
        evidence: `Outstanding: ₹24 Cr vs Collected: ₹21 Cr`,
        severity: 'MEDIUM',
        possibleCause: 'Follow-ups on payment schedules are lagging.',
        recommendedAction: 'Assign a dedicated telecalling team for overdue follow-ups.',
        confidence: 'MEDIUM'
      });
    }

    return insights;
  }
}
