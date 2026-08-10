"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPIRefs = void 0;
class KPIRefs {
    /**
     * Returns standard document IDs for dimensional isolation.
     * e.g., 'company123_global', 'company123_project_xyz', 'company123_daily_2026-08-09'
     */
    static getCompanyGlobalRef(db, companyId) {
        return db.collection('dashboard_kpis').doc(`${companyId}_global`);
    }
    static getProjectRef(db, companyId, projectId) {
        return db.collection('dashboard_kpis').doc(`${companyId}_project_${projectId}`);
    }
    static getDailyRef(db, companyId, dateIsoString) {
        const dateStr = dateIsoString.split('T')[0];
        return db.collection('dashboard_kpis').doc(`${companyId}_daily_${dateStr}`);
    }
    static getProjectDailyRef(db, companyId, projectId, dateIsoString) {
        const dateStr = dateIsoString.split('T')[0];
        return db.collection('dashboard_kpis').doc(`${companyId}_project_${projectId}_daily_${dateStr}`);
    }
    static getBranchRef(db, companyId, branchId) {
        return db.collection('dashboard_kpis').doc(`${companyId}_branch_${branchId}`);
    }
}
exports.KPIRefs = KPIRefs;
//# sourceMappingURL=KPIRefs.js.map