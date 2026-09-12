import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lead, LeadStatus, LeadSource } from '@real-estate-erp/types';

const REALISTIC_NAMES = [
  'Srikanth Reddy', 'Venkat Raman', 'Lakshmi Prasanna', 'Dr. Haritha Rao',
  'Satyanarayana Murthy', 'Kalyan Chakravarthy', 'Sudhakar Goud', 'Anitha Chowdary',
  'Naveen Kumar V', 'Rajesh Varma', 'Madhava Rao K', 'Swathi Naidu',
  'Vijay Bhaskar Reddy', 'Chandra Shekar', 'Pooja Agarwal', 'Ravi Teja Sharma',
  'Dr. Ashok Varma', 'Kiranmayi Devi', 'Suresh Chandra', 'Bhaskar Raju',
  'Prasad Babu', 'Geetha Rani', 'Deepak Verma', 'Srinivas Goud',
  'Padmavathi K', 'Karthik Raja', 'Sunil Narayana', 'Shravan Reddy'
];

const CITIES = ['Hyderabad', 'Hyderabad', 'Hyderabad', 'Bangalore', 'Vijayawada', 'Visakhapatnam', 'NRI (Dallas, USA)', 'NRI (Dubai, UAE)'];
const VENTURE_PREFERENCES = ['Sunrise Enclave (Mokila)', 'Green Valley Phase 2 (Shadnagar)', 'Palm County (Kollur)', 'Royal Meadows (Shankarpally)'];

// Mock data generator for leads
const generateMockLeads = (page: number, limit: number): Lead[] => {
  const leads: Lead[] = [];
  const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATING', 'BOOKED', 'CLOSED_LOST'];
  const sources: LeadSource[] = ['PUBLIC_WEBSITE', 'FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_SEARCH', '99ACRES', 'MAGICBRICKS', 'WALK_IN', 'REFERRAL', 'NEWSPAPER_AD'];

  for (let i = 0; i < limit; i++) {
    const leadIndex = page * limit + i;
    const name = REALISTIC_NAMES[leadIndex % REALISTIC_NAMES.length];
    const id = `lead-${leadIndex + 101}`;
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
    const venture = VENTURE_PREFERENCES[leadIndex % VENTURE_PREFERENCES.length];
    const status = statuses[leadIndex % statuses.length];
    const minBudget = 2500000 + (leadIndex % 8) * 1500000;
    const maxBudget = minBudget + 2000000 + (leadIndex % 5) * 1000000;
    const intentScore = 60 + (leadIndex * 7) % 40;

    leads.push({
      id,
      fullName: name,
      phone: `+91 98480 ${Math.floor(10000 + ((leadIndex * 137) % 90000))}`,
      email: `${cleanName}${leadIndex}@gmail.com`,
      city: CITIES[leadIndex % CITIES.length],
      source: sources[leadIndex % sources.length],
      status,
      budgetMin: minBudget,
      budgetMax: maxBudget,
      aiIntentScore: intentScore,
      aiRecommendation: intentScore > 80 
        ? `High purchase intent for ${venture}. Interested in 200-267 Sq Yds East facing plot.`
        : `Interested in long-term appreciation in ${venture}. Follow up for weekend site visit.`,
      followUps: [
        {
          id: `fup-${leadIndex}-1`,
          type: 'CALL',
          notes: `Schedule callback regarding corner plot availability in ${venture}.`,
          disposition: 'INTERESTED',
          nextFollowUpDate: new Date(Date.now() + 86400000).toISOString(),
          createdByUserId: 'usr-15',
          createdByUserName: 'Sunita Reddy',
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date(Date.now() - (leadIndex * 3600000 * 8)).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return leads;
};

interface FetchLeadsParams {
  pageParam?: number;
  filters?: {
    status?: string[];
    source?: string[];
    search?: string;
  };
}

export const useLeads = (filters?: FetchLeadsParams['filters']) => {
  return useInfiniteQuery({
    queryKey: ['leads', filters],
    queryFn: async ({ pageParam = 0 }) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      const limit = 20;
      let data = generateMockLeads(pageParam, limit);
      
      // Apply mock filters
      if (filters?.status && filters.status.length > 0) {
        data = data.filter(l => filters.status!.includes(l.status));
      }
      if (filters?.search) {
        const lowerSearch = filters.search.toLowerCase();
        data = data.filter(l => 
          l.fullName.toLowerCase().includes(lowerSearch) || 
          l.phone.includes(lowerSearch) ||
          l.email?.toLowerCase().includes(lowerSearch)
        );
      }

      return {
        data,
        nextPage: pageParam + 1,
        total: 1000 // mock total
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => {
      // Limit to 50 pages of mock data
      return lastPage.nextPage < 50 ? lastPage.nextPage : undefined;
    },
  });
};

export const useBulkAssignLeads = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadIds }: { leadIds: string[] }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, count: leadIds.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
