import { Customer360Profile, CustomerTimelineItem, Interaction, PlotBooking } from '@real-estate-erp/types';
import { PersonRepository, LeadRepository } from '@real-estate-erp/firebase'; // Assuming these exist per subagent
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { DocumentService } from './DocumentService';
import { AfterSalesService } from './AfterSalesService';

export class Customer360Service {
  static async getCustomerProfile(customerId: string): Promise<Customer360Profile | null> {
    const personRepo = new PersonRepository();
    const person = await personRepo.findById(customerId);
    
    if (!person) return null;

    const { db } = getFirebaseInstance();

    // Fetch related bookings to calculate financials
    const bookingsSnap = await getDocs(query(collection(db, 'bookings'), where('customerId', '==', customerId)));
    const bookings = bookingsSnap.docs.map(d => d.data() as PlotBooking);

    let totalBookedValue = 0;
    let totalAmountPaid = 0;
    
    for (const booking of bookings) {
      if (booking.status !== 'CANCELLED') {
        totalBookedValue += booking.finalSaleAmount || 0;
        totalAmountPaid += booking.tokenAmountPaid || 0;
        // In reality, we'd also iterate paymentSchedule if needed
      }
    }

    const leadsCount = await getDocs(query(collection(db, 'leads'), where('personId', '==', customerId))).then(s => s.size);
    const siteVisitsCount = await getDocs(query(collection(db, 'siteVisits'), where('personId', '==', customerId))).then(s => s.size);
    const documents = await DocumentService.getDocumentsByEntity('Person', customerId);
    const afterSales = await AfterSalesService.getCasesByCustomer(customerId);

    return {
      ...person,
      financials: {
        totalBookedValue,
        totalAmountPaid,
        balanceDue: totalBookedValue - totalAmountPaid,
      },
      summary: {
        totalLeads: leadsCount,
        totalSiteVisits: siteVisitsCount,
        totalBookings: bookings.length,
        totalDocuments: documents.length,
        totalAfterSalesCases: afterSales.length,
      }
    };
  }

  static async getCustomerTimeline(customerId: string): Promise<CustomerTimelineItem[]> {
    const timeline: CustomerTimelineItem[] = [];
    const { db } = getFirebaseInstance();

    // 1. Interactions
    const interactionsSnap = await getDocs(query(collection(db, 'interactions'), where('personId', '==', customerId)));
    interactionsSnap.forEach(docSnap => {
      const data = docSnap.data() as Interaction;
      timeline.push({
        id: data.id,
        timestamp: data.createdAt,
        type: 'INTERACTION',
        title: `Interaction: ${data.type}`,
        description: data.notes,
        actor: data.employeeId,
      });
    });

    // 2. Bookings
    const bookingsSnap = await getDocs(query(collection(db, 'bookings'), where('customerId', '==', customerId)));
    bookingsSnap.forEach(docSnap => {
      const data = docSnap.data() as PlotBooking;
      timeline.push({
        id: data.id,
        timestamp: data.createdAt,
        type: 'BOOKING',
        title: `Booking Created - ${data.status}`,
        description: `Amount: ₹${data.finalSaleAmount}`,
      });
    });

    // 3. AfterSales
    const afterSales = await AfterSalesService.getCasesByCustomer(customerId);
    afterSales.forEach(data => {
      timeline.push({
        id: data.id,
        timestamp: data.openedAt,
        type: 'AFTER_SALES',
        title: `After-Sales: ${data.category}`,
        description: `Subject: ${data.subject}, Status: ${data.status}`,
        actor: data.assignedTo,
      });
    });

    // 4. Documents
    const documents = await DocumentService.getDocumentsByEntity('Person', customerId);
    documents.forEach(data => {
      timeline.push({
        id: data.id,
        timestamp: data.uploadedAt,
        type: 'INTERACTION', // Mapping as generic interaction for timeline
        title: `Document Uploaded: ${data.title}`,
        description: `Visibility: ${data.visibility}`,
        actor: data.uploadedBy,
      });
    });

    // Sort chronologically (oldest to newest, or newest first depending on preference)
    // We will do newest first
    timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return timeline;
  }
}
