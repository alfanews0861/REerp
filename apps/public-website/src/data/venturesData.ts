import { ApprovalAuthority } from '@real-estate-erp/types';

export interface PublicVenture {
  id: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  state: string;
  approvalAuthority: ApprovalAuthority;
  approvalNumber: string;
  reraId: string;
  totalAreaAcres: number;
  totalPlots: number;
  availablePlots: number;
  basePricePerSqYd: number;
  heroImage: string;
  galleryImages: string[];
  layoutMapUrl: string;
  description: string;
  featured: boolean;
  amenities: string[];
  highlights: string[];
  connectivity: { label: string; time: string }[];
}

export interface PublicPlot {
  id: string;
  projectId: string;
  projectName: string;
  plotNumber: string;
  facing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH';
  areaSqYds: number;
  dimensions: string; // e.g. "36 x 50"
  isCornerPlot: boolean;
  pricePerSqYd: number;
  totalPrice: number;
  status: 'AVAILABLE' | 'FAST_SELLING' | 'BOOKED';
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  location: string;
  avatar: string;
  quote: string;
  venturePurchased: string;
  rating: number;
}

export const PUBLIC_VENTURES: PublicVenture[] = [
  {
    id: 'proj-1',
    name: 'ISKON City - 2',
    tagline: 'Premium 120-Acre Mega Township & Gated Villa Plots on Podalakur Road, Nellore',
    location: 'Podalakur Road (Near Mattempadu), Nellore',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/00248/LO/Plg/2024',
    reraId: 'P02260007891',
    totalAreaAcres: 120.0,
    totalPlots: 450,
    availablePlots: 78,
    basePricePerSqYd: 18500,
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'ISKON City - 2 is a prestigious 120-acre mega gated township situated on Podalakur Road, Nellore. Features a grand 170 ft entrance road, luxury clubhouse, swimming pools, multiple sporting arenas, lush parks, underground cabling, and 100% Vaastu compliant residential villa plots with NUDA & AP RERA approvals.',
    featured: true,
    amenities: [
      '170 Ft Grand Entrance Boulevard',
      '60, 40 & 33 Feet BT Roads',
      'Underground Drainage & STP',
      '24/7 Water Supply with Overhead Tank',
      'Underground Electricity & Solar Street Lights',
      'Grand Entrance Arch with 24/7 Security & CCTV',
      'Clubhouse with Swimming Pool & Gym',
      'Children Play Area, Skating Rink & Jogging Tracks',
      '100% Vaastu Compliant',
    ],
    highlights: [
      'Grand 170ft Main Road Entrance on Podalakur Highway',
      '10 Mins from Mini Bypass Road & Annamayya Circle',
      '15 Mins to Nellore Railway Station & RTC Bus Complex',
      'Surrounded by top schools & engineering colleges (Narayana, Rao\'s)',
      '100% Clear legal title with spot registration & bank loans',
    ],
    connectivity: [
      { label: 'Annamayya Circle / Mini Bypass', time: '10 Mins' },
      { label: 'Nellore Railway Station', time: '15 Mins' },
      { label: 'VRC Centre & City Hub', time: '14 Mins' },
      { label: 'NH-16 Chennai-Kolkata Hwy', time: '12 Mins' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Dream City',
    tagline: 'High-ROI Gated Community Villa Plots near Nellore-Bombay Highway Corridor',
    location: 'Nellore-Bombay Highway (NH-67 / Kovuru), Nellore',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    approvalAuthority: 'DTCP',
    approvalNumber: 'DTCP/AP/0912/2023',
    reraId: 'P02260006542',
    totalAreaAcres: 45.0,
    totalPlots: 310,
    availablePlots: 65,
    basePricePerSqYd: 12500,
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'Dream City is a master-planned 45-acre open plot venture located near the Nellore-Bombay Highway (Kovur zone). Designed for high capital appreciation, serene green living, and immediate villa construction with wide BT roads and compound wall.',
    featured: true,
    amenities: [
      '60, 40 & 33 Feet Black Top Roads',
      'Compound Wall around entire venture',
      'Avenue Plantation with drip irrigation',
      'Modern Overhead Water Storage',
      'Parks with Designer Gazebos & Walking Trails',
      'CCTV Surveillance at Entrance Gate',
    ],
    highlights: [
      'Strategically located near Nellore-Bombay Highway corridor',
      '10 Mins from Kovur & Penna River Bridge',
      '15 Mins to Nellore City Commercial Centres',
      '100% Clear Title with Patta Passbook issuance',
    ],
    connectivity: [
      { label: 'Kovur Town & Bridge', time: '10 Mins' },
      { label: 'Nellore City Bus Stand', time: '15 Mins' },
      { label: 'Kavali Highway Junction', time: '20 Mins' },
      { label: 'Krishnapatnam Port Corridor', time: '35 Mins' },
    ],
  },
  {
    id: 'proj-3',
    name: 'ISKON Brundhavanam',
    tagline: 'Ultra-Luxury Villa Plots in Prime Chinthareddypalem Urban Zone',
    location: 'Chinthareddypalem - Mini Bypass Corridor, Nellore',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/00881/LO/Plg/2024',
    reraId: 'P02260009115',
    totalAreaAcres: 30.0,
    totalPlots: 160,
    availablePlots: 32,
    basePricePerSqYd: 22000,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'An address of prestige in Nellore city limits. ISKON Brundhavanam is curated for discerning families seeking premium villa plots with ultra-modern clubhouse amenities in Chinthareddypalem.',
    featured: true,
    amenities: [
      '50 & 40 Feet Interlocking Paver Roads',
      'Full Underground Cabling (Power, Fiber)',
      'Designer Landscaping & Zen Gardens',
      'Air-conditioned Clubhouse & Gym',
      'Badminton & Pickleball Courts',
      'Solar Powered Perimeter Fencing',
    ],
    highlights: [
      '5 minutes from Mini Bypass & Annamayya Circle',
      'Near Narayana Medical College & Hospital',
      'Surrounded by premium residential layouts',
      'Immediate construction approval with spot registry',
    ],
    connectivity: [
      { label: 'Mini Bypass Road', time: '5 Mins' },
      { label: 'Narayana Hospital', time: '4 Mins' },
      { label: 'Annamayya Circle', time: '6 Mins' },
      { label: 'Nellore Main Market', time: '12 Mins' },
    ],
  },
  {
    id: 'proj-4',
    name: 'ISKON Elite Township',
    tagline: 'Strategic Investment Plots near Annamayya Circle Extension Corridor',
    location: 'Annamayya Circle Extn, Mini Bypass, Nellore',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/0338/2023',
    reraId: 'P02260005432',
    totalAreaAcres: 50.0,
    totalPlots: 350,
    availablePlots: 95,
    basePricePerSqYd: 16500,
    heroImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'Rapidly appreciating investment destination along the flourishing Nellore urban expansion belt. ISKON Elite Township features spacious plots with complete statutory infrastructure.',
    featured: false,
    amenities: [
      '40 & 33 Feet Wide Black Top Roads',
      'Electricity with Transformer & Street Lights',
      'Children Play Area with Lush Green Parks',
      'Round the clock Security and Gated Boundary',
      'Water tap connection for every plot',
    ],
    highlights: [
      'Fast expanding residential zone in Nellore',
      'Direct link to Mini Bypass and Railway corridor',
      'High appreciation potential with flexible payment plans',
    ],
    connectivity: [
      { label: 'Annamayya Circle', time: '7 Mins' },
      { label: 'Nellore South Railway Station', time: '10 Mins' },
      { label: 'VRC Centre', time: '12 Mins' },
    ],
  },
];

export const PUBLIC_PLOTS: PublicPlot[] = [
  {
    id: 'plot-101',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-01',
    facing: 'EAST',
    areaSqYds: 200,
    dimensions: '36 x 50',
    isCornerPlot: true,
    pricePerSqYd: 18500,
    totalPrice: 3700000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-102',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-02',
    facing: 'EAST',
    areaSqYds: 167,
    dimensions: '30 x 50',
    isCornerPlot: false,
    pricePerSqYd: 18500,
    totalPrice: 3089500,
    status: 'FAST_SELLING',
  },
  {
    id: 'plot-103',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-05',
    facing: 'WEST',
    areaSqYds: 250,
    dimensions: '45 x 50',
    isCornerPlot: true,
    pricePerSqYd: 19000,
    totalPrice: 4750000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-104',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-12',
    facing: 'NORTH',
    areaSqYds: 300,
    dimensions: '45 x 60',
    isCornerPlot: false,
    pricePerSqYd: 18500,
    totalPrice: 5550000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-201',
    projectId: 'proj-2',
    projectName: 'Dream City',
    plotNumber: 'D-14',
    facing: 'EAST',
    areaSqYds: 150,
    dimensions: '30 x 45',
    isCornerPlot: false,
    pricePerSqYd: 12500,
    totalPrice: 1875000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-202',
    projectId: 'proj-2',
    projectName: 'Dream City',
    plotNumber: 'D-15',
    facing: 'EAST',
    areaSqYds: 200,
    dimensions: '36 x 50',
    isCornerPlot: true,
    pricePerSqYd: 13000,
    totalPrice: 2600000,
    status: 'FAST_SELLING',
  },
  {
    id: 'plot-203',
    projectId: 'proj-2',
    projectName: 'Dream City',
    plotNumber: 'D-28',
    facing: 'WEST',
    areaSqYds: 180,
    dimensions: '36 x 45',
    isCornerPlot: false,
    pricePerSqYd: 12500,
    totalPrice: 2250000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-301',
    projectId: 'proj-3',
    projectName: 'ISKON Brundhavanam',
    plotNumber: 'IB-08',
    facing: 'EAST',
    areaSqYds: 267,
    dimensions: '40 x 60',
    isCornerPlot: true,
    pricePerSqYd: 23000,
    totalPrice: 6141000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-302',
    projectId: 'proj-3',
    projectName: 'ISKON Brundhavanam',
    plotNumber: 'IB-09',
    facing: 'NORTH',
    areaSqYds: 350,
    dimensions: '50 x 63',
    isCornerPlot: false,
    pricePerSqYd: 22000,
    totalPrice: 7700000,
    status: 'FAST_SELLING',
  },
  {
    id: 'plot-401',
    projectId: 'proj-4',
    projectName: 'ISKON Elite Township',
    plotNumber: 'IE-10',
    facing: 'EAST',
    areaSqYds: 165,
    dimensions: '33 x 45',
    isCornerPlot: false,
    pricePerSqYd: 16500,
    totalPrice: 2722500,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-402',
    projectId: 'proj-4',
    projectName: 'ISKON Elite Township',
    plotNumber: 'IE-22',
    facing: 'WEST',
    areaSqYds: 220,
    dimensions: '36 x 55',
    isCornerPlot: true,
    pricePerSqYd: 17000,
    totalPrice: 3740000,
    status: 'AVAILABLE',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Venkat Rao',
    designation: 'Senior Physician, Narayana Hospital',
    location: 'Nellore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'I invested in ISKON City - 2 on Podalakur Road. The development quality exceeded expectations, with grand 170ft road entrance and top-tier amenities. Highly recommended developer in Nellore!',
    venturePurchased: 'ISKON City - 2 (Plot #14)',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Suresh & Madhavi Reddy',
    designation: 'Business Entrepreneurs',
    location: 'Mini Bypass, Nellore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'The transparency at ISKON Developers is remarkable. Clear NUDA approvals, prompt documentation, and their team arranged a comfortable AC cab to visit Dream City near Kovuru.',
    venturePurchased: 'Dream City (Plot #09)',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Anand Kumar K.',
    designation: 'NRI Investor',
    location: 'Dallas, Texas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'Being an NRI, hassle-free spot registration and clear title verification were my priorities. ISKON Developers handled everything smoothly with online token reservation.',
    venturePurchased: 'ISKON City - 2 (Plot #28)',
    rating: 5,
  },
];

export const FAQS = [
  {
    question: 'Are all layouts NUDA / DTCP and AP RERA approved?',
    answer: 'Yes, 100% of our ventures have formal approvals from statutory planning authorities (NUDA or DTCP Andhra Pradesh) and are registered under AP RERA with legal title opinions from senior high court advocates.',
  },
  {
    question: 'Do you arrange free cabs for site visits in Nellore?',
    answer: 'Yes! We offer complimentary AC cab pickup and drop service from your home anywhere in Nellore and surrounding areas on both weekdays and weekends with our dedicated fleet.',
  },
  {
    question: 'Are bank loans available for open plots in Nellore?',
    answer: 'Yes, all our ventures are pre-approved by leading financial institutions including SBI, HDFC, ICICI, and Union Bank for plot purchase and construction loans up to 75%.',
  },
  {
    question: 'What is the spot registration procedure?',
    answer: 'Upon payment completion, we facilitate immediate slot booking and spot registration at the respective Nellore / Kovur sub-registrar office along with instant title document handover.',
  },
];
