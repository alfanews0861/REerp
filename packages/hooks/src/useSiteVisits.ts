import { useInfiniteQuery } from '@tanstack/react-query';
import { SiteVisitRepository } from '@real-estate-erp/firebase';

const repository = new SiteVisitRepository();

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
      
      if (filters?.search) {
        const res = await repository.search({
          term: filters.search,
          fields: ['visitStatus', 'assignedExecutiveId', 'companyId'],
          pagination: { page: pageParam as number, pageSize: 20 }
        });
        return {
          data: res.items,
          nextPage: res.hasMore ? (pageParam as number) + 1 : undefined,
          total: res.total
        };
      } else {
        const res = await repository.findPaginated({
          page: pageParam as number,
          pageSize: 20
        });
        
        let filtered = res.items;
        if (filters?.status && filters.status.length > 0) {
          filtered = filtered.filter(v => filters.status!.includes(v.visitStatus));
        }
        
        return {
          data: filtered,
          nextPage: res.hasMore ? (pageParam as number) + 1 : undefined,
          total: res.total
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
  });
};
