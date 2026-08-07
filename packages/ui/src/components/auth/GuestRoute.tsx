import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@real-estate-erp/firebase';
import { LoadingFallback } from '../LoadingFallback';

export interface GuestRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectTo = '/admin',
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingFallback message="Loading session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};
