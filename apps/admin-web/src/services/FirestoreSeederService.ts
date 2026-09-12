import { collection, doc, writeBatch } from 'firebase/firestore';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { DEFAULT_STAFF_USERS } from '../pages/administration/UserManagementWorkspace';
import { SEED_ATTENDANCE } from '../pages/employees/AttendanceWorkspace';
import { SEED_DRIVERS, SEED_VEHICLES, SEED_TRIPS } from '../pages/vehicles/VehiclesWorkspace';
import { SEED_BOOKINGS } from '../pages/sales/BookingsWorkspace';
import { SEED_PAYMENTS } from '../pages/finance/PaymentsWorkspace';
import { SEED_EXPENSES } from '../pages/expenses/ExpensesWorkspace';
import { SEED_PROJECTS } from '../pages/projects/ProjectsWorkspace';
import { SEED_PLOTS } from '../pages/plots/PlotInventory';
import { initialMembers } from '../pages/marketing/network/NetworkMembersPage';
import { initialLedger } from '../pages/marketing/commission/CommissionLedgerPage';
import { SEED_SITE_VISITS } from '@real-estate-erp/hooks';

// Generate 28 high-intent realistic leads
const REALISTIC_NAMES = [
  'Srikanth Reddy', 'Venkat Raman', 'Lakshmi Prasanna', 'Dr. Haritha Rao',
  'Satyanarayana Murthy', 'Kalyan Chakravarthy', 'Sudhakar Goud', 'Anitha Chowdary',
  'Naveen Kumar V', 'Rajesh Varma', 'Madhava Rao K', 'Swathi Naidu',
  'Vijay Bhaskar Reddy', 'Chandra Shekar', 'Pooja Agarwal', 'Ravi Teja Sharma',
  'Dr. Ashok Varma', 'Kiranmayi Devi', 'Suresh Chandra', 'Bhaskar Raju',
  'Prasad Babu', 'Geetha Rani', 'Deepak Verma', 'Srinivas Goud',
  'Padmavathi K', 'Karthik Raja', 'Sunil Narayana', 'Shravan Reddy'
];

const CITIES = ['Hyderabad', 'Hyderabad', 'Bangalore', 'Vijayawada', 'Visakhapatnam', 'NRI (Dallas, USA)', 'NRI (Dubai, UAE)'];
const VENTURES = ['Sunrise Enclave (Mokila)', 'Green Valley Phase 2 (Shadnagar)', 'Palm County (Kollur)', 'Royal Meadows (Shankarpally)'];
const SOURCES = ['PUBLIC_WEBSITE', 'FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_SEARCH', '99ACRES', 'MAGICBRICKS', 'WALK_IN', 'REFERRAL'];
const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATING', 'BOOKED'];

export interface SeedProgressCallback {
  (progress: { message: string; current: number; total: number; collectionName: string }): void;
}

export interface SeedResult {
  success: boolean;
  totalDocuments: number;
  collectionsSeeded: Record<string, number>;
  error?: string;
}

