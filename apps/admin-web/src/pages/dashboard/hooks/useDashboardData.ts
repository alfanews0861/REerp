import { useQuery } from '@tanstack/react-query';
import { mockDashboardService, DashboardData } from '../services/mockDashboardService';

export const useDashboardData = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: mockDashboardService.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
