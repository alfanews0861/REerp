import { PUBLIC_PLOTS, PublicPlot } from '../data/venturesData';
import { SupportedLanguage } from '@real-estate-erp/utils';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedPlots?: PublicPlot[];
  timestamp: string;
}

export interface AssistantResponse {
  replyText: string;
  recommendedPlots?: PublicPlot[];
}

/**
 * Intelligent Real Estate Domain Engine for Nellore & Andhra Pradesh (English Only)
 */
export async function queryGeminiRealEstateAssistant(
  userQuery: string,
  _language: SupportedLanguage = 'en',
  inventoryPlots: PublicPlot[] = PUBLIC_PLOTS
): Promise<AssistantResponse> {
  const queryLower = userQuery.toLowerCase();

  // Check if user is asking for plot recommendations / budget matching
  const hasBudgetMention =
    queryLower.includes('lakh') ||
    queryLower.includes('budget') ||
    queryLower.includes('price') ||
    queryLower.includes('cost') ||
    /\d+\s*(l|lakh|cr|k)/i.test(queryLower);

  const hasFacingMention =
    queryLower.includes('east') ||
    queryLower.includes('west') ||
    queryLower.includes('north') ||
    queryLower.includes('south');

  // 1. Budget & Plot Finder Matcher
  if (hasBudgetMention || hasFacingMention || queryLower.includes('plot')) {
    // Extract max budget if possible
    let maxBudgetRupees = 15000000; // default 1.5 Cr
    const lakhMatch = queryLower.match(/(\d+)\s*(lakh|lakhs|l)/i);
    if (lakhMatch) {
      maxBudgetRupees = parseInt(lakhMatch[1], 10) * 100000;
    }

    let desiredFacing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | null = null;
    if (queryLower.includes('east')) desiredFacing = 'EAST';
    else if (queryLower.includes('west')) desiredFacing = 'WEST';
    else if (queryLower.includes('north')) desiredFacing = 'NORTH';
    else if (queryLower.includes('south')) desiredFacing = 'SOUTH';

    const matchedPlots = inventoryPlots.filter((p) => {
      if (p.status === 'BOOKED') return false;
      if (p.totalPrice > maxBudgetRupees * 1.2) return false;
      if (desiredFacing && p.facing !== desiredFacing) return false;
      return true;
    }).slice(0, 3);

    if (matchedPlots.length > 0) {
      return {
        replyText: `Based on your criteria, I found **${matchedPlots.length} premium plots** matching your investment preference:\n\n` +
          matchedPlots.map(p => `• **Plot #${p.plotNumber}** at *${p.projectName}*: ${p.facing} Facing, ${p.areaSqYds} Sq.Yds (${p.dimensions}), Total Price: **₹${(p.totalPrice / 100000).toFixed(2)} Lakhs**`).join('\n') +
          `\n\nYou can freeze the price on any of these plots for 48 hours with a 100% refundable token advance, or book a complimentary AC cab site visit!`,
        recommendedPlots: matchedPlots,
      };
    }
  }

  // 2. NUDA / HMDA vs DTCP Inquiry
  if (queryLower.includes('nuda') || queryLower.includes('hmda') || queryLower.includes('dtcp') || queryLower.includes('difference')) {
    return {
      replyText: `### NUDA vs DTCP Layout Approvals in Andhra Pradesh:

1. **NUDA (Nellore Urban Development Authority)**:
   - Governs the Nellore urban and metropolitan expansion limits (including Podalakur Road, Mini Bypass, and Chinthareddypalem).
   - Requires mandatory 60ft, 40ft & 33ft BT roads, underground drainage, water pipelines, electricity, avenue plantation, and dedicated civic park reservations.
   - Ideal for immediate villa construction and rapid capital appreciation.

2. **DTCP (Directorate of Town & Country Planning - AP)**:
   - Governs expanding regional corridors (such as Nellore-Bombay Highway, Kovuru, and national highway nodes).
   - Attractive entry ticket size (starting from ₹12,500/sq.yd) with high ROI driven by highway expansion and industrial connectivity.

All our layouts are **100% AP RERA Registered** with spot registration and SBI/HDFC bank loan approvals!`,
    };
  }

  // 3. Podalakur Road / Bombay Highway / Nellore Corridor Inquiry
  if (queryLower.includes('podalakur') || queryLower.includes('bombay') || queryLower.includes('kovur') || queryLower.includes('nellore')) {
    return {
      replyText: `### Why Invest in Podalakur Road & Nellore Corridors?

- **Strategic Infrastructure Growth**: Fast-track 4-lane road expansion and direct connectivity to Nellore city center (10-15 mins from Annamayya Circle).
- **Educational & Commercial Hub**: Surrounded by reputed schools, engineering colleges (Narayana, Rao's) and medical institutions.
- **Proven Appreciation**: Land values along Podalakur Road have grown consistently at 18-25% CAGR over the last 3 years.
- **Featured Flagship Projects**: 
  - *ISKON City - 2* on Podalakur Road (120-acre mega township with 170ft entrance road).
  - *Dream City* near Nellore-Bombay Highway (DTCP approved gated venture).`,
    };
  }

  // 4. 48-Hour Token Hold Inquiry
  if (queryLower.includes('hold') || queryLower.includes('token') || queryLower.includes('48')) {
    return {
      replyText: `### How the 48-Hour Online Plot Hold Works:

1. **Select Your Ideal Plot**: Browse the interactive layout map or plot explorer.
2. **Pay Fully Refundable Token**: Choose ₹10,000, ₹25,000, or ₹50,000 token advance via instant UPI / QR Code.
3. **Instant Price Freeze**: The plot is immediately locked under your name for 48 hours, freezing the rate and blocking rival buyers.
4. **Site Visit in Free AC Cab**: Visit the layout with our specialist in Nellore to inspect physical boundary stones and 30-year link deeds.
5. **100% Money-Back Guarantee**: If you decide not to proceed for any reason, the entire token advance is refunded to your account within 24 hours.`,
    };
  }

  // Default Guidance Response
  return {
    replyText: `Hello! I am your **Gemini AI Real Estate Advisor** for **ISKON Developers**. 

I can assist you with Nellore growth corridors, NUDA vs DTCP regulatory guidelines, finding plots within your exact budget, and scheduling complimentary AC cab site visits in Nellore.

Try asking:
• *"Show me East facing plots under ₹40 Lakhs"*
• *"Explain the differences between NUDA and DTCP"*
• *"Why should I invest in Podalakur Road / Bombay Highway?"*
• *"How does the 48-Hour price freeze hold work?"*`,
  };
}
