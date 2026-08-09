import * as admin from 'firebase-admin';

export class KPIRefs {
  /**
   * Returns standard document IDs for dimensional isolation.
   * e.g., 'company123_global', 'company123_project_xyz', 'company123_daily_2026-08-09'
   */
  static getCompanyGlobalRef(db: admin.firestore.Firestore, companyId: string) {
    return db.collection('dashboard_kpis').doc(`${companyId}_global`);
  }

  static getProjectRef(db: admin.firestore.Firestore, companyId: string, projectId: string) {
    return db.collection('dashboard_kpis').doc(`${companyId}_project_${projectId}`);
  }

  static getDailyRef(db: admin.firestore.Firestore, companyId: string, dateIsoString: string) {
    const dateStr = dateIsoString.split('T')[0];
    return db.collection('dashboard_kpis').doc(`${companyId}_daily_${dateStr}`);
  }

  static getProjectDailyRef(db: admin.firestore.Firestore, companyId: string, projectId: string, dateIsoString: string) {
    const dateStr = dateIsoString.split('T')[0];
    return db.collection('dashboard_kpis').doc(`${companyId}_project_${projectId}_daily_${dateStr}`);
  }

  static getBranchRef(db: admin.firestore.Firestore, companyId: string, branchId: string) {
    return db.collection('dashboard_kpis').doc(`${companyId}_branch_${branchId}`);
  }
}
