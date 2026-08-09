import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@real-estate-erp/firebase';
import { ExecutiveDashboardData, CommandCenterKPIs, DashboardFilter } from '@real-estate-erp/types';
import { RuleBasedInsightProvider, AIMetricsPayload } from '@real-estate-erp/types';

export class DashboardService {
  
  static async getCommandCenterData(filter?: DashboardFilter): Promise<ExecutiveDashboardData> {
    const companyId = filter?.companyId || 'company_overview';
    
    let docId = `${companyId}_global`;
    if (filter?.projectId && filter?.startDate) {
      const dateStr = new Date(filter.startDate).toISOString().split('T')[0];
      docId = `${companyId}_project_${filter.projectId}_daily_${dateStr}`;
    } else if (filter?.projectId) {
      docId = `${companyId}_project_${filter.projectId}`;
    } else if (filter?.startDate) {
      const dateStr = new Date(filter.startDate).toISOString().split('T')[0];
      docId = `${companyId}_daily_${dateStr}`;
    }
    
    const kpiDocRef = doc(db, 'dashboard_kpis', docId);
    const kpiSnap = await getDoc(kpiDocRef);
    
    // Fallback zero state if aggregation hasn't run
    const defaultKpis: CommandCenterKPIs = {
      totalLeads: 0, qualifiedLeads: 0, siteVisits: 0, bookings: 0,
      fullPayments: 0, registrations: 0, grossSales: 0, collectedAmount: 0,
      outstandingAmount: 0, commissionPayable: 0, availableInventory: 0,
      bookedInventory: 0, registeredInventory: 0, afterSalesOpenCases: 0,
    };

    const kpis: CommandCenterKPIs = kpiSnap.exists() 
      ? (kpiSnap.data() as CommandCenterKPIs)
      : defaultKpis;

    // Transform KPI structure to AIMetricsPayload
    const metricsPayload: AIMetricsPayload = {
      leadVolume: kpis.totalLeads,
      leadConversion: kpis.totalLeads > 0 ? (kpis.bookings / kpis.totalLeads) * 100 : 0,
      siteVisitConversion: kpis.siteVisits > 0 ? (kpis.bookings / kpis.siteVisits) * 100 : 0,
      bookingConversion: kpis.bookings > 0 ? (kpis.fullPayments / kpis.bookings) * 100 : 0,
      paymentConversion: kpis.fullPayments > 0 ? (kpis.registrations / kpis.fullPayments) * 100 : 0,
      registrationConversion: kpis.bookings > 0 ? (kpis.registrations / kpis.bookings) * 100 : 0,
      responseTime: 2.5, // Derived from Interaction SLAs
      noShowRate: 15.0, // Stubbed, could be tracked in SiteVisits
      vehicleUtilization: 85,
      inventoryVelocity: 12,
      revenue: kpis.grossSales,
      commission: kpis.commissionPayable,
      afterSalesBacklog: kpis.afterSalesOpenCases
    };

    const aiProvider = new RuleBasedInsightProvider();
    const insights = await aiProvider.generateInsights(metricsPayload);

    return {
      kpis,
      insights
    };
  }
}

