import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@real-estate-erp/firebase'; // Assuming standard firebase export
import { DocumentRecord, DocumentVisibility, DocumentStatus } from '@real-estate-erp/types';
import { v4 as uuidv4 } from 'uuid';

export class DocumentService {
  private static collectionName = 'documents';

  static async uploadDocument(
    documentData: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status'>
  ): Promise<DocumentRecord> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const docRecord: DocumentRecord = {
      ...documentData,
      id,
      version: 1,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = doc(db, this.collectionName, id);
    await setDoc(docRef, docRecord);
    return docRecord;
  }

  static async getDocumentsByEntity(entityType: string, entityId: string): Promise<DocumentRecord[]> {
    const q = query(
      collection(db, this.collectionName),
      where('entityType', '==', entityType),
      where('entityId', '==', entityId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as DocumentRecord);
  }

  static async updateDocumentVisibility(id: string, visibility: DocumentVisibility): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, { visibility, updatedAt: new Date().toISOString() });
  }

  static async replaceDocument(id: string, newFileReference: string, newUploaderId: string): Promise<DocumentRecord> {
    const docRef = doc(db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Document not found');
    
    const oldDoc = snap.data() as DocumentRecord;
    
    const newDocId = uuidv4();
    const now = new Date().toISOString();
    
    const newDoc: DocumentRecord = {
      ...oldDoc,
      id: newDocId,
      fileReference: newFileReference,
      uploadedBy: newUploaderId,
      uploadedAt: now,
      version: oldDoc.version + 1,
      previousVersionId: oldDoc.id,
      createdAt: oldDoc.createdAt,
      updatedAt: now,
    };
    
    const newDocRef = doc(db, this.collectionName, newDocId);
    await setDoc(newDocRef, newDoc);
    
    // In a real scenario, we might soft-delete the old one or just remove it from active queries.
    // For now we preserve both, but the UI should filter out versions that are replaced.
    return newDoc;
  }
}
