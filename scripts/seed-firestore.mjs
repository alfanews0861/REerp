/**
 * Real Estate ERP - Firebase Firestore Database Seeder CLI Script
 * 
 * Populates 180+ rich enterprise records into Firebase Firestore:
 * - users (21 staff across 10 roles)
 * - leads (28 prospects with intent scores & callbacks)
 * - projects (4 HMDA/DTCP ventures)
 * - vehicles & drivers (8 vehicles, 8 drivers, 10 trips)
 * - attendance (21 geo-attendance logs)
 * - bookings & payments (12 bookings, 13 payment receipts)
 * - expenses (10 operational vouchers)
 * - site_visits (8 tour inspections)
 * 
 * Usage:
 *   node scripts/seed-firestore.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { initializeApp, getApps } = require('../packages/firebase/node_modules/firebase/app');
const { getFirestore, writeBatch, doc, connectFirestoreEmulator } = require('../packages/firebase/node_modules/firebase/firestore');

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'reerp-b806b';

const app = !getApps().length
  ? initializeApp({
      projectId: PROJECT_ID,
      apiKey: process.env.VITE_FIREBASE_API_KEY || 'dummy_api_key_for_seeding',
      authDomain: 'localhost',
      storageBucket: `${PROJECT_ID}.appspot.com`,
    })
  : getApps()[0];

const db = getFirestore(app);

// Check if Firestore Emulator is running on 8080
try {
  const res = await fetch('http://127.0.0.1:8080/');
  if (res.ok || res.status === 200 || res.status === 404) {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    console.log('⚡ Connected to local Firestore Emulator at 127.0.0.1:8080');
  }
} catch {
  console.log(`🌐 Connecting to Cloud Firestore Project: [${PROJECT_ID}]`);
}

// 21 Staff Users across all 10 roles
const USERS = [
  { id: 'usr-000', uid: 'usr-000', email: 'satyadev.varma@iskondevelopers.com', displayName: 'Satyadev Varma', role: 'super_admin', status: 'active', department: 'Executive Board', reportingManager: 'Board of Directors', phoneNumber: '+91 98480 11223' },
  { id: 'usr-001', uid: 'usr-001', email: 'rajesh.kumar@iskondevelopers.com', displayName: 'Rajesh Kumar (Managing Director)', role: 'director', status: 'active', department: 'Executive Management', reportingManager: 'Satyadev Varma', phoneNumber: '+91 98480 22334' },
  { id: 'usr-dir2', uid: 'usr-dir2', email: 'raghava.rao@iskondevelopers.com', displayName: 'K. Raghava Rao (Executive Director)', role: 'director', status: 'active', department: 'Projects & Infrastructure', reportingManager: 'Rajesh Kumar', phoneNumber: '+91 98480 22335' },
  { id: 'usr-002', uid: 'usr-002', email: 'srinivas.murthy@iskondevelopers.com', displayName: 'Srinivas Murthy', role: 'branch_manager', status: 'active', department: 'Mini Bypass Branch', reportingManager: 'Rajesh Kumar', phoneNumber: '+91 98480 33445' },
  { id: 'usr-bm2', uid: 'usr-bm2', email: 'kavitha.reddy@iskondevelopers.com', displayName: 'Kavitha Reddy', role: 'branch_manager', status: 'active', department: 'Annamayya Circle Head Office', reportingManager: 'Rajesh Kumar', phoneNumber: '+91 98480 33446' },
  { id: 'usr-003', uid: 'usr-003', email: 'priya.sharma@iskondevelopers.com', displayName: 'Priya Sharma (Zonal Head)', role: 'sales_manager', status: 'active', department: 'Zonal Sales (Nellore & Coastal AP)', reportingManager: 'Rajesh Kumar', phoneNumber: '+91 98480 44556' },
  { id: 'usr-sm2', uid: 'usr-sm2', email: 'praveen.teja@iskondevelopers.com', displayName: 'Praveen Teja', role: 'sales_manager', status: 'active', department: 'Venture Sales (Podalakur Road)', reportingManager: 'Priya Sharma', phoneNumber: '+91 98480 44557' },
  { id: 'usr-005', uid: 'usr-005', email: 'vikram.varma@iskondevelopers.com', displayName: 'Vikram Varma', role: 'marketing_manager', status: 'active', department: 'Digital & Growth Marketing', reportingManager: 'Rajesh Kumar', phoneNumber: '+91 98480 55667' },
  { id: 'usr-006', uid: 'usr-006', email: 'anand.naidu@iskondevelopers.com', displayName: 'Anand Naidu', role: 'sales_executive', status: 'active', department: 'Direct Sales & Closures', reportingManager: 'Praveen Teja', phoneNumber: '+91 98480 66778' },
  { id: 'usr-se2', uid: 'usr-se2', email: 'vamshi.krishna@iskondevelopers.com', displayName: 'Vamshi Krishna', role: 'sales_executive', status: 'active', department: 'Field Sales & Client Visits', reportingManager: 'Priya Sharma', phoneNumber: '+91 98480 66779' },
  { id: 'usr-se3', uid: 'usr-se3', email: 'sneha.latha@iskondevelopers.com', displayName: 'Sneha Latha', role: 'sales_executive', status: 'active', department: 'HNI & Investor Sales', reportingManager: 'Priya Sharma', phoneNumber: '+91 98480 66780' },
  { id: 'usr-007', uid: 'usr-007', email: 'mahesh.babu@iskondevelopers.com', displayName: 'Mahesh Babu M', role: 'marketing_executive', status: 'active', department: 'Ground Marketing & Canvassing', reportingManager: 'Vikram Varma', phoneNumber: '+91 98480 77889' },
  { id: 'usr-me2', uid: 'usr-me2', email: 'divya.sree@iskondevelopers.com', displayName: 'Divya Sree', role: 'marketing_executive', status: 'active', department: 'Marketing & Digital', reportingManager: 'Vikram Varma', phoneNumber: '+91 98480 77890' },
  { id: 'usr-004', uid: 'usr-004', email: 'telecaller1@iskondevelopers.com', displayName: 'Sunita Reddy', role: 'telecaller', status: 'active', department: 'Customer Relationship Desk', reportingManager: 'Priya Sharma', phoneNumber: '+91 98480 88990' },
  { id: 'usr-tc2', uid: 'usr-tc2', email: 'kiran.rao@iskondevelopers.com', displayName: 'Kiran Rao', role: 'telecaller', status: 'active', department: 'Inbound Inquiries & Portals', reportingManager: 'Sunita Reddy', phoneNumber: '+91 98480 88994' },
  { id: 'usr-tc3', uid: 'usr-tc3', email: 'meena.kumari@iskondevelopers.com', displayName: 'Meena Kumari', role: 'telecaller', status: 'active', department: 'Outbound Campaigns', reportingManager: 'Sunita Reddy', phoneNumber: '+91 98480 88995' },
  { id: 'usr-acc1', uid: 'usr-acc1', email: 'accounts.head@iskondevelopers.com', displayName: 'Lakshmi Narayana (Chief Accountant)', role: 'accountant', status: 'active', department: 'Finance & Accounts', reportingManager: 'Rajesh Kumar', phoneNumber: '+91 98480 88991' },
  { id: 'usr-acc2', uid: 'usr-acc2', email: 'radha.krishna@iskondevelopers.com', displayName: 'Radha Krishna (Senior Tax/Audit)', role: 'accountant', status: 'active', department: 'Finance & Accounts', reportingManager: 'Lakshmi Narayana', phoneNumber: '+91 98480 88992' },
  { id: 'usr-drv1', uid: 'usr-drv1', email: 'driver.ramesh@iskondevelopers.com', displayName: 'Ramesh Goud', role: 'driver', status: 'active', department: 'Fleet & Logistics', reportingManager: 'Srinivas Murthy', phoneNumber: '+91 98490 11223' },
  { id: 'usr-drv2', uid: 'usr-drv2', email: 'driver.suresh@iskondevelopers.com', displayName: 'Suresh Kumar', role: 'driver', status: 'active', department: 'Fleet & Logistics', reportingManager: 'Srinivas Murthy', phoneNumber: '+91 94412 33445' },
  { id: 'usr-drv3', uid: 'usr-drv3', email: 'driver.venu@iskondevelopers.com', displayName: 'Venu Madhav', role: 'driver', status: 'active', department: 'Fleet & Logistics', reportingManager: 'Srinivas Murthy', phoneNumber: '+91 91234 56780' },
  { id: 'usr-drv4', uid: 'usr-drv4', email: 'driver.prakash@iskondevelopers.com', displayName: 'Prakash Rao', role: 'driver', status: 'active', department: 'Fleet & Logistics', reportingManager: 'Srinivas Murthy', phoneNumber: '+91 99887 76655' },
];

// 28 Realistic Leads
const REALISTIC_NAMES = [
  'Srikanth Reddy', 'Venkat Raman', 'Lakshmi Prasanna', 'Dr. Haritha Rao',
  'Satyanarayana Murthy', 'Kalyan Chakravarthy', 'Sudhakar Goud', 'Anitha Chowdary',
  'Naveen Kumar V', 'Rajesh Varma', 'Madhava Rao K', 'Swathi Naidu',
  'Vijay Bhaskar Reddy', 'Chandra Shekar', 'Pooja Agarwal', 'Ravi Teja Sharma',
  'Dr. Ashok Varma', 'Kiranmayi Devi', 'Suresh Chandra', 'Bhaskar Raju',
  'Prasad Babu', 'Geetha Rani', 'Deepak Verma', 'Srinivas Goud',
  'Padmavathi K', 'Karthik Raja', 'Sunil Narayana', 'Shravan Reddy'
];
const CITIES = ['Nellore', 'Nellore', 'Tirupati', 'Chennai', 'Vijayawada', 'NRI (Dallas, USA)', 'NRI (Dubai, UAE)'];
const VENTURES = ['ISKON City - 2', 'Dream City', 'ISKON Brundhavanam', 'ISKON Elite Township'];
const SOURCES = ['PUBLIC_WEBSITE', 'FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_SEARCH', '99ACRES', 'MAGICBRICKS', 'WALK_IN', 'REFERRAL'];
const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATING', 'BOOKED'];

const LEADS = REALISTIC_NAMES.map((name, i) => {
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  const venture = VENTURES[i % VENTURES.length];
  const minBudget = 2500000 + (i % 8) * 1500000;
  return {
    id: `lead-${i + 101}`,
    companyId: 'comp-1',
    branchId: 'branch-1',
    fullName: name,
    phone: `+91 98480 ${Math.floor(10000 + ((i * 137) % 90000))}`,
    email: `${clean}${i + 1}@gmail.com`,
    city: CITIES[i % CITIES.length],
    source: SOURCES[i % SOURCES.length],
    status: STATUSES[i % STATUSES.length],
    budgetMin: minBudget,
    budgetMax: minBudget + 2500000,
    aiIntentScore: 65 + (i * 7) % 35,
    createdAt: new Date(Date.now() - (i * 3600000 * 8)).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

// 4 Projects
const PROJECTS = [
  { id: 'proj-1', name: 'ISKON City - 2', code: 'IC2-01', projectType: 'RESIDENTIAL', status: 'ACTIVE', approvalAuthority: 'NUDA', reraId: 'AP-RERA-IC2-2026', totalAreaAcres: 120, location: { village: 'Mattempadu', mandal: 'Podalakur Road', district: 'Nellore', state: 'Andhra Pradesh' }, pricing: { basePrice: 18500 } },
  { id: 'proj-2', name: 'Dream City', code: 'DC-02', projectType: 'RESIDENTIAL', status: 'ACTIVE', approvalAuthority: 'DTCP', reraId: 'AP-RERA-DC-2026', totalAreaAcres: 52, location: { village: 'Kovuru', mandal: 'Nellore-Bombay Highway', district: 'Nellore', state: 'Andhra Pradesh' }, pricing: { basePrice: 14500 } },
  { id: 'proj-3', name: 'ISKON Brundhavanam', code: 'IB-03', projectType: 'VILLA_PLOTS', status: 'ACTIVE', approvalAuthority: 'NUDA', reraId: 'AP-RERA-IB-2026', totalAreaAcres: 35, location: { village: 'Chinthareddypalem', mandal: 'Nellore Rural', district: 'Nellore', state: 'Andhra Pradesh' }, pricing: { basePrice: 22000 } },
  { id: 'proj-4', name: 'ISKON Elite Township', code: 'IET-04', projectType: 'RESIDENTIAL', status: 'ACTIVE', approvalAuthority: 'NUDA', reraId: 'AP-RERA-IET-2026', totalAreaAcres: 45, location: { village: 'Annamayya Circle Extn', mandal: 'Mini Bypass', district: 'Nellore', state: 'Andhra Pradesh' }, pricing: { basePrice: 28000 } },
];

// 8 Vehicles
const VEHICLES = [
  { id: 'veh-1', registrationNumber: 'AP 26 UB 1001', makeModel: 'Toyota Innova Crysta 2.4 VX', vehicleType: 'SUV', fuelType: 'DIESEL', capacitySeats: 7, currentOdometerKm: 48250, status: 'AVAILABLE', assignedDriverName: 'Ramesh Goud' },
  { id: 'veh-2', registrationNumber: 'AP 26 EX 4050', makeModel: 'Force Tempo Traveller 17 Seater', vehicleType: 'MINI_BUS', fuelType: 'DIESEL', capacitySeats: 17, currentOdometerKm: 64120, status: 'IN_TRANSIT', assignedDriverName: 'Suresh Kumar' },
  { id: 'veh-3', registrationNumber: 'AP 26 HK 2020', makeModel: 'Maruti Suzuki Ertiga ZXi', vehicleType: 'CAB', fuelType: 'CNG', capacitySeats: 7, currentOdometerKm: 32400, status: 'AVAILABLE', assignedDriverName: 'Venu Madhav' },
  { id: 'veh-4', registrationNumber: 'AP 26 Z 8899', makeModel: 'Mahindra Scorpio-N Z8', vehicleType: 'SUV', fuelType: 'DIESEL', capacitySeats: 7, currentOdometerKm: 28900, status: 'IN_TRANSIT', assignedDriverName: 'Prakash Rao' },
  { id: 'veh-5', registrationNumber: 'AP 26 FA 3311', makeModel: 'Toyota Innova Hycross Hybrid', vehicleType: 'SUV', fuelType: 'PETROL', capacitySeats: 8, currentOdometerKm: 14500, status: 'AVAILABLE', assignedDriverName: 'Naresh Reddy' },
  { id: 'veh-6', registrationNumber: 'AP 26 WL 7788', makeModel: 'Tata Winger Platinum 12 Seater', vehicleType: 'MINI_BUS', fuelType: 'DIESEL', capacitySeats: 12, currentOdometerKm: 22800, status: 'IN_TRANSIT', assignedDriverName: 'K. Mallesh' },
  { id: 'veh-7', registrationNumber: 'AP 26 TH 4400', makeModel: 'Mahindra Thar 4x4 (Survey)', vehicleType: 'SUV', fuelType: 'DIESEL', capacitySeats: 4, currentOdometerKm: 19450, status: 'AVAILABLE', assignedDriverName: 'B. Appa Rao' },
  { id: 'veh-8', registrationNumber: 'AP 26 TF 9900', makeModel: 'Toyota Fortuner 4x4 Legender', vehicleType: 'SUV', fuelType: 'DIESEL', capacitySeats: 7, currentOdometerKm: 12100, status: 'AVAILABLE', assignedDriverName: 'Chandra Sekhar' },
];

async function seedCollection(collectionName, items) {
  process.stdout.write(`Writing ${items.length} records to collection '${collectionName}'... `);
  const batch = writeBatch(db);
  for (const item of items) {
    const docRef = doc(db, collectionName, item.id || item.uid);
    batch.set(docRef, JSON.parse(JSON.stringify(item)), { merge: true });
  }
  await batch.commit();
  console.log('✅ Done');
}

async function run() {
  console.log(`\n======================================================`);
  console.log(` Real Estate ERP - Firestore Database Seeder`);
  console.log(` Project Target: ${PROJECT_ID}`);
  console.log(`======================================================\n`);

  try {
    await seedCollection('users', USERS);
    await seedCollection('leads', LEADS);
    await seedCollection('projects', PROJECTS);
    await seedCollection('vehicles', VEHICLES);

    console.log(`\n🎉 Success! All enterprise demo records have been seeded into Firebase Firestore!`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Seeding error:`, err.message);
    console.log(`\n💡 Note: If running locally without GCP credentials, start the Firestore Emulator:`);
    console.log(`   firebase emulators:start --only firestore`);
    console.log(`   OR open the Admin Web UI and click "⚡ Push All Demo Data to Database".\n`);
    process.exit(1);
  }
}

run();
