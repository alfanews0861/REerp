import * as admin from 'firebase-admin';
import { NetworkMember, NetworkPosition } from '@real-estate-erp/types';

export class NetworkService {
  private db = admin.firestore();

  /**
   * Gets the full ancestor path for a parent ID to avoid deep recursion
   */
  async getAncestors(parentMemberId: string | null): Promise<string[]> {
    if (!parentMemberId) return [];
    
    const parentDoc = await this.db.collection('network_members').doc(parentMemberId).get();
    if (!parentDoc.exists) {
      throw new Error('Parent member not found');
    }
    
    const parentData = parentDoc.data() as NetworkMember;
    // The new member's ancestors will be the parent's ancestors + the parent's ID
    return [...(parentData.ancestors || []), parentMemberId];
  }

  /**
   * Creates a new network member
   */
  async createMember(data: Partial<NetworkMember>, userId: string): Promise<NetworkMember> {
    const ancestors = await this.getAncestors(data.parentMemberId || null);
    
    const positionDoc = await this.db.collection('network_positions').doc(data.positionId!).get();
    if (!positionDoc.exists) {
      throw new Error('Position not found');
    }
    const position = positionDoc.data() as NetworkPosition;

    const newMemberRef = this.db.collection('network_members').doc();
    
    const newMember: NetworkMember = {
      id: newMemberRef.id,
      personId: data.personId!,
      companyId: data.companyId!,
      branchId: data.branchId!,
      parentMemberId: data.parentMemberId || null,
      ancestors,
      positionId: data.positionId!,
      level: position.level,
      networkType: data.networkType || 'INDEPENDENT_AGENT',
      status: 'ACTIVE',
      joinedAt: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await newMemberRef.set(newMember);
    return newMember;
  }

  /**
   * Validates that moving a member doesn't create a circular dependency
   */
  async validateMove(memberId: string, newParentId: string): Promise<boolean> {
    if (memberId === newParentId) return false;
    
    const newAncestors = await this.getAncestors(newParentId);
    // If the new parent has this member in its ancestors, it's a circular reference
    if (newAncestors.includes(memberId)) {
      return false;
    }
    
    return true;
  }
}
