export const ERP_SYSTEM_CONFIG = {
  appName: 'Apex Real Estate ERP',
  company: 'Apex Realty Group International',
  version: '1.0.0',
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
  supportedLocales: ['en-US', 'es-ES', 'fr-FR'],
  roles: ['admin', 'manager', 'broker', 'agent', 'client'] as const,
  propertyTypes: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial', 'Land', 'Luxury Villa'] as const,
  leadStatuses: ['New', 'Contacted', 'Qualified', 'Nurturing', 'Negotiating', 'Closed Won', 'Closed Lost'] as const,
  dealStages: ['Prospecting', 'Property Tour', 'Offer Submitted', 'Under Contract', 'Escrow', 'Closed'] as const,
  pagination: {
    defaultPageSize: 15,
    pageSizeOptions: [10, 15, 25, 50, 100],
  },
  theme: {
    defaultMode: 'dark' as const,
    primaryColor: '#6366F1', // Indigo accent
    secondaryColor: '#10B981', // Emerald accent
  },
};