export class FirestoreSeederService {
  /**
   * Generates realistic lead records for database seeding
   */
  static generateLeads() {
    return REALISTIC_NAMES.map((name, i) => {
      const id = `lead-${i + 101}`;
      const clean = name.toLowerCase().replace(/[^a-z]/g, '');
      const venture = VENTURES[i % VENTURES.length];
      const minBudget = 2500000 + (i % 8) * 1500000;
      const maxBudget = minBudget + 2000000 + (i % 5) * 1000000;
      const intentScore = 65 + (i * 7) % 35;

      return {
        id,
        companyId: 'comp-1',
        branchId: 'branch-1',
        fullName: name,
        phone: `+91 98480 ${Math.floor(10000 + ((i * 137) % 90000))}`,
        email: `${clean}${i + 1}@gmail.com`,
        city: CITIES[i % CITIES.length],
        source: SOURCES[i % SOURCES.length],
        status: STATUSES[i % STATUSES.length],
        budgetMin: minBudget,
        budgetMax: maxBudget,
        aiIntentScore: intentScore,
        aiRecommendation: intentScore > 80 
          ? `High purchase intent for ${venture}. Interested in 200-267 Sq Yds East facing plot.`
          : `Interested in long-term appreciation in ${venture}. Follow up for weekend site visit.`,
        followUps: [
          {
            id: `fup-${i}-1`,
            type: 'CALL',
            notes: `Schedule callback regarding corner plot availability in ${venture}.`,
            disposition: 'INTERESTED',
            nextFollowUpDate: new Date(Date.now() + 86400000).toISOString(),
            createdByUserId: 'usr-15',
            createdByUserName: 'Sunita Reddy',
            createdAt: new Date().toISOString(),
          }
        ],
        createdAt: new Date(Date.now() - (i * 3600000 * 8)).toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  /**
   * Pushes all enterprise seed datasets directly into Firebase Firestore collections
   */
  static async seedAll(onProgress?: SeedProgressCallback): Promise<SeedResult> {
    const { db } = getFirebaseInstance();
    if (!db) {
      throw new Error('Firebase Firestore instance is not initialized. Please verify your Firebase configuration.');
    }

    const leads = this.generateLeads();

    const datasets: { name: string; items: any[] }[] = [
      { name: 'users', items: DEFAULT_STAFF_USERS },
      { name: 'attendance', items: SEED_ATTENDANCE },
      { name: 'drivers', items: SEED_DRIVERS },
      { name: 'vehicles', items: SEED_VEHICLES },
      { name: 'vehicle_trips', items: SEED_TRIPS },
      { name: 'projects', items: SEED_PROJECTS },
      { name: 'plots', items: SEED_PLOTS },
      { name: 'bookings', items: SEED_BOOKINGS },
      { name: 'payments', items: SEED_PAYMENTS },
      { name: 'expenses', items: SEED_EXPENSES },
      { name: 'site_visits', items: SEED_SITE_VISITS },
      { name: 'network_members', items: initialMembers },
      { name: 'commission_records', items: initialLedger },
      { name: 'leads', items: leads },
    ];

    const totalSteps = datasets.reduce((acc, d) => acc + d.items.length, 0);
    let processed = 0;
    const collectionsSeeded: Record<string, number> = {};

    try {
      for (const dataset of datasets) {
        onProgress?.({
          message: `Writing ${dataset.items.length} records to Firestore collection "${dataset.name}"...`,
          current: processed,
          total: totalSteps,
          collectionName: dataset.name,
        });

        // Batch in chunks of up to 400 (Firestore max is 500)
        const chunkSize = 400;
        for (let i = 0; i < dataset.items.length; i += chunkSize) {
          const chunk = dataset.items.slice(i, i + chunkSize);
          const batch = writeBatch(db);

          for (const item of chunk) {
            const docId = String(item.id || item.uid || `doc-${Date.now()}`);
            const docRef = doc(collection(db, dataset.name), docId);
            
            // Clean undefined values before writing to Firestore
            const sanitized = JSON.parse(JSON.stringify(item));
            batch.set(docRef, sanitized, { merge: true });
          }

          await batch.commit();
          processed += chunk.length;
        }

        collectionsSeeded[dataset.name] = dataset.items.length;
      }

      onProgress?.({
        message: `Successfully seeded all ${totalSteps} records into Firestore!`,
        current: totalSteps,
        total: totalSteps,
        collectionName: 'completed',
      });

      return {
        success: true,
        totalDocuments: totalSteps,
        collectionsSeeded,
      };
    } catch (err: any) {
      console.error('Error during Firestore database seeding:', err);
      return {
        success: false,
        totalDocuments: processed,
        collectionsSeeded,
        error: err?.message || 'Failed to seed database records',
      };
    }
  }
}
