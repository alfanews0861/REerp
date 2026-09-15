import * as admin from 'firebase-admin';

export interface NotificationLog {
  id?: string;
  recipientPhone: string;
  recipientName: string;
  channel: 'WHATSAPP' | 'SMS' | 'IN_APP';
  templateName: string;
  messageText: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  metadata?: Record<string, any>;
  sentAt: string;
}

export class NotificationService {
  private static get db() {
    return admin.firestore();
  }

  /**
   * Log communication event to Firestore audit trail
   */
  private static async logCommunication(log: NotificationLog): Promise<void> {
    try {
      await this.db.collection('communication_logs').add({
        ...log,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`[NotificationService] ${log.channel} logged for ${log.recipientPhone} (${log.templateName})`);
    } catch (err) {
      console.error('[NotificationService] Failed to record communication log:', err);
    }
  }

  /**
   * Send WhatsApp / SMS welcome & assignment notification for a new or assigned lead
   */
  static async sendLeadWelcomeAndAssignment(lead: {
    customerName: string;
    customerPhone: string;
    ventureName?: string;
    executiveName?: string;
    executivePhone?: string;
  }): Promise<void> {
    const venture = lead.ventureName || 'ISKON City - 2 (Podalakur Road)';
    const execName = lead.executiveName || 'Our Senior Relationship Advisor';
    const execPhone = lead.executivePhone || '+91 98480 22334';

    const message =
      `నమస్కారం ${lead.customerName}! Welcome to ISKON Developers (Nellore).\n\n` +
      `Thank you for your interest in ${venture} (NUDA & DTCP Approved Gated Township).\n` +
      `${execName} (${execPhone}) has been assigned to personally assist you with layout maps, pricing, and scheduling a complimentary AC Cab site visit.\n\n` +
      `Office: RKRI Towers, Mini Byepass Road, Nellore.\n` +
      `Explore ventures: https://iskondevelopers.com/ventures`;

    // Simulated carrier gateway dispatch (Gupshup / Twilio / Infobip)
    console.log(`[WhatsApp Gateway Dispatch] To: ${lead.customerPhone}\n${message}`);

    await this.logCommunication({
      recipientPhone: lead.customerPhone,
      recipientName: lead.customerName,
      channel: 'WHATSAPP',
      templateName: 'LEAD_WELCOME_ASSIGNMENT',
      messageText: message,
      status: 'SENT',
      metadata: { venture, execName, execPhone },
      sentAt: new Date().toISOString(),
    });
  }

  /**
   * Send WhatsApp Site Visit Confirmation with live Cab & Driver details
   */
  static async sendSiteVisitConfirmation(visit: {
    customerName: string;
    customerPhone: string;
    ventureName: string;
    date: string;
    time: string;
    travelMode: string;
    vehicleNumber?: string;
    driverName?: string;
    driverPhone?: string;
  }): Promise<void> {
    const cabDetails = visit.vehicleNumber
      ? `🚗 Assigned Cab: ${visit.vehicleNumber}\n👨‍✈️ Driver: ${visit.driverName || 'Designated Driver'} (${visit.driverPhone || '98480 22334'})\n`
      : '';

    const message =
      `నమస్కారం ${visit.customerName},\n\n` +
      `Your Site Visit to ${visit.ventureName} has been confirmed!\n` +
      `📅 Date: ${visit.date}\n` +
      `⏰ Time: ${visit.time}\n` +
      `🚘 Mode: ${visit.travelMode}\n` +
      cabDetails +
      `\nOur chauffeur will arrive at your doorstep ahead of time for a comfortable visit.\n` +
      `Track your cab live: https://iskondevelopers.com/track\n` +
      `Helpline: +91 98480 22334 (ISKON Developers)`;

    console.log(`[WhatsApp Gateway Dispatch] To: ${visit.customerPhone}\n${message}`);

    await this.logCommunication({
      recipientPhone: visit.customerPhone,
      recipientName: visit.customerName,
      channel: 'WHATSAPP',
      templateName: 'SITE_VISIT_CONFIRMATION',
      messageText: message,
      status: 'SENT',
      metadata: { ...visit },
      sentAt: new Date().toISOString(),
    });
  }

  /**
   * Send WhatsApp Official Payment Receipt with link to Customer Portal
   */
  static async sendPaymentReceiptNotification(payment: {
    customerName: string;
    customerPhone: string;
    amount: number;
    bookingNumber: string;
    plotNumber: string;
    projectName: string;
    receiptNumber: string;
  }): Promise<void> {
    const formattedAmount = `₹${payment.amount.toLocaleString('en-IN')}`;

    const message =
      `నమస్కారం ${payment.customerName},\n\n` +
      `We have successfully received your payment of ${formattedAmount} towards Plot No: ${payment.plotNumber} at ${payment.projectName}.\n\n` +
      `📄 Receipt No: ${payment.receiptNumber}\n` +
      `📑 Booking Ref: ${payment.bookingNumber}\n` +
      `Status: Payment Confirmed & Credited to Company Escrow.\n\n` +
      `You can view and download your official stamped receipt anytime on our customer portal:\n` +
      `👉 https://iskondevelopers.com/portal\n\n` +
      `Warm regards,\n` +
      `ISKON Developers, Nellore.`;

    console.log(`[WhatsApp Gateway Dispatch] To: ${payment.customerPhone}\n${message}`);

    await this.logCommunication({
      recipientPhone: payment.customerPhone,
      recipientName: payment.customerName,
      channel: 'WHATSAPP',
      templateName: 'PAYMENT_RECEIPT_ISSUED',
      messageText: message,
      status: 'SENT',
      metadata: { ...payment },
      sentAt: new Date().toISOString(),
    });
  }
}
