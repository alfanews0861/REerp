import * as functions from 'firebase-functions';
import { LeadAcquisitionService, LeadCaptureRequestDTO } from '@real-estate-erp/firebase';

export const captureLeadWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Basic API key validation
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.LEAD_WEBHOOK_SECRET) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const dto: LeadCaptureRequestDTO = req.body;
    
    // Validate minimal payload manually or via validator
    if (!dto.firstName || !dto.phone || !dto.sourceCode || !dto.companyId) {
      res.status(400).send('Bad Request: Missing required fields');
      return;
    }

    const acquisitionService = new LeadAcquisitionService();
    const lead = await acquisitionService.acquireLead(dto, 'WEBHOOK_SYSTEM');

    res.status(200).json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error('Error capturing lead via webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
