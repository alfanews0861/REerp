export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    PROPERTIES: '/listings',
    LISTING_DETAIL: '/listings/:id',
    LOGIN: '/login',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    PROPERTIES: '/admin/properties',
    PROPERTY_CREATE: '/admin/properties/new',
    PROPERTY_EDIT: '/admin/properties/:id/edit',
    LEADS: '/admin/leads',
    DEALS: '/admin/deals',
    MARKETING: '/admin/marketing',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    USERS: '/admin/users',
  },
};
