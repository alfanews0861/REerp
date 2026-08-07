export const APP_CONFIG = {
  appName: 'Real Estate Marketing ERP',
  version: '1.0.0',
  defaultLanguage: 'en',
  defaultThemeMode: 'system' as const,
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  roles: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MARKETING_MANAGER: 'marketing_manager',
    SALES_AGENT: 'sales_agent',
    CLIENT: 'client',
  } as const,
  routes: {
    home: '/',
    login: '/login',
    dashboard: '/dashboard',
    forbidden: '/403',
    notFound: '/404',
  } as const,
} as const;

export type UserRole = (typeof APP_CONFIG.roles)[keyof typeof APP_CONFIG.roles];
