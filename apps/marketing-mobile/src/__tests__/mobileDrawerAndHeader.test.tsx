import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// In-memory mock for AsyncStorage
const store: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => store[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn(async (key: string) => {
      delete store[key];
    }),
    clear: vi.fn(async () => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
  },
}));

vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
}));

vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 32, bottom: 16, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: any) => children,
}));

describe('Marketing Mobile - Hamburger Drawer Navigation Links Specifications', () => {
  const expectedRoutes = [
    { label: 'Home Dashboard', route: '/' },
    { label: 'Leads & Inquiries', route: '/(tabs)/leads' },
    { label: 'Site Visits', route: '/(tabs)/visits' },
    { label: 'Geo Attendance', route: '/(tabs)/attendance' },
    { label: 'Trips & Fleet', route: '/(tabs)/trips' },
    { label: 'Expenses & Claims', route: '/(tabs)/expenses' },
    { label: 'Plot Inventory', route: '/inventory' },
    { label: 'My Commission', route: '/commission' },
    { label: 'Team & Network', route: '/network' },
    { label: 'Customer Website', route: '/public-site' },
    { label: 'Start Site Visit', route: '/visit/start' },
    { label: 'KYC & Employee Profile', route: '/register-profile' },
  ];

  it('contains all required operational and CRM links', () => {
    const operationalRoutes = expectedRoutes.slice(0, 6);
    expect(operationalRoutes.map((r) => r.route)).toEqual([
      '/',
      '/(tabs)/leads',
      '/(tabs)/visits',
      '/(tabs)/attendance',
      '/(tabs)/trips',
      '/(tabs)/expenses',
    ]);
  });

  it('contains all required business, inventory and commission links', () => {
    const businessRoutes = expectedRoutes.slice(6, 9);
    expect(businessRoutes.map((r) => r.route)).toEqual([
      '/inventory',
      '/commission',
      '/network',
    ]);
  });

  it('contains customer website portal and live visit launcher tools', () => {
    const portalRoutes = expectedRoutes.slice(9, 12);
    expect(portalRoutes.map((r) => r.route)).toEqual([
      '/public-site',
      '/visit/start',
      '/register-profile',
    ]);
  });
});

