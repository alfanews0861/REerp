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
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      summary: {
        todayLeads: 48,
        todayCalls: 184,
        todayFollowups: 52,
        todaySiteVisits: 14,
        todayBookings: 4,
        todayRevenue: 1850000,
      },
      leadFunnel: {
        newLeads: 2450,
        assigned: 2180,
        contacted: 1840,
        interested: 920,
        siteVisit: 412,
        negotiation: 148,
        booked: 68,
        lost: 320,
      },
      salesFunnel: {
        pipelineValue: 248500000,
        expectedRevenue: 64000000,
        closedDeals: 68,
        conversionRate: 7.4,
      },
      leadSource: [
        { name: 'Meta Ads (FB/IG)', value: 1050 },
        { name: 'Agent Network Referrals', value: 680 },
        { name: 'Google Search & SEO', value: 420 },
        { name: 'Direct Walk-ins', value: 300 },
      ],
      campaignPerformance: [
        { name: 'Akshaya Tritiya Mega Launch', value: 96 },
        { name: 'NRI Direct Investment Drive', value: 88 },
        { name: 'Broker Referral Incentive Drive', value: 82 },
        { name: 'Metro Outdoor Hoardings', value: 65 },
      ],
      dailyLeads: [
        { name: 'Mon', value: 42 },
        { name: 'Tue', value: 58 },
        { name: 'Wed', value: 51 },
        { name: 'Thu', value: 64 },
        { name: 'Fri', value: 72 },
        { name: 'Sat', value: 95 },
        { name: 'Sun', value: 110 },
      ],
      weeklySales: [
        { name: 'Week 1', value: 12 },
        { name: 'Week 2', value: 18 },
        { name: 'Week 3', value: 15 },
        { name: 'Week 4', value: 23 },
      ],
      monthlyRevenue: [
        { name: 'Apr', value: 38500000 },
        { name: 'May', value: 42000000 },
        { name: 'Jun', value: 48500000 },
        { name: 'Jul', value: 52000000 },
        { name: 'Aug', value: 59000000 },
        { name: 'Sep', value: 64000000 },
      ],
      bookingTrend: [
        { name: 'Apr', value: 10 },
        { name: 'May', value: 12 },
        { name: 'Jun', value: 14 },
        { name: 'Jul', value: 15 },
        { name: 'Aug', value: 17 },
        { name: 'Sep', value: 20 },
      ],
      marketingPerformance: 92,
      campaignROI: 340,
      siteVisits: 412,
      bookings: 68,
      collections: 186200000,
      vehicleStatus: '6/8 In Operation',
      pendingApprovals: 5,
      todayFollowupsList: [
        { id: '1', name: 'Dr. Haritha Rao', task: 'NRI Plot Reservation Agreement for Sunrise Enclave #SE-102' },
        { id: '2', name: 'Venkat Raman', task: 'Bank loan legal verification callback for Green Valley #GV-204' },
        { id: '3', name: 'Lakshmi Prasanna', task: 'Discuss corner villa plot PC-05 payment schedule & discount' },
        { id: '4', name: 'Satyanarayana Murthy', task: 'Farmhouse boundary survey demarcation report sharing' },
      ],
      topPerformingEmployee: 'Priya Sharma (Zonal Sales Head)',
      topCampaign: 'Akshaya Tritiya Mega Launch 2026',
      topProject: 'Sunrise Enclave (Mokila)',
      pendingTasks: 4,
      upcomingSiteVisits: 8,
      notifications: [
        'Token advance ₹5,00,000 received for Plot SE-102 (Sunrise Enclave)',
        'NRI delegation group tour confirmed for Sunday morning at Mokila site',
        'HMDA technical sanction issued for Green Valley Phase 2 extension',
      ],
      recentActivities: [
        { id: '1', user: 'Priya Sharma', action: 'Closed booking for Plot SE-102 (₹74.5L)', time: '15 mins ago' },
        { id: '2', user: 'Ramesh Goud', action: 'Completed site visit trip TRIP-2026-040 with NRI family', time: '45 mins ago' },
        { id: '3', user: 'Lakshmi Narayana', action: 'Approved agent commission batch #14 (₹4.65L)', time: '2 hours ago' },
        { id: '4', user: 'Sunita Reddy', action: 'Scheduled 3 weekend site visits from Meta campaign', time: '3 hours ago' },
      ],
    };
  },
};
