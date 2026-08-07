import { BaseRepository } from '../../repositories/BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { BlockModel } from '../../models';
import { blockConverter } from '../../converters/typedConverters';

export class BlockRepository extends BaseRepository<BlockModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.BLOCKS, 'Block', blockConverter);
  }
}
