import { PUBLIC_PLOTS, PublicPlot } from '../data/publicVenturesData';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textTe?: string;
  recommendedPlots?: PublicPlot[];
  timestamp: string;
}

export interface AssistantResponse {
  replyText: string;
  recommendedPlots?: PublicPlot[];
}

/**
 * Mobile Domain AI Advisor Engine for Hyderabad & Telangana Open Plots (Telugu + English)
 */
export async function queryMobileRealEstateAssistant(
  userQuery: string,
  inventoryPlots: PublicPlot[] = PUBLIC_PLOTS
): Promise<AssistantResponse> {
  const queryLower = userQuery.toLowerCase();

  // 1. Budget & Plot Finder Matcher
  const hasBudgetMention =
    queryLower.includes('lakh') ||
    queryLower.includes('budget') ||
    queryLower.includes('price') ||
    queryLower.includes('cost') ||
    queryLower.includes('ధర') ||
    queryLower.includes('బడ్జెట్') ||
    /\d+\s*(l|lakh|cr|k|లక్ష)/i.test(queryLower);

  const hasFacingMention =
    queryLower.includes('east') ||
    queryLower.includes('west') ||
    queryLower.includes('north') ||
    queryLower.includes('south') ||
    queryLower.includes('తూర్పు') ||
    queryLower.includes('పడమర') ||
    queryLower.includes('ఉత్తరం') ||
    queryLower.includes('దక్షిణం');

  if (hasBudgetMention || hasFacingMention || queryLower.includes('plot') || queryLower.includes('ప్లాట్')) {
    let maxBudgetRupees = 15000000; // default 1.5 Cr
    const lakhMatch = queryLower.match(/(\d+)\s*(lakh|lakhs|l|లక్ష)/i);
    if (lakhMatch) {
      maxBudgetRupees = parseInt(lakhMatch[1], 10) * 100000;
    }

    let desiredFacing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | null = null;
    if (queryLower.includes('east') || queryLower.includes('తూర్పు')) desiredFacing = 'EAST';
    else if (queryLower.includes('west') || queryLower.includes('పడమర')) desiredFacing = 'WEST';
    else if (queryLower.includes('north') || queryLower.includes('ఉత్తరం')) desiredFacing = 'NORTH';
    else if (queryLower.includes('south') || queryLower.includes('దక్షిణం')) desiredFacing = 'SOUTH';

    const matchedPlots = inventoryPlots
      .filter((p) => {
        if (p.status === 'BOOKED' || p.status === 'REGISTERED') return false;
        if (p.totalPrice > maxBudgetRupees * 1.25) return false;
        if (desiredFacing && p.facing !== desiredFacing) return false;
        return true;
      })
      .slice(0, 3);

    if (matchedPlots.length > 0) {
      return {
        replyText: `మీ బడ్జెట్ మరియు ప్రాధాన్యతలకు అనుగుణంగా **${matchedPlots.length} ప్రీమియం ప్లాట్లు** లభించాయి:\n\n` +
          matchedPlots
            .map(
              (p) =>
                `• **ప్లాట్ #${p.plotNumber}** (${p.projectName})\n  - దిశ: ${p.facing} Facing\n  - విస్తీర్ణం: ${p.areaSqYds} Sq.Yds (${p.dimensions})\n  - మొత్తం ధర: **₹${(p.totalPrice / 100000).toFixed(2)} Lakhs**`
            )
            .join('\n\n') +
          `\n\nఈ ప్లాట్లను మీరు 48 గంటల పాటు టోకెన్ అడ్వాన్స్‌తో హోల్డ్ చేసుకోవచ్చు లేదా ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్ బుక్ చేసుకోవచ్చు!`,
        recommendedPlots: matchedPlots,
      };
    }
  }

  // 2. HMDA vs DTCP Inquiry
  if (
    queryLower.includes('hmda') ||
    queryLower.includes('dtcp') ||
    queryLower.includes('approval') ||
    queryLower.includes('ఆమోదం') ||
    queryLower.includes('తేడా')
  ) {
    return {
      replyText: `### HMDA vs DTCP లేఅవుట్ తేడాలు:\n\n` +
        `1. **HMDA (Hyderabad Metropolitan Development Authority)**:\n` +
        `   - హైదరాబాద్ మెట్రోపాలిటన్ పరిధిలో (మోకిల, శంకర్‌పల్లి, కొల్లూరు) ఉంటుంది.\n` +
        `   - 40 & 33 అడుగుల బీటీ రోడ్లు, భూగర్భ డ్రైనేజ్, విద్యుత్ & పార్కులు తప్పనిసరి.\n` +
        `   - తక్షణ గృహ నిర్మాణానికి మరియు వేగవంతమైన రేట్ల పెరుగుదలకు ఉత్తమం.\n\n` +
        `2. **DTCP (Directorate of Town & Country Planning)**:\n` +
        `   - హైవే కారిడార్లు (షాద్‌నగర్, శ్రీశైలం హైవే, RRR సమీపంలో) విస్తరిస్తుంది.\n` +
        `   - తక్కువ ప్రారంభ పెట్టుబడితో (₹11,000/Sq.Yd నుండి) అత్యధిక రాబడి (ROI).\n\n` +
        `మా అన్ని ప్రాజెక్టులు **100% RERA Registered** మరియు బ్యాంక్ లోన్ సదుపాయం కలవు!`,
    };
  }

  // 3. Mokila / Shankarpally Corridor
  if (
    queryLower.includes('mokila') ||
    queryLower.includes('shankarpally') ||
    queryLower.includes('మోకిల') ||
    queryLower.includes('శంకర్‌పల్లి')
  ) {
    return {
      replyText: `### మోకిల & శంకర్‌పల్లి కారిడార్ విశేషాలు:\n\n` +
        `• **ఫైనాన్షియల్ డిస్ట్రిక్ట్‌కు కేవలం 20 నిమిషాలు**: కోకాపేట్ నియోపోలిస్ & గచ్చిబౌలికి డైరెక్ట్ కనెక్టివిటీ.\n` +
        `• **టాప్ ఇంటర్నేషనల్ స్కూల్స్**: ఇండస్, గౌడియం వంటి ప్రముఖ స్కూల్స్ కలవు.\n` +
        `• **అద్భుతమైన గ్రోత్**: గత 3 ఏళ్లలో 40% పైగా భూమి విలువ పెరిగింది.\n` +
        `• **ప్రాజెక్ట్**: *Sunrise Enclave Mokila* - 25.5 ఎకరాల HMDA గేటెడ్ లేఅవుట్ (₹26,500/Sq.Yd నుండి).`,
    };
  }

  // 4. Site visit & Free Cab inquiry
  if (
    queryLower.includes('visit') ||
    queryLower.includes('cab') ||
    queryLower.includes('విజిట్') ||
    queryLower.includes('క్యాబ్') ||
    queryLower.includes('చూడాలి')
  ) {
    return {
      replyText: `### ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్:\n\n` +
        `మా కంపెనీ తరపున మీ ఇంటి నుండే ఉచిత ఏసీ క్యాబ్ పికప్ & డ్రాప్ సౌకర్యం ఉంది.\n\n` +
        `1. 'Site Visit' ట్యాబ్‌లోకి వెళ్లి మీ తేదీ & సమయం ఎంచుకోండి.\n` +
        `2. మా ప్రత్యేక డ్రైవర్ మిమ్మల్ని పికప్ చేసుకుని లేఅవుట్‌ను చూపిస్తారు.\n` +
        `3. లైవ్ డ్రైవర్ ట్రాకింగ్ మరియు తక్షణ కన్ఫర్మేషన్ లభిస్తుంది.`,
    };
  }

  // 5. Default Guidance
  return {
    replyText: `నమస్కారం! నేను మీ **Gemini AI రియల్ ఎస్టేట్ అసిస్టెంట్‌ని**.\n\n` +
      `హైదరాబాద్‌లోని ఓపెన్ ప్లాట్ల పెట్టుబడులు, HMDA/DTCP నిబంధనలు, మీ బడ్జెట్‌కు తగిన ప్లాట్లు మరియు ఉచిత సైట్ విజిట్ వివరాలలో మీకు సహాయం చేయగలను.\n\n` +
      `ఈ క్రింది ప్రశ్నలను అడగవచ్చు:\n` +
      `• *"తూర్పు ముఖం (East facing) ప్లాట్లు చూపించు"*\n` +
      `• *"HMDA మరియు DTCP మధ్య తేడాలు ఏమిటి?"*\n` +
      `• *"మోకిల ప్రాంతంలో ప్లాట్ల రేట్లు ఎలా ఉన్నాయి?"*\n` +
      `• *"ఉచిత క్యాబ్ సైట్ విజిట్ ఎలా బుక్ చేయాలి?"*`,
  };
}
