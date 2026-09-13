export type SupportedLanguage = 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
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
};

/**
 * Translates a key, returning English text or key name fallback
 */
export function getTranslation(key: string, _lang: SupportedLanguage = 'en'): string {
  if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return key;
}
