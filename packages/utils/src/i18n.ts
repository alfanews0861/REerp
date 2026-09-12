export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_ventures: 'Ventures & Layouts',
    nav_plots: 'Plot Explorer',
    nav_about: 'About Us',
    nav_contact: 'Contact',
    book_free_visit: 'Book Free Site Visit',
    complimentary_cab: 'Complimentary AC Cab for Weekend Site Visits',
    call_support: 'Call: +91 98765 43210',

    // Hero
    hero_title: 'Prime HMDA & DTCP Approved Gated Community Plots',
    hero_subtitle: "Secure your future with clear-title, 100% Vaastu compliant residential villa plots across Hyderabad's fastest growing corridors.",
    explore_ventures: 'Explore Approved Ventures',
    live_inventory: 'Live Plot Inventory',

    // Approvals
    hmda_approved: 'HMDA Approved',
    dtcp_approved: 'DTCP Approved',
    rera_approved: 'RERA Registered',
    clear_title: '100% Clear Title',
    vastu_compliant: '100% Vaastu Compliant',
    spot_registration: 'Spot Registration',
    bank_loans: 'Bank Loans Available',

    // Filters & Explorer
    inventory_title: 'Browse Open Plots & Villa Sites',
    inventory_subtitle: 'Filter by layout, facing direction, plot dimensions, and corner status to find your ideal investment.',
    filter_venture: 'Venture / Project',
    all_ventures: 'All Ventures',
    filter_facing: 'Facing Direction',
    any_facing: 'Any Facing',
    east_facing: 'East Facing',
    west_facing: 'West Facing',
    north_facing: 'North Facing',
    south_facing: 'South Facing',
    filter_size: 'Plot Size Range',
    all_sizes: 'All Sizes',
    small_size: 'Up to 180 Sq.Yds',
    medium_size: '180 - 260 Sq.Yds',
    large_size: '260+ Sq.Yds',
    filter_position: 'Plot Position',
    all_positions: 'All Plots (Regular & Corner)',
    corner_only: 'Corner Plots Only',
    corner_badge: 'CORNER',
    facing_label: 'Facing',
    area_label: 'Area',
    dimensions_label: 'Dimensions',
    price_label: 'Total Price',
    sq_yds: 'Sq.Yds',
    lakhs: 'Lakhs',
    found_plots: 'Found matching plots available across all layouts',

    // Statuses
    status_available: 'Available',
    status_fast_selling: 'Fast Selling',
    status_booked: 'Reserved (48h)',
    status_registered: 'Registered',

    // Actions
    view_card_grid: 'Card Grid View',
    view_layout_map: 'Interactive Layout Map',
    hold_plot_48h: 'Hold Plot (48h)',
    reserved_btn: 'Reserved',
    enquire_btn: 'Enquire',
    schedule_cab_visit: 'Schedule Free AC Cab',

    // Master Layout Map
    map_legend: 'Master Layout Legend',
    map_road_40ft: '40ft Main Boulevard Road',
    map_road_33ft: '33ft Internal Cross Road',
    map_park: 'Central Green Park & Play Area',
    map_clubhouse: 'Clubhouse & Amenities',
    map_entrance_arch: 'Grand Entrance Arch & Security',
    map_zoom_in: 'Zoom In',
    map_zoom_out: 'Zoom Out',
    map_reset: 'Reset View',
    map_click_instruction: 'Click on any plot to inspect dimensions, live pricing, and hold online.',
    map_selected_plot: 'Selected Plot Details',

    // 48H Hold
    hold_title: '48-Hour Price Freeze & Plot Hold',
    hold_guarantee: 'Zero-Risk 100% Refundable Token Advance',
    hold_receipt_generated: 'Official Booking Receipt Generated',

    // Gemini AI Assistant
    ai_advisor_title: 'Gemini AI Real Estate Advisor',
    ai_advisor_subtitle: 'Ask anything about Hyderabad corridors, HMDA vs DTCP rules, or budget plot recommendations.',
    ai_placeholder: "Ask Gemini AI (e.g., 'Show East facing plots under ₹50 Lakhs')...",
    ai_ask_button: 'Send',
    ai_quick_prompt_1: 'Plots under ₹50 Lakhs',
    ai_quick_prompt_2: 'HMDA vs DTCP differences',
    ai_quick_prompt_3: 'Why invest in Mokila / Shankarpally?',
    ai_quick_prompt_4: 'How does 48-Hour hold work?',
  },

  te: {
    // Nav
    nav_home: 'హోమ్',
    nav_ventures: 'వెంచర్స్ & లేఅవుట్లు',
    nav_plots: 'ప్లాట్ ఎక్స్‌ప్లోరర్',
    nav_about: 'మా గురించి',
    nav_contact: 'సంప్రదించండి',
    book_free_visit: 'ఉచిత సైట్ విజిట్ బుక్ చేయండి',
    complimentary_cab: 'వీకెండ్ సైట్ విజిట్లకు ఉచిత ఏసీ క్యాబ్ సౌకర్యం',
    call_support: 'కాల్ చేయండి: +91 98765 43210',

    // Hero
    hero_title: 'HMDA & DTCP ఆమోదిత ప్రీమియం గేటెడ్ కమ్యూనిటీ ప్లాట్లు',
    hero_subtitle: 'హైదరాబాద్ వేగంగా అభివృద్ధి చెందుతున్న ప్రధాన కారిడార్లలో 100% క్లియర్ టైటిల్, వాస్తు ఆమోదిత విల్లా ప్లాట్లతో మీ భవిష్యత్తును సురక్షితం చేసుకోండి.',
    explore_ventures: 'ఆమోదిత వెంచర్లను చూడండి',
    live_inventory: 'లైవ్ ప్లాట్ ఇన్వెంటరీ',

    // Approvals
    hmda_approved: 'HMDA ఆమోదితం',
    dtcp_approved: 'DTCP ఆమోదితం',
    rera_approved: 'రెరా (RERA) నమోదితం',
    clear_title: '100% క్లియర్ టైటిల్',
    vastu_compliant: '100% వాస్తు ఆమోదితం',
    spot_registration: 'స్పాట్ రిజిస్ట్రేషన్',
    bank_loans: 'బ్యాంక్ లోన్ సదుపాయం',

    // Filters & Explorer
    inventory_title: 'ఓపెన్ ప్లాట్లు & విల్లా సైట్లు పరిశీలించండి',
    inventory_subtitle: 'లేఅవుట్, ముఖం దిశ (ఫేసింగ్), ప్లాట్ పరిమాణం మరియు కార్నర్ స్థితి ఆధారంగా మీ కలల ప్లాట్‌ను ఎంచుకోండి.',
    filter_venture: 'వెంచర్ / ప్రాజెక్ట్',
    all_ventures: 'అన్ని వెంచర్లు',
    filter_facing: 'ముఖం దిశ (ఫేసింగ్)',
    any_facing: 'ఏ ముఖమైనా',
    east_facing: 'తూర్పు ముఖం (East)',
    west_facing: 'పడమర ముఖం (West)',
    north_facing: 'ఉత్తర ముఖం (North)',
    south_facing: 'దక్షిణ ముఖం (South)',
    filter_size: 'ప్లాట్ పరిమాణం',
    all_sizes: 'అన్ని పరిమాణాలు',
    small_size: '180 గజాల వరకు',
    medium_size: '180 నుండి 260 గజాలు',
    large_size: '260+ గజాలు',
    filter_position: 'ప్లాట్ రకం',
    all_positions: 'అన్ని ప్లాట్లు (సాధారణ & కార్నర్)',
    corner_only: 'కార్నర్ ప్లాట్లు మాత్రమే',
    corner_badge: 'కార్నర్',
    facing_label: 'ఫేసింగ్',
    area_label: 'వైశాల్యం',
    dimensions_label: 'కొలతలు',
    price_label: 'మొత్తం ధర',
    sq_yds: 'చ.గజాలు',
    lakhs: 'లక్షలు',
    found_plots: 'అందుబాటులో ఉన్న ప్లాట్లు దొరికాయి',

    // Statuses
    status_available: 'అందుబాటులో ఉంది',
    status_fast_selling: 'వేగంగా అమ్ముడవుతోంది',
    status_booked: '48 గంటల రిజర్వేషన్',
    status_registered: 'రిజిస్టర్ చేయబడింది',

    // Actions
    view_card_grid: 'కార్డుల గ్రిడ్ వీక్షణ',
    view_layout_map: 'ఇంటరాక్టివ్ లేఅవుట్ మ్యాప్',
    hold_plot_48h: 'ప్లాట్ హోల్డ్ చేయండి (48గం)',
    reserved_btn: 'రిజర్వ్ చేయబడింది',
    enquire_btn: 'వివరాలు అడగండి',
    schedule_cab_visit: 'ఉచిత ఏసీ క్యాబ్ షెడ్యూల్ చేయండి',

    // Master Layout Map
    map_legend: 'లేఅవుట్ ప్లాన్ సూచిక',
    map_road_40ft: '40 అడుగుల మెయిన్ రోడ్డు',
    map_road_33ft: '33 అడుగుల అంతర్గత క్రాస్ రోడ్డు',
    map_park: 'సెంట్రల్ గ్రీన్ పార్క్ & ఆట స్థలం',
    map_clubhouse: 'క్లబ్‌హౌస్ & వినోద కేంద్రం',
    map_entrance_arch: 'గ్రాండ్ ఎంట్రన్స్ ఆర్చ్ & సెక్యూరిటీ',
    map_zoom_in: 'పెద్దదిగా (Zoom In)',
    map_zoom_out: 'చిన్నదిగా (Zoom Out)',
    map_reset: 'రీసెట్ వీక్షణ',
    map_click_instruction: 'కొలతలు, లైవ్ ధర చూడటానికి మరియు ఆన్‌లైన్‌లో హోల్డ్ చేయడానికి ఏదైనా ప్లాట్‌పై క్లిక్ చేయండి.',
    map_selected_plot: 'ఎంచుకున్న ప్లాట్ వివరాలు',

    // 48H Hold
    hold_title: '48 గంటల ధర స్థిరీకరణ & ప్లాట్ హోల్డ్',
    hold_guarantee: '100% రీఫండబుల్ జీరో-రిస్క్ టోకెన్ అడ్వాన్స్',
    hold_receipt_generated: 'అధికారిక బుకింగ్ రసీదు సిద్ధమైంది',

    // Gemini AI Assistant
    ai_advisor_title: 'జెమిని AI రియల్ ఎస్టేట్ సలహాదారు',
    ai_advisor_subtitle: 'హైదరాబాద్ కారిడార్లు, HMDA / DTCP నియమాలు లేదా మీ బడ్జెట్‌లోని ప్లాట్ల గురించి అడగండి.',
    ai_placeholder: "జెమిని AI ని అడగండి (ఉదా: '₹50 లక్షల లోపు తూర్పు ముఖం ప్లాట్లు చూపించు')...",
    ai_ask_button: 'పంపండి',
    ai_quick_prompt_1: '₹50 లక్షల లోపు ప్లాట్లు',
    ai_quick_prompt_2: 'HMDA vs DTCP తేడాలు ఏమిటి?',
    ai_quick_prompt_3: 'మోకిల / శంకర్‌పల్లిలో ఎందుకు పెట్టుబడి పెట్టాలి?',
    ai_quick_prompt_4: '48 గంటల ప్లాట్ హోల్డ్ ఎలా పనిచేస్తుంది?',
  },

  hi: {
    // Nav
    nav_home: 'होम',
    nav_ventures: 'वेंचर्स और लेआउट्स',
    nav_plots: 'प्लाट एक्सप्लोरर',
    nav_about: 'हमारे बारे में',
    nav_contact: 'संपर्क करें',
    book_free_visit: 'मुफ्त साइट विजिट बुक करें',
    complimentary_cab: 'वीकेंड साइट विजिट के लिए मुफ्त एसी कैब सुविधा',
    call_support: 'कॉल करें: +91 98765 43210',

    // Hero
    hero_title: 'HMDA और DTCP स्वीकृत प्रीमियम गेटेड कम्युनिटी प्लॉट्स',
    hero_subtitle: 'हैदराबाद के सबसे तेजी से बढ़ते विकास गलियारों में 100% स्पष्ट टाइटल और वास्तु सम्मत विला प्लॉट्स के साथ अपना भविष्य सुरक्षित करें।',
    explore_ventures: 'स्वीकृत वेंचर्स देखें',
    live_inventory: 'लाइव प्लॉट इन्वेंटरी',

    // Approvals
    hmda_approved: 'HMDA स्वीकृत',
    dtcp_approved: 'DTCP स्वीकृत',
    rera_approved: 'रेरा (RERA) पंजीकृत',
    clear_title: '100% स्पष्ट टाइटल',
    vastu_compliant: '100% वास्तु सम्मत',
    spot_registration: 'तत्काल पंजीकरण',
    bank_loans: 'बैंक ऋण उपलब्ध',

    // Filters & Explorer
    inventory_title: 'खुले भूखंड और विला साइट्स देखें',
    inventory_subtitle: 'लेआउट, दिशा, आकार और कॉर्नर स्थिति के अनुसार अपने उपयुक्त निवेश का चयन करें।',
    filter_venture: 'वेंचर / प्रोजेक्ट',
    all_ventures: 'सभी वेंचर्स',
    filter_facing: 'दिशा (फेसिंग)',
    any_facing: 'कोई भी दिशा',
    east_facing: 'पूर्व मुखी (East)',
    west_facing: 'पश्चिम मुखी (West)',
    north_facing: 'उत्तर मुखी (North)',
    south_facing: 'दक्षिण मुखी (South)',
    filter_size: 'प्लॉट आकार सीमा',
    all_sizes: 'सभी आकार',
    small_size: '180 वर्ग गज तक',
    medium_size: '180 - 260 वर्ग गज',
    large_size: '260+ वर्ग गज',
    filter_position: 'प्लॉट प्रकार',
    all_positions: 'सभी प्लॉट्स (नियमित और कॉर्नर)',
    corner_only: 'केवल कॉर्नर प्लॉट्स',
    corner_badge: 'कॉर्नर',
    facing_label: 'दिशा',
    area_label: 'क्षेत्रफल',
    dimensions_label: 'आयाम',
    price_label: 'कुल मूल्य',
    sq_yds: 'वर्ग गज',
    lakhs: 'लाख',
    found_plots: 'उपलब्ध प्लॉट्स मिले',

    // Statuses
    status_available: 'उपलब्ध',
    status_fast_selling: 'तेजी से बिक रहा',
    status_booked: '48 घंटे के लिए आरक्षित',
    status_registered: 'पंजीकृत',

    // Actions
    view_card_grid: 'कार्ड ग्रिड दृश्य',
    view_layout_map: 'इंटरैक्टिव लेआउट मैप',
    hold_plot_48h: 'प्लॉट होल्ड करें (48 घंटे)',
    reserved_btn: 'आरक्षित',
    enquire_btn: 'पूछताछ करें',
    schedule_cab_visit: 'मुफ्त एसी कैब शेड्यूल करें',

    // Master Layout Map
    map_legend: 'मास्टर लेआउट संकेत',
    map_road_40ft: '40 फीट मुख्य मार्ग',
    map_road_33ft: '33 फीट आंतरिक क्रॉस रोड',
    map_park: 'केंद्रीय ग्रीन पार्क और खेल का मैदान',
    map_clubhouse: 'क्लबहाउस और सुविधाएं',
    map_entrance_arch: 'भव्य प्रवेश द्वार और सुरक्षा',
    map_zoom_in: 'ज़ूम इन',
    map_zoom_out: 'ज़ूम आउट',
    map_reset: 'रीसेट दृश्य',
    map_click_instruction: 'आयाम, मूल्य देखने और ऑनलाइन होल्ड करने के लिए किसी भी प्लॉट पर क्लिक करें।',
    map_selected_plot: 'चयनित प्लॉट विवरण',

    // 48H Hold
    hold_title: '48 घंटे का मूल्य स्थिरीकरण और प्लॉट होल्ड',
    hold_guarantee: '100% वापसी योग्य जीरो-रिस्क टोकन अग्रिम',
    hold_receipt_generated: 'आधिकारिक बुकिंग रसीद तैयार',

    // Gemini AI Assistant
    ai_advisor_title: 'जेमिनी एआई रियल एस्टेट सलाहकार',
    ai_advisor_subtitle: 'हैदराबाद कॉरिडोर, HMDA / DTCP नियमों या अपने बजट में प्लॉट्स के बारे में पूछें।',
    ai_placeholder: "जेमिनी एआई से पूछें (उदा: '₹50 लाख के अंदर पूर्व मुखी प्लॉट दिखाएं')...",
    ai_ask_button: 'भेजें',
    ai_quick_prompt_1: '₹50 लाख के भीतर प्लॉट्स',
    ai_quick_prompt_2: 'HMDA और DTCP में क्या अंतर है?',
    ai_quick_prompt_3: 'मोकिला / शंकरपल्ली में निवेश क्यों करें?',
    ai_quick_prompt_4: '48 घंटे का प्लॉट होल्ड कैसे काम करता है?',
  },
};

/**
 * Translates a key for the given language, falling back to English or key name
 */
export function getTranslation(key: string, lang: SupportedLanguage = 'en'): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (dictionary[key]) {
    return dictionary[key];
  }
  // Fallback to English
  if (TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return key;
}
