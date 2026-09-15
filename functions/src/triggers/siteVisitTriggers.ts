import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { NotificationService } from '../services/notificationService';

export const handleSiteVisitCreated = async (event: any) => {
  const visitData = event.data?.data();
  if (!visitData) return;

  const visitId = event.params['visitId'];
  console.log(`[SiteVisitTrigger] New site visit created: ${visitId}`, visitData);

  const customerPhone = visitData.customerPhone || visitData.phone;
  const customerName = visitData.customerName || visitData.leadName || 'Valued Client';
  const ventureName = visitData.projectName || visitData.ventureName || 'ISKON City - 2';
  const date = visitData.scheduledDate || visitData.date || 'Upcoming';
  const time = visitData.scheduledTime || visitData.time || '10:30 AM';
  const travelMode = visitData.travelMode || 'Company AC Cab';

  if (customerPhone) {
    await NotificationService.sendSiteVisitConfirmation({
      customerName,
      customerPhone,
      ventureName,
      date,
      time,
      travelMode,
      vehicleNumber: visitData.vehicleNumber || 'AP 26 TE 1234 (Toyota Innova)',
      driverName: visitData.driverName || 'Ramesh',
      driverPhone: visitData.driverPhone || '+91 98480 22334',
    });
  }
};

export const onSiteVisitCreated = onDocumentCreated(
  {
    document: 'site_visits/{visitId}',
    region: 'asia-south1',
  },
  handleSiteVisitCreated
);
