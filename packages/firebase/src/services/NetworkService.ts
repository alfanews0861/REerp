import { NetworkMember, NetworkHierarchyTransfer } from '@real-estate-erp/types';
import { NetworkMemberRepository } from '../repositories/networkRepositories';

export class NetworkService {
  private memberRepo: NetworkMemberRepository;

  constructor() {
    this.memberRepo = new NetworkMemberRepository();
  }

  /**
   * Retrieves the full ancestor chain for a member.
   */
  async getAncestors(memberId: string): Promise<NetworkMember[]> {
    const member = await this.memberRepo.findById(memberId);
    if (!member || !member.ancestors || member.ancestors.length === 0) {
      return [];
    }
    
    // Fetch all ancestors
    const ancestors: NetworkMember[] = [];
    for (const ancestorId of member.ancestors) {
      const anc = await this.memberRepo.findById(ancestorId);
      if (anc) {
        ancestors.push(anc);
      }
    }
    
    // Order them by level (highest level first)
    return ancestors.sort((a, b) => a.level - b.level);
  }

  /**
   * Prevents circular hierarchy by ensuring the new parent is not a descendant of the member.
   */
  async validateNewParent(memberId: string, newParentId: string): Promise<boolean> {
    if (memberId === newParentId) return false;
    
    const newParent = await this.memberRepo.findById(newParentId);
    if (!newParent) return false;
    
    if (newParent.ancestors.includes(memberId)) {
      // The new parent is already a descendant of this member! Circular dependency.
      return false;
    }
    
    return true;
  }

  /**
   * Changes the parent of a member, updating ancestor arrays for the subtree.
   */
  async changeParent(memberId: string, newParentId: string | null, userId: string, reason: string): Promise<void> {
    const member = await this.memberRepo.findById(memberId);
    if (!member) throw new Error('Member not found');
    
    let newAncestors: string[] = [];
    if (newParentId) {
      const valid = await this.validateNewParent(memberId, newParentId);
      if (!valid) throw new Error('Invalid parent assignment: Circular dependency or self-parenting detected.');
      
      const newParent = await this.memberRepo.findById(newParentId);
      if (newParent) {
         newAncestors = [...newParent.ancestors, newParent.id];
      }
    }

    const transferRecord: NetworkHierarchyTransfer = {
      id: Date.now().toString(),
      previousParentId: member.parentMemberId,
      newParentId,
      reason,
      transferredByUserId: userId,
      transferredAt: new Date().toISOString()
    };

    const transfers = member.hierarchyTransfers || [];
    transfers.push(transferRecord);

    await this.memberRepo.update(memberId, {
      parentMemberId: newParentId,
      ancestors: newAncestors,
      hierarchyTransfers: transfers,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    }, userId);

    // TODO: Update all descendants' ancestor arrays (Cascade update)
    // This requires a batch update of all members where `ancestors` array contains `memberId`
  }
}
