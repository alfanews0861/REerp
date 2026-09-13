import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  getIdTokenResult,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { getFirebaseInstance } from './config';
import {
  UserProfile,
  UserRole,
  UserKycDetails,
  CadreLevel,
  ReferralLookupResult,
  canAssignCadre,
  canApproveOfficeStaff,
} from '@real-estate-erp/types';

// Built-in Seed/Demo Leaders for instant offline/emulator reference lookup
export const DEMO_REFERRAL_DIRECTORY: Record<string, Omit<ReferralLookupResult, 'valid' | 'code'>> = {
  'REF-DIR-100': {
    sponsorUid: 'usr-dir-100',
    sponsorName: 'Satyadev Varma (Director)',
    sponsorCadre: 'director',
    sponsorRole: 'director',
    sponsorPhone: '+91 98480 11111',
    sponsorBranch: 'Corporate Head Office',
  },
  'REF-CGM-101': {
    sponsorUid: 'usr-cgm-101',
    sponsorName: 'Ramesh Varma (Sr. CGM)',
    sponsorCadre: 'cgm',
    sponsorRole: 'branch_manager',
    sponsorPhone: '+91 98480 12345',
    sponsorBranch: 'Hyderabad Main Hub',
  },
  'REF-GM-102': {
    sponsorUid: 'usr-gm-102',
    sponsorName: 'Vikram Rao (GM)',
    sponsorCadre: 'gm',
    sponsorRole: 'branch_manager',
    sponsorPhone: '+91 98480 34567',
    sponsorBranch: 'Madhapur Branch',
  },
  'REF-SM-103': {
    sponsorUid: 'usr-sm-103',
    sponsorName: 'Priya Sharma (Sales Manager)',
    sponsorCadre: 'sales_manager',
    sponsorRole: 'sales_manager',
    sponsorPhone: '+91 98480 56789',
    sponsorBranch: 'Gachibowli Branch',
  },
  'REF-TL-104': {
    sponsorUid: 'usr-tl-104',
    sponsorName: 'Anand Naidu (Team Leader)',
    sponsorCadre: 'team_lead',
    sponsorRole: 'sales_executive',
    sponsorPhone: '+91 98480 66778',
    sponsorBranch: 'Kukatpally Hub',
  },
};

export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
  const { auth, db } = getFirebaseInstance();
  let unsubscribeDoc: (() => void) | null = null;

  const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (unsubscribeDoc) {
      unsubscribeDoc();
      unsubscribeDoc = null;
    }

    if (!firebaseUser) {
      callback(null);
      return;
    }

    const processUserData = async (data?: any) => {
      try {
        let claims: Record<string, any> = {};
        try {
          const tokenResult = await getIdTokenResult(firebaseUser);
          claims = tokenResult.claims || {};
        } catch {
          claims = {};
        }
        let role = (claims?.role as UserRole) || (data?.role as UserRole);
        let tenantId = (claims?.tenantId as string | undefined) || data?.tenantId;
        let permissions = (claims?.permissions as string[]) || (Array.isArray(data?.permissions) ? data.permissions : []);

        let isProfileCompleted: boolean | undefined = data?.isProfileCompleted;
        let cadre: CadreLevel | undefined = data?.cadre;
        let referralCode: string | undefined = data?.referralCode;
        let referredByCode: string | undefined = data?.referredByCode;
        let referredByUid: string | undefined = data?.referredByUid;
        let referredByName: string | undefined = data?.referredByName;
        let referredByCadre: CadreLevel | undefined = data?.referredByCadre;
        let hierarchyPath: string[] | undefined = data?.hierarchyPath;
        let registrationType: UserProfile['registrationType'] = data?.registrationType;
        let assignedCadreBy: string | undefined = data?.assignedCadreBy;
        let assignedCadreByName: string | undefined = data?.assignedCadreByName;
        let assignedCadreAt: string | undefined = data?.assignedCadreAt;
        let kycDetails: UserProfile['kycDetails'] = data?.kycDetails;
        let status: UserProfile['status'] = data?.status || 'active';

        // Check demo credentials mapping if still unassigned
        if (!role || (role as string) === 'client') {
          const emailLower = (firebaseUser.email || '').toLowerCase();
          if (emailLower === 'admin@reerp.com') {
            role = 'super_admin';
            cadre = 'director';
            isProfileCompleted = true;
          } else if (emailLower === 'manager@reerp.com') {
            role = 'branch_manager';
            cadre = 'gm';
            isProfileCompleted = true;
          } else if (emailLower === 'telecaller@reerp.com') {
            role = 'telecaller';
            cadre = 'office_staff';
            isProfileCompleted = true;
          } else if (emailLower === 'agent@reerp.com') {
            role = 'sales_executive';
            cadre = 'sales_executive';
            isProfileCompleted = true;
          } else {
            role = (data?.role as UserRole) || 'customer';
          }
        }

        // For standard admin/leadership roles, profile is considered complete by default
        if (isProfileCompleted === undefined) {
          isProfileCompleted =
            role === 'super_admin' ||
            role === 'director' ||
            role === 'branch_manager' ||
            role === 'marketing_manager' ||
            role === 'accountant';
        }

        const profile: UserProfile = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName:
            data?.displayName ||
            firebaseUser.displayName ||
            (firebaseUser.email ? firebaseUser.email.split('@')[0] : '') ||
            firebaseUser.phoneNumber ||
            'User',
          phoneNumber: data?.phoneNumber || firebaseUser.phoneNumber || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          role,
          status,
          tenantId,
          permissions,
          cadre,
          registrationType,
          isProfileCompleted,
          referralCode: referralCode || `REF-${firebaseUser.uid.substring(0, 6).toUpperCase()}`,
          referredByCode,
          referredByUid,
          referredByName,
          referredByCadre,
          hierarchyPath,
          assignedCadreBy,
          assignedCadreByName,
          assignedCadreAt,
          kycDetails,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        callback(profile);
      } catch (err) {
        console.warn('Error building user profile in auth listener:', err);
      }
    };

    if (db) {
      try {
        unsubscribeDoc = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              processUserData(docSnap.data());
            } else {
              processUserData(undefined);
            }
          },
          () => {
            processUserData(undefined);
          }
        );
      } catch {
        processUserData(undefined);
      }
    } else {
      processUserData(undefined);
    }
  });

  return () => {
    if (unsubscribeDoc) unsubscribeDoc();
    unsubscribeAuth();
  };
}

