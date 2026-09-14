import { useInfiniteQuery } from '@tanstack/react-query';
import { SiteVisitRepository } from '@real-estate-erp/firebase';
import { SiteVisit } from '@real-estate-erp/types';

const repository = new SiteVisitRepository();

export const SEED_SITE_VISITS: SiteVisit[] = [
  {
    id: 'sv-1',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-1',
    leadOwnerId: 'usr-15',
    assignedExecutiveId: 'usr-9',
    scheduledDate: '2026-09-09',
    scheduledStartTime: '2026-09-09T09:30:00Z',
    visitStatus: 'IN_PROGRESS',
    visitMode: 'COMPANY_VEHICLE',
    meetingLocation: 'RKRI Towers HO (Annamayya Circle)',
    siteLocation: 'ISKON City - 2 (Podalakur Road)',
    expectedVisitors: 12,
    actualVisitors: 12,
    outcome: 'HOT',
    nextAction: 'Customer reviewing East facing Plot IC-102 pricing deed.',
    createdAt: '2026-09-09T08:00:00Z',
    updatedAt: '2026-09-09T09:30:00Z',
  },
  {
    id: 'sv-2',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-2',
    leadOwnerId: 'usr-16',
    assignedExecutiveId: 'usr-10',
    scheduledDate: '2026-09-09',
    scheduledStartTime: '2026-09-09T10:15:00Z',
    visitStatus: 'IN_PROGRESS',
    visitMode: 'COMPANY_VEHICLE',
    meetingLocation: 'Mini Bypass Branch Office',
    siteLocation: 'Dream City (Nellore-Bombay Highway)',
    expectedVisitors: 4,
    actualVisitors: 4,
    outcome: 'WARM',
    nextAction: 'Client examining commercial 60ft road corridor plots.',
    createdAt: '2026-09-09T08:30:00Z',
    updatedAt: '2026-09-09T10:15:00Z',
  },
  {
    id: 'sv-3',
    companyId: 'comp-1',
    branchId: 'branch-2',
    projectId: 'proj-3',
    leadOwnerId: 'usr-15',
    assignedExecutiveId: 'usr-8',
    scheduledDate: '2026-09-09',
    scheduledStartTime: '2026-09-09T14:30:00Z',
    visitStatus: 'CONFIRMED',
    visitMode: 'COMPANY_VEHICLE',
    meetingLocation: 'Nellore RTC Complex Hub',
    siteLocation: 'ISKON Brundhavanam',
    expectedVisitors: 8,
    outcome: 'HOT',
    nextAction: 'Villa plot boundary layout tour with senior sales head.',
    createdAt: '2026-09-09T09:00:00Z',
    updatedAt: '2026-09-09T09:00:00Z',
  },
  {
    id: 'sv-4',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-1',
    leadOwnerId: 'usr-15',
    assignedExecutiveId: 'usr-7',
    scheduledDate: '2026-09-08',
    scheduledStartTime: '2026-09-08T11:00:00Z',
    visitStatus: 'COMPLETED',
    visitMode: 'COMPANY_VEHICLE',
    meetingLocation: 'RKRI Towers HO',
    siteLocation: 'ISKON City - 2 (Podalakur Road)',
    expectedVisitors: 2,
    actualVisitors: 2,
    outcome: 'BOOKED',
    linkedBookingId: 'bk-1',
    nextAction: 'Token advance ₹5,00,000 paid for Plot IC-102.',
    createdAt: '2026-09-07T10:00:00Z',
    updatedAt: '2026-09-08T16:30:00Z',
  },
  {
    id: 'sv-5',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-3',
    leadOwnerId: 'usr-16',
    assignedExecutiveId: 'usr-9',
    scheduledDate: '2026-09-07',
    scheduledStartTime: '2026-09-07T14:00:00Z',
    visitStatus: 'COMPLETED',
    visitMode: 'HOME_PICKUP',
    meetingLocation: 'VRC Centre Residence',
    siteLocation: 'ISKON Brundhavanam',
    expectedVisitors: 3,
    actualVisitors: 3,
    outcome: 'WARM',
    nextAction: 'Doctor association group discount quotation shared.',
    createdAt: '2026-09-06T11:00:00Z',
    updatedAt: '2026-09-07T18:00:00Z',
  },
  {
    id: 'sv-6',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-4',
    leadOwnerId: 'usr-17',
    assignedExecutiveId: 'usr-10',
    scheduledDate: '2026-09-06',
    scheduledStartTime: '2026-09-06T09:30:00Z',
    visitStatus: 'COMPLETED',
    visitMode: 'COMPANY_VEHICLE',
    meetingLocation: 'RKRI Towers HO',
    siteLocation: 'ISKON Elite Township',
    expectedVisitors: 4,
    actualVisitors: 4,
    outcome: 'INTERESTED',
    nextAction: 'Requested clubhouse layout map & payment schedule.',
    createdAt: '2026-09-05T14:00:00Z',
    updatedAt: '2026-09-06T15:00:00Z',
  },
  {
    id: 'sv-7',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-2',
    leadOwnerId: 'usr-15',
    assignedExecutiveId: 'usr-10',
    scheduledDate: '2026-09-05',
    scheduledStartTime: '2026-09-05T08:30:00Z',
    visitStatus: 'COMPLETED',
    visitMode: 'MULTI_CUSTOMER_TRIP',
    meetingLocation: 'RKRI Towers HO',
    siteLocation: 'Dream City (Nellore-Bombay Highway)',
    expectedVisitors: 16,
    actualVisitors: 16,
    outcome: 'BOOKED',
    linkedBookingId: 'bk-2',
    nextAction: 'Sunday mega tour resulting in 4 spot bookings.',
    createdAt: '2026-09-04T09:00:00Z',
    updatedAt: '2026-09-05T17:30:00Z',
  },
  {
    id: 'sv-8',
    companyId: 'comp-1',
    branchId: 'branch-1',
    projectId: 'proj-1',
    leadOwnerId: 'usr-16',
    assignedExecutiveId: 'usr-9',
    scheduledDate: '2026-09-02',
    scheduledStartTime: '2026-09-02T10:00:00Z',
    visitStatus: 'COMPLETED',
    visitMode: 'COMPANY_VEHICLE',
    meetingLocation: 'Podalakur Road Branch',
    siteLocation: 'ISKON City - 2 (Podalakur Road)',
    expectedVisitors: 2,
    actualVisitors: 2,
    outcome: 'BOOKED',
    linkedBookingId: 'bk-7',
    nextAction: 'Customer executed sale agreement for 267 sq yds plot.',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-02T16:00:00Z',
  },
];

