import { BaseRepository } from '../../repositories/BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { LayoutModel } from '../../models';
import { layoutConverter } from '../../converters/typedConverters';

export class LayoutRepository extends BaseRepository<LayoutModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.LAYOUTS, 'Layout', layoutConverter);
  }
}
