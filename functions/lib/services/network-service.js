"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkService = void 0;
const admin = __importStar(require("firebase-admin"));
class NetworkService {
    db = admin.firestore();
    /**
     * Gets the full ancestor path for a parent ID to avoid deep recursion
     */
    async getAncestors(parentMemberId) {
        if (!parentMemberId)
            return [];
        const parentDoc = await this.db.collection('network_members').doc(parentMemberId).get();
        if (!parentDoc.exists) {
            throw new Error('Parent member not found');
        }
        const parentData = parentDoc.data();
        // The new member's ancestors will be the parent's ancestors + the parent's ID
        return [...(parentData.ancestors || []), parentMemberId];
    }
    /**
     * Creates a new network member
     */
    async createMember(data, userId) {
        const ancestors = await this.getAncestors(data.parentMemberId || null);
        const positionDoc = await this.db.collection('network_positions').doc(data.positionId).get();
        if (!positionDoc.exists) {
            throw new Error('Position not found');
        }
        const position = positionDoc.data();
        const newMemberRef = this.db.collection('network_members').doc();
        const newMember = {
            id: newMemberRef.id,
            personId: data.personId,
            companyId: data.companyId,
            branchId: data.branchId,
            parentMemberId: data.parentMemberId || null,
            ancestors,
            positionId: data.positionId,
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
    async validateMove(memberId, newParentId) {
        if (memberId === newParentId)
            return false;
        const newAncestors = await this.getAncestors(newParentId);
        // If the new parent has this member in its ancestors, it's a circular reference
        if (newAncestors.includes(memberId)) {
            return false;
        }
        return true;
    }
}
exports.NetworkService = NetworkService;
//# sourceMappingURL=network-service.js.map