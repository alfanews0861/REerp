export interface DashboardMetrics {
  todayLeads: number;
  todayCalls: number;
  todayFollowups: number;
  todaySiteVisits: number;
  todayBookings: number;
  todayRevenue: number;
}

export interface LeadFunnel {
  newLeads: number;
  assigned: number;
  contacted: number;
  interested: number;
  siteVisit: number;
  negotiation: number;
  booked: number;
  lost: number;
}

export interface SalesFunnel {
  pipelineValue: number;
  expectedRevenue: number;
  closedDeals: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DashboardData {
  summary: DashboardMetrics;
  leadFunnel: LeadFunnel;
  salesFunnel: SalesFunnel;
  leadSource: ChartDataPoint[];
  campaignPerformance: ChartDataPoint[];
  dailyLeads: ChartDataPoint[];
  weeklySales: ChartDataPoint[];
  monthlyRevenue: ChartDataPoint[];
  bookingTrend: ChartDataPoint[];
  marketingPerformance: number;
  campaignROI: number;
  siteVisits: number;
  bookings: number;
  collections: number;
  vehicleStatus: string;
  pendingApprovals: number;
  todayFollowupsList: { id: string; name: string; task: string }[];
  topPerformingEmployee: string;
  topCampaign: string;
  topProject: string;
  pendingTasks: number;
  upcomingSiteVisits: number;
  notifications: string[];
  recentActivities: { id: string; user: string; action: string; time: string }[];
}

export const mockDashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      summary: {
        todayLeads: 45,
        todayCalls: 120,
        todayFollowups: 34,
        todaySiteVisits: 12,
        todayBookings: 3,
        todayRevenue: 250000,
      },
      leadFunnel: {
        newLeads: 500,
        assigned: 450,
        contacted: 400,
        interested: 250,
        siteVisit: 100,
        negotiation: 50,
        booked: 20,
        lost: 150,
      },
      salesFunnel: {
        pipelineValue: 5000000,
        expectedRevenue: 1200000,
        closedDeals: 15,
        conversionRate: 4.5,
      },
      leadSource: [
        { name: 'Organic', value: 400 },
        { name: 'Facebook', value: 300 },
        { name: 'Google Ads', value: 300 },
        { name: 'Referral', value: 200 },
      ],
      campaignPerformance: [
        { name: 'Summer Fest', value: 80 },
        { name: 'Diwali Offer', value: 95 },
        { name: 'New Year', value: 70 },
      ],
      dailyLeads: [
        { name: 'Mon', value: 40 },
        { name: 'Tue', value: 55 },
        { name: 'Wed', value: 45 },
        { name: 'Thu', value: 65 },
        { name: 'Fri', value: 50 },
        { name: 'Sat', value: 80 },
        { name: 'Sun', value: 90 },
      ],
      weeklySales: [
        { name: 'Week 1', value: 20 },
        { name: 'Week 2', value: 45 },
        { name: 'Week 3', value: 15 },
        { name: 'Week 4', value: 50 },
      ],
      monthlyRevenue: [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
      ],
      bookingTrend: [
        { name: 'Jan', value: 10 },
        { name: 'Feb', value: 15 },
        { name: 'Mar', value: 8 },
        { name: 'Apr', value: 20 },
      ],
      marketingPerformance: 85,
      campaignROI: 125,
      siteVisits: 145,
      bookings: 24,
      collections: 1200000,
      vehicleStatus: '8/10 Available',
      pendingApprovals: 12,
      todayFollowupsList: [
        { id: '1', name: 'John Doe', task: 'Send brochure' },
        { id: '2', name: 'Jane Smith', task: 'Call regarding discount' },
      ],
      topPerformingEmployee: 'Sarah Jenkins',
      topCampaign: 'Summer Fest 2026',
      topProject: 'Sunset Villas',
      pendingTasks: 8,
      upcomingSiteVisits: 5,
      notifications: [
        'New booking received for Sunset Villas',
        'Campaign "Diwali Offer" reached 10k impressions',
      ],
      recentActivities: [
        { id: '1', user: 'Alex', action: 'Added a new lead', time: '10 mins ago' },
        { id: '2', user: 'Sam', action: 'Completed a site visit', time: '1 hour ago' },
      ],
    };
  },
};
