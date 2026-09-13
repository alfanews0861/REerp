export interface PublicVenture {
  id: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  state: string;
  approvalAuthority: 'HMDA' | 'DTCP' | 'RERA';
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
  status: 'AVAILABLE' | 'FAST_SELLING' | 'BOOKED' | 'REGISTERED';
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
    name: 'Sunrise Enclave - Mokila',
    tagline: 'Premium HMDA & RERA Gated Community Open Plots near Shankarpally & Financial District',
    location: 'Mokila - Shankarpally Main Road, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalAuthority: 'HMDA',
    approvalNumber: 'HMDA/00248/LO/Plg/2024',
    reraId: 'P02400007891',
    totalAreaAcres: 25.5,
    totalPlots: 180,
    availablePlots: 42,
    basePricePerSqYd: 26500,
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'Strategically located along the high-growth western corridor of Hyderabad, Sunrise Enclave offers luxury residential villa plots equipped with world-class gated community infrastructure, underground cabling, avenue plantation, and landscaped parks.',
    featured: true,
    amenities: [
      '40 & 33 Feet BT Roads',
      'Underground Drainage & STP',
      '24/7 Water Supply with Overhead Tank',
      'Underground Electricity & Solar Street Lights',
      'Grand Entrance Arch with 24/7 Security',
      'Clubhouse with Swimming Pool',
      'Children Play Area & Walking Tracks',
      '100% Vaastu Compliant',
    ],
    highlights: [
      'Adjacent to 100ft Shankarpally-Mokila Highway',
      '20 Mins drive to Financial District & Neopolis Kokapet',
      'Surrounded by top international schools (Indus, Gaudium)',
      'Clear legal title with spot registration & bank loans',
    ],
    connectivity: [
      { label: 'Neopolis Kokapet', time: '18 Mins' },
      { label: 'Financial District / Wipro Circle', time: '22 Mins' },
      { label: 'Outer Ring Road (Exit 1)', time: '12 Mins' },
      { label: 'Shankarpally Railway Station', time: '8 Mins' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Greenfield Meadows - Shadnagar',
    tagline: 'High-ROI DTCP Approved Township near Bangalore Highway & Upcoming Regional Ring Road (RRR)',
    location: 'Bangalore Highway (NH-44), Shadnagar, Hyderabad',
    city: 'Shadnagar',
    state: 'Telangana',
    approvalAuthority: 'DTCP',
    approvalNumber: 'DTCP/TS/0912/2023',
    reraId: 'P02400006542',
    totalAreaAcres: 42.0,
    totalPlots: 320,
    availablePlots: 88,
    basePricePerSqYd: 13500,
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'Greenfield Meadows is a master-planned 42-acre open plot venture located in Shadnagar right beside the fast-paced Hyderabad-Bangalore National Highway corridor. Ideal for long-term wealth creation and immediate construction.',
    featured: true,
    amenities: [
      '60, 40 & 33 Feet Black Top Roads',
      'Compound Wall around entire venture',
      'Avenue Plantation with drip irrigation',
      'Modern Overhead Water Storage',
      'Parks with Designer Gazebos',
      'CCTV Surveillance at Gate',
    ],
    highlights: [
      '5 Mins from Shadnagar MMTS & Bus Terminal',
      'Near Microsoft & Amazon Data Centers',
      'Very close to proposed Regional Ring Road (RRR)',
      '100% Clear Title with Patta Passbook issuance',
    ],
    connectivity: [
      { label: 'Rajiv Gandhi Int. Airport (RGIA)', time: '25 Mins' },
      { label: 'Regional Ring Road Junction', time: '10 Mins' },
      { label: 'Shadnagar Town & Market', time: '5 Mins' },
      { label: 'Gachibowli Junction', time: '40 Mins' },
    ],
  },
  {
    id: 'proj-3',
    name: 'Royal Palms Elite - Kollur ORR',
    tagline: 'Ultra-Luxury Villa Plots right beside Nehru Outer Ring Road (ORR Exit 2)',
    location: 'Kollur - Tellapur Growth Hub, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalAuthority: 'HMDA',
    approvalNumber: 'HMDA/00881/LO/Plg/2024',
    reraId: 'P02400009115',
    totalAreaAcres: 18.2,
    totalPlots: 120,
    availablePlots: 24,
    basePricePerSqYd: 41000,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'An address of prestige. Royal Palms Elite at Kollur is designed for high-net-worth investors seeking premium villa plots in an urban setting moments away from Tellapur and Gachibowli.',
    featured: true,
    amenities: [
      '50 & 40 Feet Interlocking Paver Roads',
      'Full Underground Cabling (Power, Fiber, Gas)',
      'Designer Landscaping & Zen Gardens',
      'Air-conditioned Clubhouse & Gym',
      'Tennis & Pickleball Courts',
      'Solar Powered Perimeter Fencing',
    ],
    highlights: [
      'Direct service road access to Outer Ring Road (Exit 2)',
      '10 minutes to Financial District IT campuses',
      'Surrounded by premium gated villa communities',
      'Immediate construction approval with spot registry',
    ],
    connectivity: [
      { label: 'Outer Ring Road (ORR Exit 2)', time: '2 Mins' },
      { label: 'Financial District', time: '12 Mins' },
      { label: 'Tellapur Technopark', time: '6 Mins' },
      { label: 'Continental Hospital', time: '15 Mins' },
    ],
  },
  {
    id: 'proj-4',
    name: 'Aerocity Smart Town - Srisailam Hwy',
    tagline: 'Strategic Investment Plots near Hyderabad Pharma City & Electronic City',
    location: 'Kadthal - Srisailam Highway, Hyderabad South',
    city: 'Kadthal',
    state: 'Telangana',
    approvalAuthority: 'DTCP',
    approvalNumber: 'DTCP/TS/0338/2023',
    reraId: 'P02400005432',
    totalAreaAcres: 50.0,
    totalPlots: 410,
    availablePlots: 115,
    basePricePerSqYd: 11000,
    heroImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    ],
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    description: 'Rapidly appreciating investment destination along the South Hyderabad expansion zone. Aerocity Smart Town features spacious plots nestled near upcoming aerospace and pharmaceutical corridors.',
    featured: false,
    amenities: [
      '40 & 33 Feet Wide Black Top Roads',
      'Electricity with Transformer & Street Lights',
      'Children Play Area with Lush Green Parks',
      'Round the clock Security and Gated Boundary',
      'Water connections for every plot',
    ],
    highlights: [
      'On 6-lane Srisailam Highway corridor',
      '15 Mins to proposed 19,000-acre Hyderabad Pharma City',
      'Close to FAB City and Hardware Park',
      'High appreciation potential with low entry cost',
    ],
    connectivity: [
      { label: 'Pharma City Hub', time: '15 Mins' },
      { label: 'TCS Adibatla', time: '20 Mins' },
      { label: 'RGIA Airport', time: '22 Mins' },
      { label: 'Tukkuguda ORR Exit', time: '18 Mins' },
    ],
  },
];

