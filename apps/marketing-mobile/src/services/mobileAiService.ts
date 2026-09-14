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
 * Mobile Domain AI Advisor Engine for Nellore & Andhra Pradesh Open Plots (Telugu + English)
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

  // 2. NUDA / HMDA vs DTCP Inquiry
  if (
    queryLower.includes('nuda') ||
    queryLower.includes('hmda') ||
    queryLower.includes('dtcp') ||
    queryLower.includes('approval') ||
    queryLower.includes('ఆమోదం') ||
    queryLower.includes('తేడా')
  ) {
    return {
      replyText: `### NUDA vs DTCP AP లేఅవుట్ తేడాలు:\n\n` +
        `1. **NUDA (Nellore Urban Development Authority)**:\n` +
        `   - నెల్లూరు అర్బన్ & పొదలకూరు రోడ్, చింతారెడ్డిపాలెం పరిధిలో ఉంటుంది.\n` +
        `   - 60, 40 & 33 అడుగుల బీటీ రోడ్లు, భూగర్భ డ్రైనేజ్, విద్యుత్ & పార్కులు తప్పనిసరి.\n` +
        `   - తక్షణ గృహ నిర్మాణానికి మరియు వేగవంతమైన రేట్ల పెరుగుదలకు ఉత్తమం (*ఉదా: ISKON City - 2*).\n\n` +
        `2. **DTCP AP (Directorate of Town & Country Planning)**:\n` +
        `   - హైవే కారిడార్లు (నెల్లూరు-బొంబాయి హైవే, కొవూరు పరిసరాల్లో) విస్తరిస్తుంది.\n` +
        `   - తక్కువ ప్రారంభ పెట్టుబడితో (₹12,500/Sq.Yd నుండి) అత్యధిక రాబడి (ROI) (*ఉదా: Dream City*).\n\n` +
        `మా అన్ని ప్రాజెక్టులు **100% AP RERA Registered** మరియు బ్యాంక్ లోన్ సదుపాయం కలవు!`,
    };
  }

  // 3. Podalakur Road / Kovur / Nellore Corridors
  if (
    queryLower.includes('podalakur') ||
    queryLower.includes('kovur') ||
    queryLower.includes('nellore') ||
    queryLower.includes('పొదలకూరు') ||
    queryLower.includes('కొవూరు') ||
    queryLower.includes('నెల్లూరు')
  ) {
    return {
      replyText: `### నెల్లూరు గ్రోత్ కారిడార్ల విశేషాలు:\n\n` +
        `• **పొదలకూరు రోడ్ కారిడార్**: 170 అడుగుల మెయిన్ రోడ్డుతో 120 ఎకరాల మెగా గేటెడ్ టౌన్‌షిప్ **ISKON City - 2** (₹18,500/Sq.Yd నుండి).\n` +
        `• **నెల్లూరు-బొంబాయి హైవే & కొవూరు**: హై-గ్రోత్ గేటెడ్ లేఅవుట్ **Dream City** (₹12,500/Sq.Yd నుండి).\n` +
        `• **చింతారెడ్డిపాలెం అర్బన్ బెల్ట్**: అల్ట్రా-లగ్జరీ విల్లా ప్లాట్లు **ISKON Brundhavanam** (₹22,000/Sq.Yd నుండి).\n` +
        `• **కనెక్టివిటీ**: అన్నమయ్య సర్కిల్, మినీ బైపాస్ రోడ్డు మరియు రైల్వే స్టేషన్‌కు 10-15 నిమిషాల్లో ప్రయాణం.`,
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
      replyText: `### ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్ (నెల్లూరు):\n\n` +
        `ISKON Developers తరపున నెల్లూరులో మీ ఇంటి నుండే ఉచిత ఏసీ క్యాబ్ పికప్ & డ్రాప్ సౌకర్యం ఉంది.\n\n` +
        `1. 'Site Visit' ట్యాబ్‌లోకి వెళ్లి మీ తేదీ & సమయం ఎంచుకోండి.\n` +
        `2. మా ప్రత్యేక డ్రైవర్ మిమ్మల్ని పికప్ చేసుకుని లేఅవుట్‌ను చూపిస్తారు.\n` +
        `3. లైవ్ డ్రైవర్ GPS ట్రాకింగ్ మరియు తక్షణ కన్ఫర్మేషన్ లభిస్తుంది.`,
    };
  }

  // 5. Default Guidance
  return {
    replyText: `నమస్కారం! నేను **ISKON Developers Gemini AI రియల్ ఎస్టేట్ అసిస్టెంట్‌ని**.\n\n` +
      `నెల్లూరులోని ఓపెన్ ప్లాట్ల పెట్టుబడులు (ISKON City - 2, Dream City), NUDA/DTCP నిబంధనలు, మీ బడ్జెట్‌కు తగిన ప్లాట్లు మరియు ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్ వివరాలలో మీకు సహాయం చేయగలను.\n\n` +
      `ఈ క్రింది ప్రశ్నలను అడగవచ్చు:\n` +
      `• *"తూర్పు ముఖం (East facing) ప్లాట్లు చూపించు"*\n` +
      `• *"NUDA మరియు DTCP AP మధ్య తేడాలు ఏమిటి?"*\n` +
      `• *"పొదలకూరు రోడ్ / ISKON City - 2 లో ప్లాట్ల రేట్లు ఎలా ఉన్నాయి?"*\n` +
      `• *"ఉచిత క్యాబ్ సైట్ విజిట్ ఎలా బుక్ చేయాలి?"*`,
  };
}