/**
 * Validate a Reference/Referral Code in real time against Firestore and seed directory.
 */
export async function lookupReferralCode(code: string): Promise<ReferralLookupResult> {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, code: cleanCode, error: 'Please enter a valid Reference Code' };
  }

  // Check demo directory first for instant matching
  if (DEMO_REFERRAL_DIRECTORY[cleanCode]) {
    const info = DEMO_REFERRAL_DIRECTORY[cleanCode];
    return {
      valid: true,
      code: cleanCode,
      ...info,
    };
  }

  const { db } = getFirebaseInstance();
  if (!db) {
    return { valid: false, code: cleanCode, error: 'Database connection is unavailable' };
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', cleanCode), limit(1));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docData = snap.docs[0].data();
      return {
        valid: true,
        code: cleanCode,
        sponsorUid: docData.uid || snap.docs[0].id,
        sponsorName: docData.displayName || docData.fullName || 'Authorized Leader',
        sponsorCadre: docData.cadre as CadreLevel,
        sponsorRole: docData.role,
        sponsorPhone: docData.phoneNumber || docData.phone,
        sponsorBranch: docData.branch || 'Head Office',
      };
    }

    return {
      valid: false,
      code: cleanCode,
      error: `Reference code "${cleanCode}" was not found. Please check with your manager or use a valid referral code.`,
    };
  } catch {
    return {
      valid: false,
      code: cleanCode,
      error: 'Unable to verify reference code at this moment. Please check connection.',
    };
  }
}

/**
 * Submit and complete first-time user profile registration with reference hierarchy linkage.
 */
