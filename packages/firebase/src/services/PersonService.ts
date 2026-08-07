import { PersonModel } from '../models/person';
import { PersonRepository } from '../repositories/PersonRepository';

import { AuditLoggerService } from './auditLoggerService';
import { CreateModelInput, UpdateModelInput } from '../models/base';

export class PersonService {
  private repository: PersonRepository;

  constructor() {
    this.repository = new PersonRepository();
  }

  public async createPerson(input: CreateModelInput<PersonModel>, userId: string): Promise<PersonModel> {
    // Check duplicates
    if (input.mobileNumbers && input.mobileNumbers.length > 0) {
      for (const mobile of input.mobileNumbers) {
        const existing = await this.repository.findByMobile(mobile);
        if (existing.length > 0) {
          throw new Error(`Person with mobile number ${mobile} already exists.`);
        }
      }
    }

    if (input.emailAddresses && input.emailAddresses.length > 0) {
      for (const email of input.emailAddresses) {
        const existing = await this.repository.findByEmail(email);
        if (existing.length > 0) {
          throw new Error(`Person with email ${email} already exists.`);
        }
      }
    }

    return this.repository.create(input, userId);
  }

  public async updatePerson(id: string, input: UpdateModelInput<PersonModel>, userId: string): Promise<PersonModel> {
    return this.repository.update(id, input, userId);
  }

  public async softDeletePerson(id: string, userId: string): Promise<boolean> {
    return this.repository.softDelete(id, userId);
  }

  public async restorePerson(id: string, userId: string): Promise<PersonModel> {
    return this.repository.restore(id, userId);
  }

  public async mergePersons(sourceId: string, targetId: string, userId: string): Promise<PersonModel> {
    if (sourceId === targetId) {
      throw new Error('Source and target persons cannot be the same.');
    }

    const source = await this.repository.findById(sourceId);
    const target = await this.repository.findById(targetId);

    if (!source) throw new Error('Source person not found.');
    if (!target) throw new Error('Target person not found.');

    // Combine arrays uniquely
    const mergedMobiles = Array.from(new Set([...target.mobileNumbers, ...source.mobileNumbers]));
    const mergedEmails = Array.from(new Set([...target.emailAddresses, ...source.emailAddresses]));
    const mergedTags = Array.from(new Set([...target.tags, ...source.tags]));
    
    // Simple array concatenation for others (could be improved to deduplicate by deep comparison)
    const mergedAddresses = [...target.addresses, ...source.addresses];
    const mergedIdentities = [...target.identities, ...source.identities];
    const mergedRelationships = [...target.relationships, ...source.relationships];

    const mergedWithList = target.mergedWith || [];
    mergedWithList.push(sourceId);

    const updatedTargetInput: UpdateModelInput<PersonModel> = {
      mobileNumbers: mergedMobiles,
      emailAddresses: mergedEmails,
      tags: mergedTags,
      addresses: mergedAddresses,
      identities: mergedIdentities,
      relationships: mergedRelationships,
      mergedWith: mergedWithList,
    };

    const updatedTarget = await this.repository.update(targetId, updatedTargetInput, userId);

    // Soft delete source
    const updatedSourceInput: UpdateModelInput<PersonModel> = {
      isDeleted: true,
      isActive: false,
      mergedInto: targetId,
    };
    await this.repository.update(sourceId, updatedSourceInput, userId);

    await AuditLoggerService.log({
      userId,
      entityType: 'Person',
      entityId: targetId,
      action: 'update',
      previousState: target as unknown as Record<string, unknown>,
      newState: updatedTarget as unknown as Record<string, unknown>,
    });

    return updatedTarget;
  }
}

export const personService = new PersonService();
