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
 * Intelligent Real Estate Domain Engine for Hyderabad & Telangana (English Only)
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

  // 2. HMDA vs DTCP Inquiry
  if (queryLower.includes('hmda') || queryLower.includes('dtcp') || queryLower.includes('difference')) {
    return {
      replyText: `### HMDA vs DTCP Layout Approvals:

1. **HMDA (Hyderabad Metropolitan Development Authority)**:
   - Governs the 7,257 sq.km metropolitan zone (ORR & adjoining urban clusters like Mokila, Shankarpally, Kollur).
   - Requires mandatory 40ft & 33ft BT roads, underground drainage, water pipelines, electricity, and dedicated park reservations.
   - Ideal for immediate villa construction and rapid 20-30% annual appreciation.

2. **DTCP (Directorate of Town & Country Planning)**:
   - Governs expanding corridors outside HMDA limits (such as Shadnagar, Srisailam Highway, Regional Ring Road nodes).
   - Lower entry ticket size (starting from ₹11,000/sq.yd) with massive upside from industrial and highway infrastructure.

All our layouts are **100% RERA Registered** with spot registration and SBI/HDFC bank loan pre-approvals!`,
    };
  }

  // 3. Mokila / Shankarpally Corridor Inquiry
  if (queryLower.includes('mokila') || queryLower.includes('shankarpally') || queryLower.includes('west')) {
    return {
      replyText: `### Why Invest in Mokila & Shankarpally Corridor?

- **Direct Proximity to IT Hubs**: Only 18-22 minutes drive from Financial District, Gachibowli, and Neopolis Kokapet via Shankarpally Highway.
- **Education & Lifestyle**: Surrounded by top international schools (Indus International, The Gaudium) and luxury villa communities.
- **Proven Appreciation**: Land values in Mokila have surged over 40% in the last 3 years due to rapid westward infrastructure expansion.
- **Featured Project**: *Sunrise Enclave - Mokila* features 25.5 acres of HMDA-approved villa plots starting at ₹26,500/sq.yd.`,
    };
  }

  // 4. 48-Hour Token Hold Inquiry
  if (queryLower.includes('hold') || queryLower.includes('token') || queryLower.includes('48')) {
    return {
      replyText: `### How the 48-Hour Online Plot Hold Works:

1. **Select Your Ideal Plot**: Browse the interactive layout map or plot explorer.
2. **Pay Fully Refundable Token**: Choose ₹10,000, ₹25,000, or ₹50,000 token advance via instant UPI / QR Code.
3. **Instant Price Freeze**: The plot is immediately locked under your name for 48 hours, freezing the rate and blocking rival buyers.
4. **Site Visit in Free AC Cab**: Visit the layout with our specialist to inspect physical boundary stones and 30-year link deeds.
5. **100% Money-Back Guarantee**: If you decide not to proceed for any reason, the entire token advance is refunded to your account within 24 hours.`,
    };
  }

  // Default Guidance Response
  return {
    replyText: `Hello! I am your **Gemini AI Real Estate Advisor**. 

I can assist you with Hyderabad growth corridors, HMDA vs DTCP regulatory guidelines, finding plots within your exact budget, and scheduling complimentary AC cab site visits.

Try asking:
• *"Show me East facing plots under ₹50 Lakhs"*
• *"Explain the differences between HMDA and DTCP"*
• *"Why should I invest in Mokila / Shankarpally?"*
• *"How does the 48-Hour price freeze hold work?"*`,
  };
}
