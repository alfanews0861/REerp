import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@real-estate-erp/firebase';
import { AfterSalesCase, AfterSalesStatus } from '@real-estate-erp/types';
import { v4 as uuidv4 } from 'uuid';

export class AfterSalesService {
  private static collectionName = 'after_sales';

  static async createCase(caseData: Omit<AfterSalesCase, 'id' | 'createdAt' | 'updatedAt' | 'openedAt' | 'status'>): Promise<AfterSalesCase> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newCase: AfterSalesCase = {
      ...caseData,
      id,
      status: 'OPEN',
      openedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = doc(db, this.collectionName, id);
    await setDoc(docRef, newCase);
    return newCase;
  }

  static async getCasesByCustomer(customerId: string): Promise<AfterSalesCase[]> {
    const q = query(
      collection(db, this.collectionName),
      where('customerId', '==', customerId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as AfterSalesCase);
  }

  static async updateCaseStatus(id: string, status: AfterSalesStatus, resolution?: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    const updateData: Partial<AfterSalesCase> = { 
      status, 
      updatedAt: new Date().toISOString() 
    };
    
    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedAt = new Date().toISOString();
      if (resolution) {
        updateData.resolution = resolution;
      }
    }
    
    await updateDoc(docRef, updateData);
  }
}
