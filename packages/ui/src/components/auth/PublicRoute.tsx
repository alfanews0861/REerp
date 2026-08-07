import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

export interface PublicRouteProps {
  children?: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  return <>{children ? children : <Outlet />}</>;
};