interface FetchVisitsParams {
  pageParam?: number;
  filters?: {
    status?: string[];
    executiveId?: string;
    search?: string;
  };
}

export const useSiteVisits = (filters?: FetchVisitsParams['filters']) => {
  return useInfiniteQuery({
    queryKey: ['siteVisits', filters],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        if (filters?.search) {
          const res = await repository.search({
            term: filters.search,
            fields: ['visitStatus', 'assignedExecutiveId', 'companyId'],
            pagination: { page: pageParam as number, pageSize: 20 },
          });
          if (res.items && res.items.length > 0) {
            return {
              data: res.items,
              nextPage: res.hasMore ? (pageParam as number) + 1 : undefined,
              total: res.total,
            };
          }
        } else {
          const res = await repository.findPaginated({
            page: pageParam as number,
            pageSize: 20,
          });

          if (res.items && res.items.length > 0) {
            let filtered = res.items;
            if (filters?.status && filters.status.length > 0) {
              filtered = filtered.filter((v) => filters.status!.includes(v.visitStatus));
            }

            return {
              data: filtered,
              nextPage: res.hasMore ? (pageParam as number) + 1 : undefined,
              total: res.total,
            };
          }
        }
      } catch (err) {
        console.warn('Firestore fetch site visits error, fallback to seed visits:', err);
      }

      // Fallback to rich seed visits
      let seedFiltered = [...SEED_SITE_VISITS];
      if (filters?.status && filters.status.length > 0) {
        seedFiltered = seedFiltered.filter((v) => filters.status!.includes(v.visitStatus));
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        seedFiltered = seedFiltered.filter(
          (v) =>
            v.siteLocation?.toLowerCase().includes(query) ||
            v.meetingLocation?.toLowerCase().includes(query) ||
            v.visitStatus.toLowerCase().includes(query)
        );
      }

      return {
        data: seedFiltered,
        nextPage: undefined,
        total: seedFiltered.length,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
  });
};
