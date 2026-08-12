import { onRequest } from 'firebase-functions/v2/https';
import * as crypto from 'crypto';
import { LeadCaptureRequestDTO } from '@real-estate-erp/firebase/src/services/leads/dto';
import { LeadAcquisitionService } from '@real-estate-erp/firebase/src/services/leads/LeadAcquisitionService';

export const captureLeadWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // API key validation with rotation support (comma separated)
  const apiKey = req.headers['x-api-key'];
  const validSecrets = (process.env.LEAD_WEBHOOK_SECRETS || process.env.LEAD_WEBHOOK_SECRET || '').split(',');
  
  if (!apiKey || !validSecrets.includes(apiKey as string)) {
    console.warn('Unauthorized webhook attempt');
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const dto: LeadCaptureRequestDTO = req.body;
    
    // Strict schema validation
    if (!dto.firstName || !dto.phone || !dto.sourceCode || !dto.companyId) {
      res.status(400).send('Bad Request: Missing required fields');
      return;
    }

    // Generate fallback eventId if not provided (Idempotency key)
    if (!dto.eventId) {
      const payloadString = JSON.stringify({ phone: dto.phone, source: dto.sourceCode, time: new Date().toISOString().substring(0,10) });
      dto.eventId = crypto.createHash('sha256').update(payloadString).digest('hex');
    }

    const acquisitionService = new LeadAcquisitionService();
    const lead = await acquisitionService.acquireLead(dto, 'WEBHOOK_SYSTEM');

    res.status(200).json({ success: true, leadId: lead.id, eventId: dto.eventId });
  } catch (error: any) {
    console.error('Error capturing lead via webhook:', error);
    
    // Handle specific conflict error for idempotent retries safely
    if (error.message && error.message.includes('ALREADY_PROCESSED')) {
      res.status(200).json({ success: true, note: 'Idempotent request already processed', eventId: req.body.eventId });
      return;
    }

    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
