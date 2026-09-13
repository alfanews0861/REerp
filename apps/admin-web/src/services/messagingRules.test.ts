import { describe, it, expect } from 'vitest';
import {
  canSendMessage,
  filterAllowedRecipients,
  getAllowedRecipientCategories,
  isOfficeStaff,
  isCGM,
  isMarketingMember,
  isAdminUser,
} from './messagingRules';
import { UserProfile } from '@real-estate-erp/types';

describe('Internal Messaging Communication Matrix Rules', () => {
  const adminUser: UserProfile = {
    id: 'usr-admin',
    uid: 'usr-admin',
    email: 'admin@reerp.com',
    displayName: 'Managing Director',
    role: 'director',
    cadre: 'director',
    status: 'active',
    permissions: ['*:*'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const cgmUser1: UserProfile = {
    id: 'usr-cgm1',
    uid: 'usr-cgm1',
    email: 'cgm.west@reerp.com',
    displayName: 'V. Venkatesh (CGM West)',
    role: 'marketing_manager',
    cadre: 'cgm',
    status: 'active',
    permissions: ['campaign:*', 'lead:*'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const cgmUser2: UserProfile = {
    id: 'usr-cgm2',
    uid: 'usr-cgm2',
    email: 'cgm.north@reerp.com',
    displayName: 'B. Jagadeesh (CGM North)',
    role: 'marketing_manager',
    cadre: 'cgm',
    status: 'active',
    permissions: ['campaign:*', 'lead:*'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const marketingAgent: UserProfile = {
    id: 'usr-agent1',
    uid: 'usr-agent1',
    email: 'agent1@reerp.com',
    displayName: 'Ravi Teja (Sales Executive)',
    role: 'sales_executive',
    cadre: 'sales_executive',
    status: 'active',
    referredByUid: 'usr-cgm1',
    hierarchyPath: ['usr-cgm1'],
    permissions: ['lead:read'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const parallelAgent: UserProfile = {
    id: 'usr-agent2',
    uid: 'usr-agent2',
    email: 'agent2@reerp.com',
    displayName: 'Sunil Kumar (Parallel Team Agent)',
    role: 'sales_executive',
    cadre: 'sales_executive',
    status: 'active',
    referredByUid: 'usr-cgm2',
    hierarchyPath: ['usr-cgm2'],
    permissions: ['lead:read'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const officeStaffUser: UserProfile = {
    id: 'usr-acc1',
    uid: 'usr-acc1',
    email: 'accounts@reerp.com',
    displayName: 'Lakshmi Narayana (Accounts)',
    role: 'accountant',
    cadre: 'office_staff',
    registrationType: 'office_staff',
    status: 'active',
    permissions: ['payments:*'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  describe('Role Classification Helpers', () => {
    it('correctly identifies Admin, CGM, Marketing, and Office Staff', () => {
      expect(isAdminUser(adminUser)).toBe(true);
      expect(isAdminUser(cgmUser1)).toBe(false);

      expect(isCGM(cgmUser1)).toBe(true);
      expect(isCGM(cgmUser2)).toBe(true);
      expect(isCGM(adminUser)).toBe(false);

      expect(isMarketingMember(marketingAgent)).toBe(true);
      expect(isMarketingMember(cgmUser1)).toBe(true);
      expect(isMarketingMember(officeStaffUser)).toBe(false);

      expect(isOfficeStaff(officeStaffUser)).toBe(true);
      expect(isOfficeStaff(adminUser)).toBe(true);
      expect(isOfficeStaff(marketingAgent)).toBe(false);
    });
  });

  describe('Admin Messaging Permissions', () => {
    it('allows Admin to message all office staff, CGMs, and associates', () => {
      expect(canSendMessage(adminUser, officeStaffUser).allowed).toBe(true);
      expect(canSendMessage(adminUser, cgmUser1).allowed).toBe(true);
      expect(canSendMessage(adminUser, marketingAgent).allowed).toBe(true);
    });

    it('provides broadcast recipient categories for Admin (All Staff, All Marketing, All Company)', () => {
      const categories = getAllowedRecipientCategories(adminUser);
      const categoryIds = categories.map((c) => c.id);
      expect(categoryIds).toContain('OFFICE_STAFF');
      expect(categoryIds).toContain('MARKETING_TEAM');
      expect(categoryIds).toContain('ALL_COMPANY');
    });
  });

  describe('CGM (Chief General Manager) Messaging Permissions', () => {
    it('allows CGM to message fellow CGMs (Peer Network)', () => {
      const result = canSendMessage(cgmUser1, cgmUser2);
      expect(result.allowed).toBe(true);
    });

    it('allows CGM to message Office Staff', () => {
      const result = canSendMessage(cgmUser1, officeStaffUser);
      expect(result.allowed).toBe(true);
    });

    it('allows CGM to message downline marketing associates', () => {
      const result = canSendMessage(cgmUser1, marketingAgent);
      expect(result.allowed).toBe(true);
    });

    it('provides CGM recipient categories including PEER_CGMS', () => {
      const categories = getAllowedRecipientCategories(cgmUser1);
      const categoryIds = categories.map((c) => c.id);
      expect(categoryIds).toContain('PEER_CGMS');
      expect(categoryIds).toContain('OFFICE_STAFF');
      expect(categoryIds).toContain('MARKETING_TEAM');
    });
  });

  describe('Marketing Member Permissions', () => {
    it('allows Marketing Agent to message Office Staff', () => {
      const result = canSendMessage(marketingAgent, officeStaffUser);
      expect(result.allowed).toBe(true);
    });

    it('allows Marketing Agent to message their upline team leader (CGM 1)', () => {
      const result = canSendMessage(marketingAgent, cgmUser1);
      expect(result.allowed).toBe(true);
    });

    it('blocks Marketing Agent from messaging unrelated parallel team members', () => {
      const result = canSendMessage(marketingAgent, parallelAgent);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Marketing members can only message their designated team members');
    });
  });

  describe('Office Staff Permissions', () => {
    it('allows Office Staff to message Admins, fellow Office Staff, and Marketing members', () => {
      expect(canSendMessage(officeStaffUser, adminUser).allowed).toBe(true);
      expect(canSendMessage(officeStaffUser, marketingAgent).allowed).toBe(true);
      expect(canSendMessage(officeStaffUser, cgmUser1).allowed).toBe(true);
    });
  });

  describe('filterAllowedRecipients', () => {
    it('correctly filters recipients for Marketing Agent', () => {
      const allUsers = [adminUser, cgmUser1, cgmUser2, marketingAgent, parallelAgent, officeStaffUser];
      const filtered = filterAllowedRecipients(marketingAgent, allUsers);

      const uids = filtered.map((u) => u.uid);
      expect(uids).toContain('usr-admin'); // Can message Admin
      expect(uids).toContain('usr-acc1');  // Can message Office Staff
      expect(uids).toContain('usr-cgm1');  // Can message Upline Team Leader
      expect(uids).not.toContain('usr-agent2'); // Blocked from parallel unrelated agent
      expect(uids).not.toContain('usr-agent1'); // Cannot message self from list
    });
  });
});
