import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lead, LeadStatus, LeadSource } from '@real-estate-erp/types';

// Mock data generator for leads
const generateMockLeads = (page: number, limit: number): Lead[] => {
  const leads: Lead[] = [];
  const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATING', 'BOOKED', 'CLOSED_LOST', 'INVALID_UNREACHABLE'];
  const sources: LeadSource[] = ['PUBLIC_WEBSITE', 'FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_SEARCH', '99ACRES', 'MAGICBRICKS', 'HOUSING_COM', 'WALK_IN', 'REFERRAL', 'NEWSPAPER_AD', 'COLD_CALLING'];

  for (let i = 0; i < limit; i++) {
    const id = `lead-${page * limit + i}`;
    leads.push({
      id,
      fullName: `Lead ${page * limit + i}`,
      phone: `+919876543${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      email: `lead${page * limit + i}@example.com`,
      city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      budgetMin: 5000000 + Math.floor(Math.random() * 10000000),
      budgetMax: 15000000 + Math.floor(Math.random() * 20000000),
      aiIntentScore: Math.floor(Math.random() * 100),
      aiRecommendation: 'High intent, follow up immediately.',
      followUps: [],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
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