export const PUBLIC_PLOTS: PublicPlot[] = [
  {
    id: 'plot-101',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave - Mokila',
    plotNumber: 'P-01',
    facing: 'EAST',
    areaSqYds: 200,
    dimensions: '36 x 50',
    isCornerPlot: true,
    pricePerSqYd: 26500,
    totalPrice: 5300000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-102',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave - Mokila',
    plotNumber: 'P-02',
    facing: 'EAST',
    areaSqYds: 167,
    dimensions: '30 x 50',
    isCornerPlot: false,
    pricePerSqYd: 26500,
    totalPrice: 4425500,
    status: 'FAST_SELLING',
  },
  {
    id: 'plot-103',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave - Mokila',
    plotNumber: 'P-05',
    facing: 'WEST',
    areaSqYds: 250,
    dimensions: '45 x 50',
    isCornerPlot: true,
    pricePerSqYd: 27000,
    totalPrice: 6750000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-104',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave - Mokila',
    plotNumber: 'P-12',
    facing: 'NORTH',
    areaSqYds: 300,
    dimensions: '45 x 60',
    isCornerPlot: false,
    pricePerSqYd: 26500,
    totalPrice: 7950000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-105',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave - Mokila',
    plotNumber: 'P-18',
    facing: 'SOUTH',
    areaSqYds: 180,
    dimensions: '36 x 45',
    isCornerPlot: false,
    pricePerSqYd: 26500,
    totalPrice: 4770000,
    status: 'BOOKED',
  },
  {
    id: 'plot-201',
    projectId: 'proj-2',
    projectName: 'Greenfield Meadows - Shadnagar',
    plotNumber: 'G-14',
    facing: 'EAST',
    areaSqYds: 150,
    dimensions: '30 x 45',
    isCornerPlot: false,
    pricePerSqYd: 13500,
    totalPrice: 2025000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-202',
    projectId: 'proj-2',
    projectName: 'Greenfield Meadows - Shadnagar',
    plotNumber: 'G-15',
    facing: 'EAST',
    areaSqYds: 200,
    dimensions: '36 x 50',
    isCornerPlot: true,
    pricePerSqYd: 14000,
    totalPrice: 2800000,
    status: 'FAST_SELLING',
  },
  {
    id: 'plot-203',
    projectId: 'proj-2',
    projectName: 'Greenfield Meadows - Shadnagar',
    plotNumber: 'G-28',
    facing: 'WEST',
    areaSqYds: 180,
    dimensions: '36 x 45',
    isCornerPlot: false,
    pricePerSqYd: 13500,
    totalPrice: 2430000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-204',
    projectId: 'proj-2',
    projectName: 'Greenfield Meadows - Shadnagar',
    plotNumber: 'G-35',
    facing: 'NORTH',
    areaSqYds: 220,
    dimensions: '36 x 55',
    isCornerPlot: false,
    pricePerSqYd: 13500,
    totalPrice: 2970000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-301',
    projectId: 'proj-3',
    projectName: 'Royal Palms Elite - Kollur ORR',
    plotNumber: 'RP-08',
    facing: 'EAST',
    areaSqYds: 267,
    dimensions: '40 x 60',
    isCornerPlot: true,
    pricePerSqYd: 42000,
    totalPrice: 11214000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-302',
    projectId: 'proj-3',
    projectName: 'Royal Palms Elite - Kollur ORR',
    plotNumber: 'RP-09',
    facing: 'NORTH',
    areaSqYds: 350,
    dimensions: '50 x 63',
    isCornerPlot: false,
    pricePerSqYd: 41000,
    totalPrice: 14350000,
    status: 'FAST_SELLING',
  },
  {
    id: 'plot-303',
    projectId: 'proj-3',
    projectName: 'Royal Palms Elite - Kollur ORR',
    plotNumber: 'RP-15',
    facing: 'WEST',
    areaSqYds: 200,
    dimensions: '36 x 50',
    isCornerPlot: false,
    pricePerSqYd: 41000,
    totalPrice: 8200000,
    status: 'BOOKED',
  },
  {
    id: 'plot-401',
    projectId: 'proj-4',
    projectName: 'Aerocity Smart Town - Srisailam Hwy',
    plotNumber: 'A-10',
    facing: 'EAST',
    areaSqYds: 165,
    dimensions: '33 x 45',
    isCornerPlot: false,
    pricePerSqYd: 11000,
    totalPrice: 1815000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-402',
    projectId: 'proj-4',
    projectName: 'Aerocity Smart Town - Srisailam Hwy',
    plotNumber: 'A-22',
    facing: 'WEST',
    areaSqYds: 220,
    dimensions: '36 x 55',
    isCornerPlot: true,
    pricePerSqYd: 11500,
    totalPrice: 2530000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-403',
    projectId: 'proj-4',
    projectName: 'Aerocity Smart Town - Srisailam Hwy',
    plotNumber: 'A-31',
    facing: 'NORTH',
    areaSqYds: 150,
    dimensions: '30 x 45',
    isCornerPlot: false,
    pricePerSqYd: 11000,
    totalPrice: 1650000,
    status: 'FAST_SELLING',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Venkat Rao',
    designation: 'Senior Cardiologist, Apollo Hospitals',
    location: 'Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'I invested in Sunrise Enclave Mokila. The development quality exceeded expectations, from wide BT roads to underground cabling. Land value has appreciated 40%!',
    venturePurchased: 'Sunrise Enclave (Plot #14)',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Suresh & Madhavi Reddy',
    designation: 'IT Leaders, Microsoft & Google',
    location: 'Tellapur, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: '100% legal transparency with instant DTCP & HMDA documents provided. The complimentary AC cab site visit service was very convenient for our family.',
    venturePurchased: 'Royal Palms Elite (Plot #09)',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Anand Kumar K.',
    designation: 'NRI Investor',
    location: 'Dallas, Texas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'Hassle-free spot registration and clear title passbook issuance were my top priorities. The CRM team handled everything seamlessly.',
    venturePurchased: 'Greenfield Meadows Shadnagar (Plot #28)',
    rating: 5,
  },
];

