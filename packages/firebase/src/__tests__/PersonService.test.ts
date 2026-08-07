import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersonService } from '../services/PersonService';
import { PersonRepository } from '../repositories/PersonRepository';

vi.mock('../repositories/PersonRepository');
vi.mock('../services/auditLoggerService');

describe('PersonService', () => {
  let personService: PersonService;
  let personRepoMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    personRepoMock = {
      findByMobile: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
      restore: vi.fn(),
      findById: vi.fn(),
    };
    
    // Mock the constructor of PersonRepository to return our mock
    (PersonRepository as any).mockImplementation(() => personRepoMock);

    personService = new PersonService();
    // Override the private repository instance for testing
    (personService as any).repository = personRepoMock;
  });

  describe('createPerson', () => {
    it('should create a person if no duplicates are found', async () => {
      personRepoMock.findByMobile.mockResolvedValue([]);
      personRepoMock.findByEmail.mockResolvedValue([]);
      
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumbers: ['1234567890'],
        emailAddresses: ['john@example.com'],
      } as any;

      const created = { ...input, id: '1' };
      personRepoMock.create.mockResolvedValue(created);

      const result = await personService.createPerson(input, 'user1');

      expect(personRepoMock.findByMobile).toHaveBeenCalledWith('1234567890');
      expect(personRepoMock.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(personRepoMock.create).toHaveBeenCalledWith(input, 'user1');
      expect(result).toEqual(created);
    });

    it('should throw an error if a duplicate mobile number is found', async () => {
      personRepoMock.findByMobile.mockResolvedValue([{ id: 'existing' }]);
      
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumbers: ['1234567890'],
      } as any;

      await expect(personService.createPerson(input, 'user1')).rejects.toThrow(
        'Person with mobile number 1234567890 already exists.'
      );
      
      expect(personRepoMock.create).not.toHaveBeenCalled();
    });

    it('should throw an error if a duplicate email is found', async () => {
      personRepoMock.findByMobile.mockResolvedValue([]);
      personRepoMock.findByEmail.mockResolvedValue([{ id: 'existing' }]);
      
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddresses: ['john@example.com'],
      } as any;

      await expect(personService.createPerson(input, 'user1')).rejects.toThrow(
        'Person with email john@example.com already exists.'
      );
      
      expect(personRepoMock.create).not.toHaveBeenCalled();
    });
  });

  describe('mergePersons', () => {
    it('should merge two persons correctly and soft-delete the source', async () => {
      const source = {
        id: 'source1',
        mobileNumbers: ['1111111111'],
        emailAddresses: ['source@example.com'],
        tags: ['VIP'],
        addresses: [],
        identities: [],
        relationships: [],
      };

      const target = {
        id: 'target1',
        mobileNumbers: ['2222222222'],
        emailAddresses: ['target@example.com'],
        tags: ['HOT'],
        addresses: [],
        identities: [],
        relationships: [],
        mergedWith: [],
      };

      personRepoMock.findById.mockImplementation((id: string) => {
        if (id === 'source1') return Promise.resolve(source);
        if (id === 'target1') return Promise.resolve(target);
        return Promise.resolve(null);
      });

      const updatedTargetMock = { ...target, tags: ['HOT', 'VIP'] };
      personRepoMock.update.mockImplementation((id: string, updateData: any) => {
        return Promise.resolve(id === 'target1' ? updatedTargetMock : updateData);
      });

      const result = await personService.mergePersons('source1', 'target1', 'user1');

      // Verify source update (soft delete)
      expect(personRepoMock.update).toHaveBeenCalledWith(
        'source1',
        expect.objectContaining({
          isDeleted: true,
          isActive: false,
          mergedInto: 'target1',
        }),
        'user1'
      );

      // Verify target update (merged arrays)
      expect(personRepoMock.update).toHaveBeenCalledWith(
        'target1',
        expect.objectContaining({
          mobileNumbers: ['2222222222', '1111111111'],
          emailAddresses: ['target@example.com', 'source@example.com'],
          tags: ['HOT', 'VIP'],
          mergedWith: ['source1'],
        }),
        'user1'
      );

      expect(result).toEqual(updatedTargetMock);
    });

    it('should throw an error if source and target are the same', async () => {
      await expect(personService.mergePersons('1', '1', 'user1')).rejects.toThrow(
        'Source and target persons cannot be the same.'
      );
    });
  });
});