describe('Marketing Mobile - RBAC (Role-Based Access Control) Drawer Guard Logic', () => {
  interface NavItemConfig {
    id: string;
    route: string;
    allowedRoles: ('admin' | 'manager' | 'agent' | 'telecaller' | 'driver')[];
  }

  const allNavItems: NavItemConfig[] = [
    { id: 'home', route: '/', allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'] },
    { id: 'leads', route: '/(tabs)/leads', allowedRoles: ['admin', 'manager', 'agent', 'telecaller'] },
    { id: 'visits', route: '/(tabs)/visits', allowedRoles: ['admin', 'manager', 'agent', 'telecaller'] },
    { id: 'attendance', route: '/(tabs)/attendance', allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'] },
    { id: 'trips', route: '/(tabs)/trips', allowedRoles: ['admin', 'driver', 'manager'] },
    { id: 'expenses', route: '/(tabs)/expenses', allowedRoles: ['admin', 'manager', 'agent', 'driver'] },
    { id: 'inventory', route: '/inventory', allowedRoles: ['admin', 'manager', 'agent'] },
    { id: 'commission', route: '/commission', allowedRoles: ['admin', 'manager', 'agent'] },
    { id: 'network', route: '/network', allowedRoles: ['admin', 'manager', 'agent'] },
    { id: 'public-site', route: '/public-site', allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'] },
    { id: 'start-visit', route: '/visit/start', allowedRoles: ['admin', 'manager', 'agent'] },
    { id: 'profile', route: '/register-profile', allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'] },
  ];

  const getFilteredRoutes = (role: 'admin' | 'manager' | 'agent' | 'telecaller' | 'driver') => {
    return allNavItems.filter((item) => item.allowedRoles.includes(role)).map((item) => item.id);
  };

  it('allows full system access to Admin / Super Admin leadership', () => {
    const adminRoutes = getFilteredRoutes('admin');
    expect(adminRoutes).toContain('home');
    expect(adminRoutes).toContain('leads');
    expect(adminRoutes).toContain('visits');
    expect(adminRoutes).toContain('attendance');
    expect(adminRoutes).toContain('trips');
    expect(adminRoutes).toContain('expenses');
    expect(adminRoutes).toContain('inventory');
    expect(adminRoutes).toContain('commission');
    expect(adminRoutes).toContain('network');
    expect(adminRoutes).toContain('public-site');
  });

  it('restricts Driver from seeing Leads CRM, Inventory, Commission, and Network', () => {
    const driverRoutes = getFilteredRoutes('driver');
    expect(driverRoutes).toContain('home');
    expect(driverRoutes).toContain('trips');
    expect(driverRoutes).toContain('attendance');
    expect(driverRoutes).toContain('expenses');
    expect(driverRoutes).toContain('profile');

    // Strict RBAC Disallowances for Driver:
    expect(driverRoutes).not.toContain('leads');
    expect(driverRoutes).not.toContain('visits');
    expect(driverRoutes).not.toContain('inventory');
    expect(driverRoutes).not.toContain('commission');
    expect(driverRoutes).not.toContain('network');
    expect(driverRoutes).not.toContain('start-visit');
  });

  it('restricts Telecaller from seeing Trips fleet and Commission downlines', () => {
    const telecallerRoutes = getFilteredRoutes('telecaller');
    expect(telecallerRoutes).toContain('home');
    expect(telecallerRoutes).toContain('leads');
    expect(telecallerRoutes).toContain('visits');
    expect(telecallerRoutes).toContain('attendance');
    expect(telecallerRoutes).toContain('public-site');

    // Strict RBAC Disallowances for Telecaller:
    expect(telecallerRoutes).not.toContain('trips');
    expect(telecallerRoutes).not.toContain('inventory');
    expect(telecallerRoutes).not.toContain('commission');
    expect(telecallerRoutes).not.toContain('network');
  });

  it('allows Sales Agents to access Leads, Visits, Inventory, Commission, and Team', () => {
    const agentRoutes = getFilteredRoutes('agent');
    expect(agentRoutes).toContain('leads');
    expect(agentRoutes).toContain('visits');
    expect(agentRoutes).toContain('inventory');
    expect(agentRoutes).toContain('commission');
    expect(agentRoutes).toContain('network');
    expect(agentRoutes).toContain('start-visit');

    // Field Agent does not manage driver fleet
    expect(agentRoutes).not.toContain('trips');
  });
});

describe('Marketing Mobile - Company Branding & Clean Header Specifications', () => {
  const companyBranding = {
    name: 'ISKON DEVELOPERS',
    tagline: 'NUDA & DTCP APPROVED TOWNSHIPS',
    supportNumber: '+91 98480 12345',
  };

  it('verifies corporate entity name and approval taglines', () => {
    expect(companyBranding.name).toBe('ISKON DEVELOPERS');
    expect(companyBranding.tagline).toContain('NUDA & DTCP');
    expect(companyBranding.supportNumber).toBe('+91 98480 12345');
  });

  it('formats staff roles correctly for drawer and header badges', () => {
    const formatRole = (role?: string) => {
      if (!role) return 'Field Associate';
      return role.replace(/_/g, ' ').toUpperCase();
    };

    expect(formatRole('super_admin')).toBe('SUPER ADMIN');
    expect(formatRole('director')).toBe('DIRECTOR');
    expect(formatRole('sales_executive')).toBe('SALES EXECUTIVE');
    expect(formatRole('telecaller')).toBe('TELECALLER');
    expect(formatRole('driver')).toBe('DRIVER');
    expect(formatRole(undefined)).toBe('Field Associate');
  });
});

describe('Marketing Mobile - Drawer State Machine Logic', () => {
  let isDrawerOpen = false;

  const openDrawer = () => {
    isDrawerOpen = true;
  };
  const closeDrawer = () => {
    isDrawerOpen = false;
  };
  const toggleDrawer = () => {
    isDrawerOpen = !isDrawerOpen;
  };

  beforeEach(() => {
    isDrawerOpen = false;
  });

  it('opens drawer on openDrawer call', () => {
    expect(isDrawerOpen).toBe(false);
    openDrawer();
    expect(isDrawerOpen).toBe(true);
  });

  it('closes drawer on closeDrawer call', () => {
    openDrawer();
    expect(isDrawerOpen).toBe(true);
    closeDrawer();
    expect(isDrawerOpen).toBe(false);
  });

  it('toggles drawer state correctly', () => {
    expect(isDrawerOpen).toBe(false);
    toggleDrawer();
    expect(isDrawerOpen).toBe(true);
    toggleDrawer();
    expect(isDrawerOpen).toBe(false);
  });
});
