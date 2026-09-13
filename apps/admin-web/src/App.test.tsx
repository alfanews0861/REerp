import { describe, it, expect } from 'vitest';
import {
  canAssignCadre,
  getAllowedAssignableCadres,
  canApproveOfficeStaff,
  canDirectlyAppointTelecaller,
  isCommissionEligible,
  canAccessLead,
  CADRE_HIERARCHY_RANK,
} from '@real-estate-erp/types';

describe('Admin Web App - Cadre Hierarchy and Referral System', () => {
  describe('Hierarchy Rank Ordering', () => {
    it('orders director > cgm > gm > agm > senior_sales_manager > sales_manager > team_lead > sales_executive & telecaller', () => {
      expect(CADRE_HIERARCHY_RANK.director).toBeLessThan(CADRE_HIERARCHY_RANK.cgm);
      expect(CADRE_HIERARCHY_RANK.cgm).toBeLessThan(CADRE_HIERARCHY_RANK.gm);
      expect(CADRE_HIERARCHY_RANK.gm).toBeLessThan(CADRE_HIERARCHY_RANK.agm);
      expect(CADRE_HIERARCHY_RANK.agm).toBeLessThan(CADRE_HIERARCHY_RANK.senior_sales_manager);
      expect(CADRE_HIERARCHY_RANK.senior_sales_manager).toBeLessThan(CADRE_HIERARCHY_RANK.sales_manager);
      expect(CADRE_HIERARCHY_RANK.sales_manager).toBeLessThan(CADRE_HIERARCHY_RANK.team_lead);
      expect(CADRE_HIERARCHY_RANK.team_lead).toBeLessThan(CADRE_HIERARCHY_RANK.sales_executive);
      expect(CADRE_HIERARCHY_RANK.team_lead).toBeLessThan(CADRE_HIERARCHY_RANK.telecaller);
      expect(CADRE_HIERARCHY_RANK.telecaller).toBe(8);
      expect(CADRE_HIERARCHY_RANK.sales_executive).toBe(8);
    });
  });

  describe('canAssignCadre Rules', () => {
    it('allows a Sales Manager to assign ONLY strictly lower cadres (Team Lead, Sales Executive, Marketing Telecaller)', () => {
      expect(canAssignCadre('sales_manager', 'team_lead')).toBe(true);
      expect(canAssignCadre('sales_manager', 'sales_executive')).toBe(true);
      expect(canAssignCadre('sales_manager', 'telecaller')).toBe(true);

      // Cannot assign same or higher
      expect(canAssignCadre('sales_manager', 'sales_manager')).toBe(false);
      expect(canAssignCadre('sales_manager', 'senior_sales_manager')).toBe(false);
      expect(canAssignCadre('sales_manager', 'agm')).toBe(false);
      expect(canAssignCadre('sales_manager', 'gm')).toBe(false);
      expect(canAssignCadre('sales_manager', 'cgm')).toBe(false);
      expect(canAssignCadre('sales_manager', 'director')).toBe(false);
    });

    it('allows a GM to assign AGM, SSM, SM, Team Lead, Sales Exec, and Telecaller but NOT CGM, GM, or Director', () => {
      expect(canAssignCadre('gm', 'agm')).toBe(true);
      expect(canAssignCadre('gm', 'senior_sales_manager')).toBe(true);
      expect(canAssignCadre('gm', 'sales_manager')).toBe(true);
      expect(canAssignCadre('gm', 'team_lead')).toBe(true);
      expect(canAssignCadre('gm', 'sales_executive')).toBe(true);
      expect(canAssignCadre('gm', 'telecaller')).toBe(true);

      expect(canAssignCadre('gm', 'gm')).toBe(false);
      expect(canAssignCadre('gm', 'cgm')).toBe(false);
      expect(canAssignCadre('gm', 'director')).toBe(false);
    });

    it('allows a CGM to assign GM and all lower levels including Telecaller', () => {
      expect(canAssignCadre('cgm', 'gm')).toBe(true);
      expect(canAssignCadre('cgm', 'agm')).toBe(true);
      expect(canAssignCadre('cgm', 'sales_manager')).toBe(true);
      expect(canAssignCadre('cgm', 'sales_executive')).toBe(true);
      expect(canAssignCadre('cgm', 'telecaller')).toBe(true);

      expect(canAssignCadre('cgm', 'cgm')).toBe(false);
      expect(canAssignCadre('cgm', 'director')).toBe(false);
    });

    it('prevents non-directors from approving office staff', () => {
      expect(canAssignCadre('sales_manager', 'office_staff')).toBe(false);
      expect(canAssignCadre('gm', 'office_staff')).toBe(false);
      expect(canAssignCadre('cgm', 'office_staff')).toBe(false);
      expect(canAssignCadre('team_lead', 'office_staff')).toBe(false);
    });

    it('allows Director to approve office staff and all lower marketing cadres', () => {
      expect(canAssignCadre('director', 'office_staff')).toBe(true);
      expect(canAssignCadre('director', 'cgm')).toBe(true);
      expect(canAssignCadre('director', 'gm')).toBe(true);
      expect(canAssignCadre('director', 'sales_manager')).toBe(true);
      expect(canAssignCadre('director', 'sales_executive')).toBe(true);
      expect(canAssignCadre('director', 'telecaller')).toBe(true);
    });
  });

  describe('getAllowedAssignableCadres', () => {
    it('returns correct subset for Sales Manager including Telecaller', () => {
      const allowed = getAllowedAssignableCadres('sales_manager');
      expect(allowed).toEqual(['team_lead', 'sales_executive', 'telecaller']);
    });

    it('returns empty list for lowest level (sales_executive and telecaller)', () => {
      expect(getAllowedAssignableCadres('sales_executive')).toEqual([]);
      expect(getAllowedAssignableCadres('telecaller')).toEqual([]);
    });

    it('includes office_staff and all downline cadres for director', () => {
      const allowed = getAllowedAssignableCadres('director');
      expect(allowed).toContain('office_staff');
      expect(allowed).toContain('cgm');
      expect(allowed).toContain('gm');
      expect(allowed).toContain('telecaller');
    });
  });

  describe('canApproveOfficeStaff', () => {
    it('approves only Director / Management / Super Admin', () => {
      expect(canApproveOfficeStaff('director')).toBe(true);
      expect(canApproveOfficeStaff('DIRECTOR')).toBe(true);
      expect(canApproveOfficeStaff('super_admin')).toBe(true);
      expect(canApproveOfficeStaff('management')).toBe(true);
      expect(canApproveOfficeStaff('managing_director')).toBe(true);

      expect(canApproveOfficeStaff('sales_manager')).toBe(false);
      expect(canApproveOfficeStaff('gm')).toBe(false);
      expect(canApproveOfficeStaff('cgm')).toBe(false);
      expect(canApproveOfficeStaff('sales_executive')).toBe(false);
      expect(canApproveOfficeStaff('telecaller')).toBe(false);
      expect(canApproveOfficeStaff(undefined)).toBe(false);
    });
  });

  describe('Direct Telecaller Appointment Rules', () => {
    it('allows any leader (Director, CGM, GM, AGM, SSM, SM, Team Lead) to directly appoint telecallers', () => {
      expect(canDirectlyAppointTelecaller('director')).toBe(true);
      expect(canDirectlyAppointTelecaller('cgm')).toBe(true);
      expect(canDirectlyAppointTelecaller('gm')).toBe(true);
      expect(canDirectlyAppointTelecaller('agm')).toBe(true);
      expect(canDirectlyAppointTelecaller('senior_sales_manager')).toBe(true);
      expect(canDirectlyAppointTelecaller('sales_manager')).toBe(true);
      expect(canDirectlyAppointTelecaller('team_lead')).toBe(true);

      // Rank 8 cannot appoint other telecallers
      expect(canDirectlyAppointTelecaller('sales_executive')).toBe(false);
      expect(canDirectlyAppointTelecaller('telecaller')).toBe(false);
    });
  });

  describe('Salary-Based Compensation & Commission Exemption', () => {
    it('excludes telecallers and office staff from sales commissions (Salary-Based)', () => {
      expect(isCommissionEligible('telecaller')).toBe(false);
      expect(isCommissionEligible('office_staff')).toBe(false);
      expect(isCommissionEligible('accountant')).toBe(false);
      expect(isCommissionEligible('admin')).toBe(false);
    });

    it('enables commissions for marketing field sales agents and leaders', () => {
      expect(isCommissionEligible('sales_executive')).toBe(true);
      expect(isCommissionEligible('team_lead')).toBe(true);
      expect(isCommissionEligible('sales_manager')).toBe(true);
      expect(isCommissionEligible('senior_sales_manager')).toBe(true);
      expect(isCommissionEligible('agm')).toBe(true);
      expect(isCommissionEligible('gm')).toBe(true);
      expect(isCommissionEligible('cgm')).toBe(true);
      expect(isCommissionEligible('director')).toBe(true);
    });
  });

  describe('Strict Lead Privacy and Non-Leakage (Isolation)', () => {
    const appointingManagerSM = { uid: 'usr-sm-101', role: 'sales_manager', cadre: 'sales_manager' };
    const uplineGM = { uid: 'usr-gm-201', role: 'branch_manager', cadre: 'gm' };
    const telecallerA = { uid: 'usr-tc-001', role: 'telecaller', cadre: 'telecaller' };
    const parallelManagerSM2 = { uid: 'usr-sm-999', role: 'sales_manager', cadre: 'sales_manager' };
    const directorUser = { uid: 'usr-dir-001', role: 'director', cadre: 'director' };

    const sampleLead = {
      assignedTelecallerId: 'usr-tc-001',
      appointedByUid: 'usr-sm-101',
      hierarchyPath: ['usr-dir-001', 'usr-gm-201', 'usr-sm-101'],
    };

    it('allows the assigned telecaller to access their own lead', () => {
      expect(canAccessLead(telecallerA, sampleLead)).toBe(true);
    });

    it('allows the direct appointing manager (SM) to view their telecaller lead and performance', () => {
      expect(canAccessLead(appointingManagerSM, sampleLead)).toBe(true);
    });

    it('allows upline hierarchy leaders (GM, Director) to oversee the lead', () => {
      expect(canAccessLead(uplineGM, sampleLead)).toBe(true);
      expect(canAccessLead(directorUser, sampleLead)).toBe(true);
    });

    it('STRICTLY PREVENTS parallel managers or lateral teams from accessing the lead (zero leakage)', () => {
      expect(canAccessLead(parallelManagerSM2, sampleLead)).toBe(false);
      expect(canAccessLead({ uid: 'random-other-agent', role: 'sales_executive' }, sampleLead)).toBe(false);
    });
  });
});