export async function completeUserProfile(
  uid: string,
  profileData: {
    displayName: string;
    phoneNumber?: string;
    registrationType: UserProfile['registrationType'];
    referredByCode?: string;
    referredByUid?: string;
    referredByName?: string;
    referredByCadre?: CadreLevel;
    hierarchyPath?: string[];
    kycDetails?: UserProfile['kycDetails'];
  }
): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db || !uid) return;

  const userRef = doc(db, 'users', uid);
  const ownReferralCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

  // Default role and status for newly registered users awaiting cadre assignment
  const defaultRole: UserRole = profileData.registrationType === 'office_staff' ? 'telecaller' : 'sales_executive';

  // Sanitize kycDetails so no field is undefined for Firestore
  const sanitizedKyc = profileData.kycDetails
    ? {
        panNumber: profileData.kycDetails.panNumber || null,
        aadharNumber: profileData.kycDetails.aadharNumber || null,
        city: profileData.kycDetails.city || 'Hyderabad',
        branch: profileData.kycDetails.branch || 'Hyderabad Main Hub',
        bankAccount: profileData.kycDetails.bankAccount || null,
        ifscCode: profileData.kycDetails.ifscCode || null,
      }
    : null;

  await setDoc(
    userRef,
    {
      uid,
      displayName: profileData.displayName,
      phoneNumber: profileData.phoneNumber || null,
      registrationType: profileData.registrationType,
      referredByCode: profileData.referredByCode || null,
      referredByUid: profileData.referredByUid || null,
      referredByName: profileData.referredByName || null,
      referredByCadre: profileData.referredByCadre || null,
      hierarchyPath: profileData.hierarchyPath || (profileData.referredByUid ? [profileData.referredByUid] : []),
      kycDetails: sanitizedKyc,
      isProfileCompleted: true,
      referralCode: ownReferralCode,
      role: defaultRole,
      status: 'pending', // Pending cadre assignment / approval from upline or management
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Assign or update a user's cadre adhering to strict hierarchy level rules.
 * A user can only assign a cadre that is strictly lower in rank than their own.
 * Office staff approval requires Director / Management authorization.
 */
export async function updateUserCadre(
  targetUid: string,
  newCadre: CadreLevel,
  actorUser: UserProfile
): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) throw new Error('Database is unavailable');

  // Verify Office Staff rule
  if (newCadre === 'office_staff') {
    if (!canApproveOfficeStaff(actorUser.role) && !canApproveOfficeStaff(actorUser.cadre)) {
      throw new Error('Office Staff approval requires Management or Director authorization.');
    }
  } else {
    // Verify marketing cadre hierarchy rule
    const actorEffectiveCadre = actorUser.cadre || (actorUser.role === 'director' ? 'director' : actorUser.role === 'super_admin' ? 'director' : 'sales_manager');
    if (!canAssignCadre(actorEffectiveCadre, newCadre)) {
      throw new Error(
        `Hierarchy Authorization Error: As a ${actorEffectiveCadre.toUpperCase()}, you can only assign cadres strictly lower than your own rank.`
      );
    }
  }

  // Map cadre to appropriate system role & compensation profile
  let mappedRole: UserRole = 'sales_executive';
  let isCommissionEligible = true;
  let compensationType: 'SALARY' | 'COMMISSION' = 'COMMISSION';

  if (newCadre === 'director') mappedRole = 'director';
  else if (newCadre === 'cgm' || newCadre === 'gm' || newCadre === 'agm') mappedRole = 'branch_manager';
  else if (newCadre === 'senior_sales_manager' || newCadre === 'sales_manager') mappedRole = 'sales_manager';
  else if (newCadre === 'team_lead' || newCadre === 'sales_executive') mappedRole = 'sales_executive';
  else if (newCadre === 'telecaller') {
    mappedRole = 'telecaller';
    isCommissionEligible = false;
    compensationType = 'SALARY';
  } else if (newCadre === 'office_staff') {
    mappedRole = 'accountant';
    isCommissionEligible = false;
    compensationType = 'SALARY';
  }

  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    cadre: newCadre,
    role: mappedRole,
    status: 'active',
    assignedCadreBy: actorUser.uid,
    assignedCadreByName: actorUser.displayName || 'Manager',
    assignedCadreAt: new Date().toISOString(),
    appointedByUid: actorUser.uid,
    appointedByName: actorUser.displayName || 'Manager',
    compensationType,
    isCommissionEligible,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetch all downline recruits referred directly or down the hierarchy of a manager.
 */
export async function getPendingDownlineRecruits(
  uplineUid: string,
  isDirector: boolean = false
): Promise<UserProfile[]> {
  const { db } = getFirebaseInstance();
  if (!db) return [];

  try {
    const usersRef = collection(db, 'users');
    let q;
    if (isDirector) {
      // Directors / Management can see all pending applicants
      q = query(usersRef, where('status', '==', 'pending'), limit(50));
    } else {
      // Managers see applicants who entered their referral code / UID
      q = query(usersRef, where('referredByUid', '==', uplineUid), limit(50));
    }

    const snap = await getDocs(q);
    const list: UserProfile[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        uid: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || data.fullName || 'New Applicant',
        phoneNumber: data.phoneNumber || data.phone,
        role: data.role || 'sales_executive',
        status: data.status || 'pending',
        cadre: data.cadre,
        registrationType: data.registrationType,
        isProfileCompleted: data.isProfileCompleted,
        referralCode: data.referralCode,
        referredByCode: data.referredByCode,
        referredByUid: data.referredByUid,
        referredByName: data.referredByName,
        referredByCadre: data.referredByCadre,
        permissions: data.permissions || [],
        kycDetails: data.kycDetails,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    return list;
  } catch {
    return [];
  }
}

export async function signOutUser(): Promise<void> {
  const { auth } = getFirebaseInstance();
  await firebaseSignOut(auth);
}

/**
 * Update user's personal profile and KYC details.
 */
export async function updateUserProfileDetails(
  uid: string,
  updates: {
    displayName?: string;
    phoneNumber?: string;
    photoURL?: string;
    kycDetails?: Partial<UserKycDetails>;
  }
): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db || !uid) return;

  const userRef = doc(db, 'users', uid);
  const dataToUpdate: any = {
    updatedAt: serverTimestamp(),
  };

  if (updates.displayName !== undefined) dataToUpdate.displayName = updates.displayName;
  if (updates.phoneNumber !== undefined) dataToUpdate.phoneNumber = updates.phoneNumber || null;
  if (updates.photoURL !== undefined) dataToUpdate.photoURL = updates.photoURL || null;

  if (updates.kycDetails) {
    const existingSnap = await getDoc(userRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : {};
    const currentKyc = existingData?.kycDetails || {};
    dataToUpdate.kycDetails = {
      ...currentKyc,
      ...updates.kycDetails,
    };
  }

  await setDoc(userRef, dataToUpdate, { merge: true });
}


