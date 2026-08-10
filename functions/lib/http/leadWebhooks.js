"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureLeadWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const crypto = __importStar(require("crypto"));
const firebase_1 = require("@real-estate-erp/firebase");
exports.captureLeadWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    // API key validation with rotation support (comma separated)
    const apiKey = req.headers['x-api-key'];
    const validSecrets = (process.env.LEAD_WEBHOOK_SECRETS || process.env.LEAD_WEBHOOK_SECRET || '').split(',');
    if (!apiKey || !validSecrets.includes(apiKey)) {
        console.warn('Unauthorized webhook attempt');
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const dto = req.body;
        // Strict schema validation
        if (!dto.firstName || !dto.phone || !dto.sourceCode || !dto.companyId) {
            res.status(400).send('Bad Request: Missing required fields');
            return;
        }
        // Generate fallback eventId if not provided (Idempotency key)
        if (!dto.eventId) {
            const payloadString = JSON.stringify({ phone: dto.phone, source: dto.sourceCode, time: new Date().toISOString().substring(0, 10) });
            dto.eventId = crypto.createHash('sha256').update(payloadString).digest('hex');
        }
        const acquisitionService = new firebase_1.LeadAcquisitionService();
        const lead = await acquisitionService.acquireLead(dto, 'WEBHOOK_SYSTEM');
        res.status(200).json({ success: true, leadId: lead.id, eventId: dto.eventId });
    }
    catch (error) {
        console.error('Error capturing lead via webhook:', error);
        // Handle specific conflict error for idempotent retries safely
        if (error.message && error.message.includes('ALREADY_PROCESSED')) {
            res.status(200).json({ success: true, note: 'Idempotent request already processed', eventId: req.body.eventId });
            return;
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
//# sourceMappingURL=leadWebhooks.js.map