export const PUBLIC_FAQS = [
  {
    question: 'Are all ventures DTCP / HMDA and RERA approved?',
    questionTe: 'అన్ని లేఅవుట్‌లు HMDA / DTCP మరియు RERA ఆమోదం పొందాయా?',
    answer: 'Yes, 100% of our ventures have formal approvals from statutory planning authorities (HMDA or DTCP) and are registered under Telangana RERA with legal title opinions from senior high court advocates.',
    answerTe: 'అవును, మా అన్ని ప్రాజెక్టులు HMDA లేదా DTCP మరియు తెలంగాణ RERA ద్వారా 100% క్లియర్ టైటిల్‌తో ఆమోదించబడ్డాయి.',
  },
  {
    question: 'Do you arrange free cabs for site visits?',
    questionTe: 'సైట్ విజిట్ కొరకు ఉచిత క్యాబ్ సౌకర్యం ఉందా?',
    answer: 'Yes! We offer complimentary AC cab pickup and drop service from your home anywhere in Hyderabad/Secunderabad on both weekdays and weekends.',
    answerTe: 'అవును! హైదరాబాద్ / సికింద్రాబాద్‌లో మీ ఇంటి నుండే ఉచిత ఏసీ క్యాబ్ పికప్ & డ్రాప్ సౌకర్యం కల్పిస్తున్నాము.',
  },
  {
    question: 'Are bank loans available for open plots?',
    questionTe: 'ఓపెన్ ప్లాట్ల కొరకు బ్యాంక్ లోన్స్ లభిస్తాయా?',
    answer: 'Yes, all our ventures are pre-approved by leading financial institutions including SBI, HDFC, ICICI, and Axis Bank for plot purchase loans up to 75%.',
    answerTe: 'అవును, SBI, HDFC, ICICI మరియు Axis బ్యాంకుల ద్వారా 75% వరకు ప్లాట్ లోన్స్ అందుబాటులో ఉన్నాయి.',
  },
  {
    question: 'How does the 48-Hour Token Hold work?',
    questionTe: '48 గంటల టోకెన్ హోల్డ్ ఎలా పనిచేస్తుంది?',
    answer: 'You can freeze the plot price for 48 hours with a 100% refundable token advance. If you decide not to proceed, the full amount is refunded within 24 hours.',
    answerTe: 'కేవలం చిన్న టోకెన్ అడ్వాన్స్‌తో 48 గంటల పాటు ప్లాట్ ధరను లాక్ చేసుకోవచ్చు. నచ్చకపోతే 100% డబ్బులు 24 గంటల్లో వాపస్ చేయబడతాయి.',
  },
];
