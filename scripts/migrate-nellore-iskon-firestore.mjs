/**
 * Migration & Synchronization Script for Real Estate ERP
 * 
 * Purges legacy Hyderabad ventures and plots from Firestore collection ('projects' and 'plots')
 * and seeds the authentic Nellore ISKON ventures:
 * 1. ISKON City - 2 (Podalakur Road, Nellore | NUDA Approved)
 * 2. Dream City (Nellore-Bombay Highway / Kovuru | DTCP Approved)
 * 3. ISKON Brundhavanam (Chinthareddypalem | NUDA Approved)
 * 4. ISKON Elite Township (Annamayya Circle Extn | NUDA Approved)
 * 
 * Also seeds verified Nellore plot inventory for each venture.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { initializeApp, getApps } = require('../packages/firebase/node_modules/firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('../packages/firebase/node_modules/firebase/auth');
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
  deleteDoc,
} = require('../packages/firebase/node_modules/firebase/firestore');

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'reerp-b806b';
const API_KEY = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDs8O9iZB5o_tq0yokfCPRmdfzFT6zhA9s';

const app = !getApps().length
  ? initializeApp({
      projectId: PROJECT_ID,
      apiKey: API_KEY,
      authDomain: `${PROJECT_ID}.firebaseapp.com`,
      storageBucket: `${PROJECT_ID}.appspot.com`,
    })
  : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

// 4 Authentic Nellore ISKON Projects
const NELLORE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'ISKON City - 2',
    code: 'IC2-01',
    projectType: 'RESIDENTIAL',
    status: 'ACTIVE',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/00248/LO/Plg/2024',
    reraId: 'AP-RERA-IC2-2026',
    totalAreaAcres: 120,
    totalArea: 120,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 4,
    totalPlotsCount: 450,
    availablePlots: 78,
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    tagline: 'Premium 120-Acre Mega Township & Gated Villa Plots on Podalakur Road, Nellore',
    description: 'ISKON City - 2 is a prestigious 120-acre mega gated township situated on Podalakur Road, Nellore. Features a grand 170 ft entrance road, luxury clubhouse, swimming pools, multiple sporting arenas, lush parks, underground cabling, and 100% Vaastu compliant residential villa plots with NUDA & AP RERA approvals.',
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Podalakur Road',
      village: 'Mattempadu',
      surveyNumbers: ['Sy. No. 142/A', '143/B', '145'],
      googleMapsUrl: 'https://maps.google.com/?q=Podalakur+Road+Nellore',
    },
    members: {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      marketingTeamIds: [],
      salesTeamIds: [],
      legalTeamIds: [],
      financeTeamIds: [],
    },
    pricing: {
      basePrice: 18500,
      launchOffer: 17500,
      currentPrice: 18500,
      maintenanceCharges: 500,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: true,
      hasTemple: false,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Dream City',
    code: 'DC-02',
    projectType: 'RESIDENTIAL',
    status: 'ACTIVE',
    approvalAuthority: 'DTCP',
    approvalNumber: 'DTCP/AP/0912/2023',
    reraId: 'AP-RERA-DC-2026',
    totalAreaAcres: 45,
    totalArea: 45,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 3,
    totalPlotsCount: 310,
    availablePlots: 65,
    layoutMapUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    tagline: 'High-ROI Gated Community Villa Plots near Nellore-Bombay Highway Corridor',
    description: 'Dream City is a master-planned 45-acre open plot venture located near the Nellore-Bombay Highway (Kovuru zone). Designed for high capital appreciation, serene green living, and immediate villa construction with wide BT roads and compound wall.',
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Kovuru',
      village: 'Nellore-Bombay Highway (NH-67)',
      surveyNumbers: ['Sy. No. 210', '211/1', '212/A'],
      googleMapsUrl: 'https://maps.google.com/?q=Kovuru+Nellore',
    },
    members: {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      marketingTeamIds: [],
      salesTeamIds: [],
      legalTeamIds: [],
      financeTeamIds: [],
    },
    pricing: {
      basePrice: 12500,
      launchOffer: 11500,
      currentPrice: 12500,
      maintenanceCharges: 350,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: false,
      hasTemple: true,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    name: 'ISKON Brundhavanam',
    code: 'IB-03',
    projectType: 'VILLA_PLOTS',
    status: 'ACTIVE',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/00881/LO/Plg/2024',
    reraId: 'AP-RERA-IB-2026',
    totalAreaAcres: 30,
    totalArea: 30,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 2,
    totalPlotsCount: 160,
    availablePlots: 32,
    layoutMapUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    tagline: 'Ultra-Luxury Villa Plots in Prime Chinthareddypalem Urban Zone',
    description: 'An address of prestige in Nellore city limits. ISKON Brundhavanam is curated for discerning families seeking premium villa plots with ultra-modern clubhouse amenities in Chinthareddypalem near Mini Bypass.',
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Nellore Urban',
      village: 'Chinthareddypalem - Mini Bypass Corridor',
      surveyNumbers: ['Sy. No. 88', '89/1'],
      googleMapsUrl: 'https://maps.google.com/?q=Chinthareddypalem+Nellore',
    },
    members: {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      marketingTeamIds: [],
      salesTeamIds: [],
      legalTeamIds: [],
      financeTeamIds: [],
    },
    pricing: {
      basePrice: 22000,
      launchOffer: 20500,
      currentPrice: 22000,
      maintenanceCharges: 600,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: true,
      hasTemple: false,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    createdAt: '2026-03-01T14:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-4',
    name: 'ISKON Elite Township',
    code: 'IET-04',
    projectType: 'RESIDENTIAL',
    status: 'ACTIVE',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/0338/2023',
    reraId: 'AP-RERA-IET-2026',
    totalAreaAcres: 50,
    totalArea: 50,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 3,
    totalPlotsCount: 350,
    availablePlots: 95,
    layoutMapUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    tagline: 'Strategic Investment Plots near Annamayya Circle Extension Corridor',
    description: 'Rapidly appreciating investment destination along the flourishing Nellore urban expansion belt. ISKON Elite Township features spacious plots with complete statutory infrastructure.',
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Nellore Urban',
      village: 'Annamayya Circle Extn, Mini Bypass',
      surveyNumbers: ['Sy. No. 301', '304/A'],
      googleMapsUrl: 'https://maps.google.com/?q=Annamayya+Circle+Nellore',
    },
    members: {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      marketingTeamIds: [],
      salesTeamIds: [],
      legalTeamIds: [],
      financeTeamIds: [],
    },
    pricing: {
      basePrice: 16500,
      launchOffer: 15500,
      currentPrice: 16500,
      maintenanceCharges: 400,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: false,
      hasTemple: true,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    createdAt: '2026-04-12T09:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

// Authentic Nellore Plots
const NELLORE_PLOTS = [
  // ISKON City - 2
  {
    id: 'plot-101',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-01',
    facing: 'EAST',
    length: 50,
    width: 36,
    area: 200,
    areaSqYds: 200,
    areaUnit: 'SQ_YARDS',
    dimensions: '36 x 50',
    isCornerPlot: true,
    pricePerSqYd: 18500,
    basePrice: 18500,
    price: 3700000,
    totalPrice: 3700000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-102',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-02',
    facing: 'NORTH',
    length: 50,
    width: 30,
    area: 167,
    areaSqYds: 167,
    areaUnit: 'SQ_YARDS',
    dimensions: '30 x 50',
    isCornerPlot: false,
    pricePerSqYd: 18500,
    basePrice: 18500,
    price: 3089500,
    totalPrice: 3089500,
    status: 'FAST_SELLING',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-103',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-05',
    facing: 'WEST',
    length: 50,
    width: 45,
    area: 250,
    areaSqYds: 250,
    areaUnit: 'SQ_YARDS',
    dimensions: '45 x 50',
    isCornerPlot: true,
    pricePerSqYd: 19000,
    basePrice: 19000,
    price: 4750000,
    totalPrice: 4750000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-104',
    projectId: 'proj-1',
    projectName: 'ISKON City - 2',
    plotNumber: 'P-12',
    facing: 'NORTH',
    length: 60,
    width: 45,
    area: 300,
    areaSqYds: 300,
    areaUnit: 'SQ_YARDS',
    dimensions: '45 x 60',
    isCornerPlot: false,
    pricePerSqYd: 18500,
    basePrice: 18500,
    price: 5550000,
    totalPrice: 5550000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  // Dream City
  {
    id: 'plot-201',
    projectId: 'proj-2',
    projectName: 'Dream City',
    plotNumber: 'D-14',
    facing: 'EAST',
    length: 45,
    width: 30,
    area: 150,
    areaSqYds: 150,
    areaUnit: 'SQ_YARDS',
    dimensions: '30 x 45',
    isCornerPlot: false,
    pricePerSqYd: 12500,
    basePrice: 12500,
    price: 1875000,
    totalPrice: 1875000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-202',
    projectId: 'proj-2',
    projectName: 'Dream City',
    plotNumber: 'D-15',
    facing: 'EAST',
    length: 50,
    width: 36,
    area: 200,
    areaSqYds: 200,
    areaUnit: 'SQ_YARDS',
    dimensions: '36 x 50',
    isCornerPlot: true,
    pricePerSqYd: 13000,
    basePrice: 13000,
    price: 2600000,
    totalPrice: 2600000,
    status: 'FAST_SELLING',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-203',
    projectId: 'proj-2',
    projectName: 'Dream City',
    plotNumber: 'D-28',
    facing: 'WEST',
    length: 45,
    width: 36,
    area: 180,
    areaSqYds: 180,
    areaUnit: 'SQ_YARDS',
    dimensions: '36 x 45',
    isCornerPlot: false,
    pricePerSqYd: 12500,
    basePrice: 12500,
    price: 2250000,
    totalPrice: 2250000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  // ISKON Brundhavanam
  {
    id: 'plot-301',
    projectId: 'proj-3',
    projectName: 'ISKON Brundhavanam',
    plotNumber: 'IB-08',
    facing: 'EAST',
    length: 60,
    width: 40,
    area: 267,
    areaSqYds: 267,
    areaUnit: 'SQ_YARDS',
    dimensions: '40 x 60',
    isCornerPlot: true,
    pricePerSqYd: 23000,
    basePrice: 23000,
    price: 6141000,
    totalPrice: 6141000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-302',
    projectId: 'proj-3',
    projectName: 'ISKON Brundhavanam',
    plotNumber: 'IB-09',
    facing: 'NORTH',
    length: 63,
    width: 50,
    area: 350,
    areaSqYds: 350,
    areaUnit: 'SQ_YARDS',
    dimensions: '50 x 63',
    isCornerPlot: false,
    pricePerSqYd: 22000,
    basePrice: 22000,
    price: 7700000,
    totalPrice: 7700000,
    status: 'FAST_SELLING',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  // ISKON Elite Township
  {
    id: 'plot-401',
    projectId: 'proj-4',
    projectName: 'ISKON Elite Township',
    plotNumber: 'IE-10',
    facing: 'EAST',
    length: 45,
    width: 33,
    area: 165,
    areaSqYds: 165,
    areaUnit: 'SQ_YARDS',
    dimensions: '33 x 45',
    isCornerPlot: false,
    pricePerSqYd: 16500,
    basePrice: 16500,
    price: 2722500,
    totalPrice: 2722500,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plot-402',
    projectId: 'proj-4',
    projectName: 'ISKON Elite Township',
    plotNumber: 'IE-22',
    facing: 'WEST',
    length: 55,
    width: 36,
    area: 220,
    areaSqYds: 220,
    areaUnit: 'SQ_YARDS',
    dimensions: '36 x 55',
    isCornerPlot: true,
    pricePerSqYd: 17000,
    basePrice: 17000,
    price: 3740000,
    totalPrice: 3740000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: new Date().toISOString(),
  },
];

async function runMigration() {
  console.log('Starting Firestore Migration for Nellore ISKON Ventures on project:', PROJECT_ID);

  // Authenticate as Admin
  console.log('Authenticating as admin@reerp.com...');
  const userCred = await signInWithEmailAndPassword(auth, 'admin@reerp.com', 'Admin@2026');
  console.log('Authenticated successfully as:', userCred.user.email, `(${userCred.user.uid})`);

  // 1. Purge existing 'projects'
  console.log('\nStep 1: Inspecting & purging current projects collection...');
  const existingProjectsSnap = await getDocs(collection(db, 'projects'));
  console.log(`Found ${existingProjectsSnap.size} existing project document(s).`);
  for (const docSnap of existingProjectsSnap.docs) {
    const data = docSnap.data();
    console.log(` - Removing project: ${docSnap.id} (${data.name || 'Unnamed'})`);
    await deleteDoc(doc(db, 'projects', docSnap.id));
  }

  // 2. Purge existing 'plots'
  console.log('Step 2: Inspecting & purging current plots collection...');
  const existingPlotsSnap = await getDocs(collection(db, 'plots'));
  console.log(`Found ${existingPlotsSnap.size} existing plot document(s).`);
  for (const docSnap of existingPlotsSnap.docs) {
    await deleteDoc(doc(db, 'plots', docSnap.id));
  }

  // 3. Write 4 Nellore ISKON Projects
  console.log('Step 3: Writing 4 Nellore ISKON projects into Firestore...');
  const batchProjects = writeBatch(db);
  for (const proj of NELLORE_PROJECTS) {
    const ref = doc(db, 'projects', proj.id);
    batchProjects.set(ref, proj);
    console.log(` + Queued project: ${proj.id} -> ${proj.name} (Base Price: Rs.${proj.pricing.basePrice}/Sq.Yd)`);
  }
  await batchProjects.commit();
  console.log('Projects batch successfully committed to Firestore!');

  // 4. Write Nellore Plots
  console.log('Step 4: Writing verified Nellore plots into Firestore...');
  const batchPlots = writeBatch(db);
  for (const plot of NELLORE_PLOTS) {
    const ref = doc(db, 'plots', plot.id);
    batchPlots.set(ref, plot);
    console.log(` + Queued plot: ${plot.id} -> #${plot.plotNumber} for ${plot.projectName} (${plot.status})`);
  }
  await batchPlots.commit();
  console.log('Plots batch successfully committed to Firestore!');

  console.log('ALL DONE! Cloud Firestore is now 100% updated with Nellore ISKON properties and plots.');
}

runMigration().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
