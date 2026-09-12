import { PUBLIC_PLOTS, PUBLIC_VENTURES, PublicPlot, PublicVenture } from '../data/venturesData';
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
 * Intelligent Real Estate Domain Engine for Hyderabad & Telangana
 */
export async function queryGeminiRealEstateAssistant(
  userQuery: string,
  language: SupportedLanguage = 'en',
  inventoryPlots: PublicPlot[] = PUBLIC_PLOTS
): Promise<AssistantResponse> {
  const queryLower = userQuery.toLowerCase();

  // Check if user is asking for plot recommendations / budget matching
  const hasBudgetMention =
    queryLower.includes('lakh') ||
    queryLower.includes('budget') ||
    queryLower.includes('price') ||
    queryLower.includes('cost') ||
    queryLower.includes('ధర') ||
    queryLower.includes('లక్ష') ||
    queryLower.includes('बजट') ||
    queryLower.includes('लाख') ||
    /\d+\s*(l|lakh|cr|k)/i.test(queryLower);

  const hasFacingMention =
    queryLower.includes('east') ||
    queryLower.includes('west') ||
    queryLower.includes('north') ||
    queryLower.includes('south') ||
    queryLower.includes('తూర్పు') ||
    queryLower.includes('పడమర') ||
    queryLower.includes('ఉత్తర') ||
    queryLower.includes('దక్షిణ') ||
    queryLower.includes('पूर्व') ||
    queryLower.includes('पश्चिम') ||
    queryLower.includes('उत्तर') ||
    queryLower.includes('दक्षिण');

  // 1. Budget & Plot Finder Matcher
  if (hasBudgetMention || hasFacingMention || queryLower.includes('plot') || queryLower.includes('ప్లాట్') || queryLower.includes('प्लॉट')) {
    // Extract max budget if possible
    let maxBudgetRupees = 15000000; // default 1.5 Cr
    const lakhMatch = queryLower.match(/(\d+)\s*(lakh|lakhs|l|లక్షలు|లక్ష|लाख)/i);
    if (lakhMatch) {
      maxBudgetRupees = parseInt(lakhMatch[1], 10) * 100000;
    }

    let desiredFacing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | null = null;
    if (queryLower.includes('east') || queryLower.includes('తూర్పు') || queryLower.includes('पूर्व')) desiredFacing = 'EAST';
    else if (queryLower.includes('west') || queryLower.includes('పడమర') || queryLower.includes('पश्चिम')) desiredFacing = 'WEST';
    else if (queryLower.includes('north') || queryLower.includes('ఉత్తర') || queryLower.includes('उत्तर')) desiredFacing = 'NORTH';
    else if (queryLower.includes('south') || queryLower.includes('దక్షిణ') || queryLower.includes('दक्षिण')) desiredFacing = 'SOUTH';

    const matchedPlots = inventoryPlots.filter((p) => {
      if (p.status === 'BOOKED') return false;
      if (p.totalPrice > maxBudgetRupees * 1.2) return false;
      if (desiredFacing && p.facing !== desiredFacing) return false;
      return true;
    }).slice(0, 3);

    if (matchedPlots.length > 0) {
      if (language === 'te') {
        return {
          replyText: `మీ బడ్జెట్ మరియు ప్రాధాన్యతలకు అనుగుణంగా **${matchedPlots.length} అత్యుత్తమ ప్లాట్లు** అందుబాటులో ఉన్నాయి:\n\n` +
            matchedPlots.map(p => `• **ప్లాట్ #${p.plotNumber}** (${p.projectName}): ${p.facing} ఫేసింగ్, ${p.areaSqYds} చ.గజాలు, మొత్తం ధర: **₹${(p.totalPrice / 100000).toFixed(2)} లక్షలు**`).join('\n') +
            `\n\nఈ ప్లాట్లకు 48 గంటల ధర స్థిరీకరణ హోల్డ్ సదుపాయం ఉంది. మీరు కింద ఉన్న ప్లాట్ కార్డుపై క్లిక్ చేసి నేరుగా హోల్డ్ చేయవచ్చు లేదా ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్ బుక్ చేయవచ్చు.`,
          recommendedPlots: matchedPlots,
        };
      } else if (language === 'hi') {
        return {
          replyText: `आपके बजट और पसंद के अनुसार **${matchedPlots.length} बेहतरीन प्लॉट्स** उपलब्ध हैं:\n\n` +
            matchedPlots.map(p => `• **प्लॉट #${p.plotNumber}** (${p.projectName}): ${p.facing} फेसिंग, ${p.areaSqYds} वर्ग गज, कुल मूल्य: **₹${(p.totalPrice / 100000).toFixed(2)} लाख**`).join('\n') +
            `\n\nइन प्लॉट्स पर 48 घंटे का टोकन होल्ड उपलब्ध है। नीचे दिए गए कार्ड से आप सीधे टोकन होल्ड कर सकते हैं या मुफ्त साइट विजिट शेड्यूल कर सकते हैं।`,
          recommendedPlots: matchedPlots,
        };
      } else {
        return {
          replyText: `Based on your criteria, I found **${matchedPlots.length} premium plots** matching your investment preference:\n\n` +
            matchedPlots.map(p => `• **Plot #${p.plotNumber}** at *${p.projectName}*: ${p.facing} Facing, ${p.areaSqYds} Sq.Yds (${p.dimensions}), Total Price: **₹${(p.totalPrice / 100000).toFixed(2)} Lakhs**`).join('\n') +
            `\n\nYou can freeze the price on any of these plots for 48 hours with a 100% refundable token advance, or book a complimentary AC cab site visit!`,
          recommendedPlots: matchedPlots,
        };
      }
    }
  }

  // 2. HMDA vs DTCP Inquiry
  if (queryLower.includes('hmda') || queryLower.includes('dtcp') || queryLower.includes('difference') || queryLower.includes('తేడా') || queryLower.includes('अंतर')) {
    if (language === 'te') {
      return {
        replyText: `### HMDA vs DTCP లేఅవుట్ అనుమతుల మధ్య తేడాలు:

1. **HMDA (హైదరాబాద్ మెట్రోపాలిటన్ డెవలప్‌మెంట్ అథారిటీ)**:
   - హైదరాబాద్ చుట్టూ 7,257 చ.కి.మీ పరిధిలో (ORR లోపల మరియు వెలుపల) వర్తిస్తుంది.
   - రోడ్ల వెడల్పు కనీసం 30 నుండి 40 అడుగుల బీటీ రోడ్లు, అండర్‌గ్రౌండ్ డ్రైనేజ్, విద్యుత్, వాకింగ్ ట్రాక్‌లతో కూడిన పార్కులు తప్పనిసరి.
   - త్వరగా ఇళ్ల నిర్మాణాలు మరియు వేగవంతమైన రేట్ల పెరుగుదల (అప్రిసియేషన్) కోసం అత్యుత్తమం.

2. **DTCP (డైరెక్టరేట్ ఆఫ్ టౌన్ అండ్ కంట్రీ ప్లానింగ్)**:
   - HMDA పరిధి దాటిన ప్రాంతాల్లో (షాద్‌నగర్, చౌటుప్పల్ తదితర మునిసిపాలిటీలు) రాష్ట్ర ప్రభుత్వ పట్టణ ప్రణాళిక విభాగం ఇచ్చే అనుమతి.
   - తక్కువ ప్రారంభ పెట్టుబడి (బడ్జెట్ ఫ్రెండ్లీ), దీర్ఘకాలిక పెట్టుబడికి అధిక రాబడి.

మా అన్ని వెంచర్లు **100% రెరా (RERA) రిజిస్టర్డ్** మరియు ప్రభుత్వ అనుమతులు పొందినవి.`,
      };
    } else if (language === 'hi') {
      return {
        replyText: `### HMDA और DTCP लेआउट में मुख्य अंतर:

1. **HMDA (हैदराबाद मेट्रोपॉलिटन डेवलपमेंट अथॉरिटी)**:
   - हैदराबाद और ओआरआर (ORR) के 7,257 वर्ग किमी क्षेत्र में लागू होता है।
   - न्यूनतम 30-40 फीट चौड़ी सड़कें, भूमिगत सीवरेज और पार्क अनिवार्य हैं।
   - तेजी से विला निर्माण और त्वरित पूंजी वृद्धि के लिए सर्वोत्तम।

2. **DTCP (टाउन एंड कंट्री प्लानिंग)**:
   - HMDA सीमा के बाहर (जैसे शादनगर, चौटुप्पल) राज्य स्तरीय स्वीकृति।
   - कम बजट में सुरक्षित दीर्घकालिक निवेश के लिए सबसे उपयुक्त।

हमारे सभी प्रोजेक्ट **100% रेरा (RERA) पंजीकृत** हैं।`,
      };
    } else {
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
  }

  // 3. Mokila / Shankarpally Corridor Inquiry
  if (queryLower.includes('mokila') || queryLower.includes('shankarpally') || queryLower.includes('west') || queryLower.includes('మోకిల') || queryLower.includes('శంకర్‌పల్లి') || queryLower.includes('मोकिला')) {
    if (language === 'te') {
      return {
        replyText: `### మోకిల & శంకర్‌పల్లి కారిడార్ ఎందుకు బెస్ట్ ఇన్వెస్ట్‌మెంట్?

- **ఫైనాన్షియల్ డిస్ట్రిక్ట్ & కోకాపేట్ నియోపోలిస్**: కేవలం 18-22 నిమిషాల డ్రైవింగ్ దూరంలో ఉంది.
- **ఇంటర్నేషనల్ స్కూల్స్**: ఇండస్, గౌడియం, ఓక్రిడ్జ్ వంటి టాప్ స్కూల్స్ సమీపంలో ఉన్నాయి.
- **గ్రోత్ రేట్**: గత 3 సంవత్సరాలలో మోకిలలో భూముల విలువ 40% పైగా పెరిగింది.
- **మా వెంచర్**: *Sunrise Enclave* లో 40 అడుగుల రోడ్లు, క్లబ్‌హౌస్, మరియు 100% వాస్తు ప్లాట్లు అందుబాటులో ఉన్నాయి.`,
      };
    } else {
      return {
        replyText: `### Why Invest in Mokila & Shankarpally Corridor?

- **Direct Proximity to IT Hubs**: Only 18-22 minutes drive from Financial District, Gachibowli, and Neopolis Kokapet via Shankarpally Highway.
- **Education & Lifestyle**: Surrounded by top international schools (Indus International, The Gaudium) and luxury villa communities.
- **Proven Appreciation**: Land values in Mokila have surged over 40% in the last 3 years due to rapid westward infrastructure expansion.
- **Featured Project**: *Sunrise Enclave - Mokila* features 25.5 acres of HMDA-approved villa plots starting at ₹26,500/sq.yd.`,
      };
    }
  }

  // 4. 48-Hour Token Hold Inquiry
  if (queryLower.includes('hold') || queryLower.includes('token') || queryLower.includes('48') || queryLower.includes('బుకింగ్') || queryLower.includes('హోల్డ్') || queryLower.includes('टोकन')) {
    if (language === 'te') {
      return {
        replyText: `### 48 గంటల ఆన్‌లైన్ ప్లాట్ హోల్డ్ ఎలా పనిచేస్తుంది?

1. **ప్లాట్ ఎంపిక**: లేఅవుట్ మ్యాప్ లేదా ఇన్వెంటరీలో మీకు నచ్చిన ప్లాట్‌ను ఎంచుకోండి.
2. **రిఫండబుల్ టోకెన్ అడ్వాన్స్**: ₹10,000 నుండి ₹1,00,000 వరకు టోకెన్ అడ్వాన్స్ చెల్లించండి (UPI / Card).
3. **48 గంటల ధర స్థిరీకరణ**: మీ ప్లాట్ 48 గంటల పాటు లాక్ చేయబడుతుంది. ఇతరులెవరూ దీనిని బుక్ చేయలేరు.
4. **సైట్ విజిట్ & పరిశీలన**: మా ఉచిత ఏసీ క్యాబ్‌లో సైట్‌ను సందర్శించి ఒరిజినల్ డాక్యుమెంట్లు పరిశీలించండి.
5. **100% రీఫండ్ గ్యారెంటీ**: మీకు ప్లాట్ నచ్చకపోతే ఎటువంటి ప్రశ్నలు లేకుండా మీ టోకెన్ మొత్తం పూర్తిగా వాపస్ చేయబడుతుంది!`,
      };
    } else {
      return {
        replyText: `### How the 48-Hour Online Plot Hold Works:

1. **Select Your Ideal Plot**: Browse the interactive layout map or plot explorer.
2. **Pay Fully Refundable Token**: Choose ₹10,000, ₹25,000, or ₹50,000 token advance via instant UPI / QR Code.
3. **Instant Price Freeze**: The plot is immediately locked under your name for 48 hours, freezing the rate and blocking rival buyers.
4. **Site Visit in Free AC Cab**: Visit the layout with our specialist to inspect physical boundary stones and 30-year link deeds.
5. **100% Money-Back Guarantee**: If you decide not to proceed for any reason, the entire token advance is refunded to your account within 24 hours.`,
      };
    }
  }

  // Default Guidance Response
  if (language === 'te') {
    return {
      replyText: `నమస్కారం! నేను మీ **జెమిని AI రియల్ ఎస్టేట్ సలహాదారుని**. 

హైదరాబాద్‌లోని HMDA/DTCP ఆమోదిత లేఅవుట్లు, మోకిల, శంకర్‌పల్లి, షాద్‌నగర్, కొల్లూరు కారిడార్లలో ప్లాట్లు, రిజిస్ట్రేషన్ మరియు బ్యాంక్ లోన్ల గురించి ఏదైనా అడగవచ్చు.

ఉదాహరణ ప్రశ్నలు:
• *"నా బడ్జెట్ ₹40 లక్షలు, తూర్పు ముఖం ప్లాట్లు చూపించు"*
• *"HMDA మరియు DTCP మధ్య తేడాలు ఏమిటి?"*
• *"48 గంటల ప్లాట్ హోల్డ్ ఎలా చేయాలి?"*
• *"ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్ ఎలా బుక్ చేయాలి?"*`,
    };
  } else if (language === 'hi') {
    return {
      replyText: `नमस्ते! मैं आपका **जेमिनी एआई रियल एस्टेट सलाहकार** हूँ। 

हैदराबाद के HMDA/DTCP प्रोजेक्ट्स, मोकिला, शंकरपल्ली, शादनगर गलियारों, रजिस्ट्री प्रक्रिया और बैंक ऋण के बारे में आप कुछ भी पूछ सकते हैं।

उदाहरण प्रश्न:
• *"₹50 लाख के बजट में पूर्व मुखी प्लॉट दिखाएं"*
• *"HMDA और DTCP में क्या अंतर है?"*
• *"48 घंटे का प्लॉट होल्ड कैसे करें?"*`,
    };
  } else {
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
}
