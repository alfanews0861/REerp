import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { useMobileTheme } from '../theme';
import { Badge } from './Badge';
import {
  X,
  Home,
  Users,
  MapPin,
  CalendarCheck,
  Car,
  Receipt,
  Layers,
  Award,
  Network,
  Globe,
  Navigation,
  UserCheck,
  Moon,
  Sun,
  PhoneCall,
  LogOut,
  Building2,
  Crown,
  User,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  UserPlus,
  Sparkles,
  LogIn,
} from 'lucide-react-native';

interface MobileDrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export type UserRoleType =
  | 'super_admin'
  | 'admin'
  | 'director'
  | 'ceo'
  | 'gm'
  | 'cgm'
  | 'manager'
  | 'team_lead'
  | 'sales_executive'
  | 'sales_agent'
  | 'field_agent'
  | 'telecaller'
  | 'driver'
  | 'fleet_driver';

export interface NavItemConfig {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  icon: any;
  iconBg: string;
  allowedRoles: ('admin' | 'manager' | 'agent' | 'telecaller' | 'driver')[];
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useMobileTheme();

  // 1. RBAC ROLE RESOLUTION
  const isAuthenticated = !!user;
  const rawRole = (user?.cadre || user?.role || '').toLowerCase();

  const isAdmin =
    isAuthenticated &&
    (rawRole.includes('admin') ||
      rawRole.includes('director') ||
      rawRole.includes('super_admin') ||
      rawRole.includes('ceo') ||
      rawRole.includes('cgm') ||
      rawRole.includes('gm'));

  const isManager =
    isAuthenticated &&
    !isAdmin &&
    (rawRole.includes('manager') ||
      rawRole.includes('team_lead') ||
      rawRole.includes('lead'));

  const isTelecaller = isAuthenticated && !isAdmin && rawRole.includes('telecaller');
  const isDriver = isAuthenticated && !isAdmin && rawRole.includes('driver');
  const isAgent = isAuthenticated && !isAdmin && !isManager && !isTelecaller && !isDriver;

  const currentRoleCategory: 'admin' | 'manager' | 'agent' | 'telecaller' | 'driver' =
    isAdmin
      ? 'admin'
      : isManager
      ? 'manager'
      : isTelecaller
      ? 'telecaller'
      : isDriver
      ? 'driver'
      : 'agent';

  const formatRole = (role?: string) => {
    if (!role) return 'Field Associate';
    return role.replace(/_/g, ' ').toUpperCase();
  };

  const getRoleBadgeVariant = (): 'primary' | 'gold' | 'emerald' | 'info' => {
    if (isAdmin) return 'gold';
    if (isManager) return 'primary';
    if (isTelecaller) return 'info';
    if (isDriver) return 'emerald';
    return 'primary';
  };

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      try {
        router.push(route as any);
      } catch (err) {
        console.warn('Navigation error:', err);
      }
    }, 80);
  };

  const handleSupportCall = () => {
    onClose();
    Linking.openURL('tel:+919848012345').catch(() => {
      Alert.alert('Helpline', 'Contact Head Office at +91 98480 12345');
    });
  };

  const handleLogout = async () => {
    onClose();
    setTimeout(async () => {
      await logout();
      router.replace('/login');
    }, 100);
  };

  // 2. RBAC PERMISSION-GUARDED NAV CONFIGURATION
  // Section A: Operational Desk & CRM
  const crmNavItems: NavItemConfig[] = [
    {
      id: 'home',
      title: 'Home Dashboard',
      subtitle: isAdmin
        ? 'Executive Command Center'
        : isTelecaller
        ? 'Telecaller Calling Hub'
        : isDriver
        ? 'Fleet & Driver Console'
        : isManager
        ? 'Management Pipeline Desk'
        : 'Field Agent & Marketing Desk',
      route: '/',
      icon: Home,
      iconBg: '#3B82F6',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'],
    },
    {
      id: 'leads',
      title: 'Leads & Inquiries',
      subtitle: isTelecaller ? 'My Inbound Calls & Queue' : 'Prospects CRM & Follow-ups',
      route: '/(tabs)/leads',
      icon: Users,
      iconBg: '#7C3AED',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller'],
    },
    {
      id: 'add-lead',
      title: '+ Add Direct Lead',
      subtitle: 'Self-sourced customer registration',
      route: '/(tabs)/leads',
      icon: UserPlus,
      iconBg: '#1E40AF',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller'],
    },
    {
      id: 'visits',
      title: 'Site Visits',
      subtitle: isTelecaller ? 'Book Client Site Tours' : 'Customer Visits & Inspections',
      route: '/(tabs)/visits',
      icon: MapPin,
      iconBg: '#059669',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller'],
    },
    {
      id: 'attendance',
      title: 'Geo Attendance',
      subtitle: 'Shift punch-in & GPS verify',
      route: '/(tabs)/attendance',
      icon: CalendarCheck,
      iconBg: '#EA580C',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'],
    },
    {
      id: 'trips',
      title: 'Trips & Fleet GPS',
      subtitle: 'Assigned trips & live tracking',
      route: '/(tabs)/trips',
      icon: Car,
      iconBg: '#2563EB',
      allowedRoles: ['admin', 'driver', 'manager'],
    },
    {
      id: 'expenses',
      title: 'Expenses & Claims',
      subtitle: isDriver ? 'Fuel & diesel claim bills' : 'Travel & food reimbursement',
      route: '/(tabs)/expenses',
      icon: Receipt,
      iconBg: '#D97706',
      allowedRoles: ['admin', 'manager', 'agent', 'driver'],
    },
  ];

  // Section B: Ventures & Business
  const businessNavItems: NavItemConfig[] = [
    {
      id: 'inventory',
      title: 'Plot Inventory & Layout',
      subtitle: 'NUDA & DTCP layouts & status',
      route: '/inventory',
      icon: Layers,
      iconBg: '#0D9488',
      allowedRoles: ['admin', 'manager', 'agent'],
    },
    {
      id: 'commission',
      title: 'My Commission & Payouts',
      subtitle: 'Realized earnings & TDS history',
      route: '/commission',
      icon: Award,
      iconBg: '#F59E0B',
      allowedRoles: ['admin', 'manager', 'agent'],
    },
    {
      id: 'network',
      title: 'Team & Network',
      subtitle: 'Downline tree & associates',
      route: '/network',
      icon: Network,
      iconBg: '#6366F1',
      allowedRoles: ['admin', 'manager', 'agent'],
    },
  ];

  // Section C: Portals & Tools
  const portalNavItems: NavItemConfig[] = [
    {
      id: 'public-site',
      title: 'Customer Website & Explorer',
      subtitle: 'Public plots, brochures & AI',
      route: '/public-site',
      icon: Globe,
      iconBg: '#0284C7',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'],
    },
    {
      id: 'start-visit',
      title: 'Start Site Visit Tour',
      subtitle: 'Begin live client GPS tour',
      route: '/visit/start',
      icon: Navigation,
      iconBg: '#10B981',
      allowedRoles: ['admin', 'manager', 'agent'],
    },
    {
      id: 'profile',
      title: 'KYC & Employee Profile',
      subtitle: 'ID card, bank & PAN details',
      route: '/register-profile',
      icon: UserCheck,
      iconBg: '#475569',
      allowedRoles: ['admin', 'manager', 'agent', 'telecaller', 'driver'],
    },
  ];

  // 3. FILTER ITEMS BASED ON USER'S RBAC ROLE
  const allowedCrmItems = crmNavItems.filter((item) =>
    item.allowedRoles.includes(currentRoleCategory)
  );

  const allowedBusinessItems = businessNavItems.filter((item) =>
    item.allowedRoles.includes(currentRoleCategory)
  );

  const allowedPortalItems = portalNavItems.filter((item) =>
    item.allowedRoles.includes(currentRoleCategory)
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* Backdrop Tapper */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Slide-out Drawer Container */}
        <View
          style={[
            styles.drawerContent,
            {
              backgroundColor: colors.surfaceCard,
              paddingTop: Math.max(insets.top, 16) + 8,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
        >
          {/* 1. BRAND HEADER & CLOSE BUTTON */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={{ width: 38, height: 38 }}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.brandInfo}>
                <Text style={[styles.companyName, { color: colors.textPrimary }]}>
                  ISKON DEVELOPERS
                </Text>
                <Text style={styles.companySubtitle}>NELLORE • TOWNSHIPS</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }]}
              activeOpacity={0.7}
              accessibilityLabel="Close Menu"
            >
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* 2. USER PROFILE SNAPSHOT OR GUEST VISITOR CARD */}
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                style={styles.profileCard}
                onPress={() => handleNavigate('/register-profile')}
                activeOpacity={0.8}
              >
                <View style={styles.profileAvatar}>
                  {isAdmin ? (
                    <Crown size={22} color="#F59E0B" />
                  ) : (
                    <User size={22} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {user?.displayName || user?.email?.split('@')[0] || 'Associate Partner'}
                  </Text>
                  <View style={styles.profileBadgeRow}>
                    <Badge
                      label={formatRole(user?.cadre || user?.role)}
                      variant={getRoleBadgeVariant()}
                      size="small"
                    />
                    {user?.branch && (
                      <Text style={styles.profileBranchText} numberOfLines={1}>
                        • {user.branch}
                      </Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* RBAC Access Summary Indicator */}
              <View style={styles.rbacNoticeRow}>
                <ShieldCheck size={13} color="#10B981" />
                <Text style={styles.rbacNoticeText}>
                  Role Verified: <Text style={{ fontWeight: '800', color: colors.primary }}>{formatRole(user?.cadre || user?.role)}</Text>
                </Text>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.profileCard, { borderColor: '#3B82F6' }]}
                onPress={() => handleNavigate('/login')}
                activeOpacity={0.8}
              >
                <View style={[styles.profileAvatar, { backgroundColor: '#1E40AF', borderColor: '#3B82F6' }]}>
                  <User size={22} color="#FFFFFF" />
                </View>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    Guest Visitor / కస్టమర్
                  </Text>
                  <View style={styles.profileBadgeRow}>
                    <Badge
                      label="PUBLIC ACCESS"
                      variant="info"
                      size="small"
                    />
                    <Text style={styles.profileBranchText} numberOfLines={1}>
                      • Nellore Head Office
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Public Mode Indicator */}
              <View style={styles.rbacNoticeRow}>
                <ShieldCheck size={13} color="#10B981" />
                <Text style={styles.rbacNoticeText}>
                  Townships: <Text style={{ fontWeight: '800', color: colors.primary }}>ISKON City - 2 & Dream City</Text>
                </Text>
              </View>
            </>
          )}

          {/* 3. SCROLLABLE RBAC-FILTERED NAVIGATION LINKS */}
          <ScrollView
            style={styles.linksScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {isAuthenticated ? (
              <>
                {/* Section A: Operational Desk & CRM */}
                {allowedCrmItems.length > 0 && (
                  <View style={styles.menuSection}>
                    <Text style={styles.sectionLabel}>OPERATIONAL DESK & CRM</Text>

                    {allowedCrmItems.map((item) => {
                      const IconComp = item.icon;
                      const isActive =
                        item.route === '/'
                          ? pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index'
                          : pathname.includes(item.route.replace('/(tabs)', ''));

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.navItem, isActive && styles.navItemActive]}
                          onPress={() => handleNavigate(item.route)}
                        >
                          <View style={[styles.navIconBox, { backgroundColor: item.iconBg }]}>
                            <IconComp size={18} color="#FFFFFF" />
                          </View>
                          <View style={styles.navTextContainer}>
                            <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                              {item.title}
                            </Text>
                            <Text style={styles.navSubtitle}>{item.subtitle}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Section B: Ventures & Business (RBAC Protected) */}
                {allowedBusinessItems.length > 0 && (
                  <View style={styles.menuSection}>
                    <Text style={styles.sectionLabel}>VENTURES & EARNINGS</Text>

                    {allowedBusinessItems.map((item) => {
                      const IconComp = item.icon;
                      const isActive = pathname.includes(item.route);

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.navItem, isActive && styles.navItemActive]}
                          onPress={() => handleNavigate(item.route)}
                        >
                          <View style={[styles.navIconBox, { backgroundColor: item.iconBg }]}>
                            <IconComp size={18} color="#FFFFFF" />
                          </View>
                          <View style={styles.navTextContainer}>
                            <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                              {item.title}
                            </Text>
                            <Text style={styles.navSubtitle}>{item.subtitle}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Section C: Portals & Tools */}
                {allowedPortalItems.length > 0 && (
                  <View style={styles.menuSection}>
                    <Text style={styles.sectionLabel}>PORTALS & TOOLS</Text>

                    {allowedPortalItems.map((item) => {
                      const IconComp = item.icon;
                      const isActive = pathname.includes(item.route);

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.navItem, isActive && styles.navItemActive]}
                          onPress={() => handleNavigate(item.route)}
                        >
                          <View style={[styles.navIconBox, { backgroundColor: item.iconBg }]}>
                            <IconComp size={18} color="#FFFFFF" />
                          </View>
                          <View style={styles.navTextContainer}>
                            <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                              {item.title}
                            </Text>
                            <Text style={styles.navSubtitle}>{item.subtitle}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            ) : (
              <>
                {/* Public Visitor Section: Ventures & Plots */}
                <View style={styles.menuSection}>
                  <Text style={styles.sectionLabel}>VENTURES & PROPERTIES (వెంచర్స్)</Text>

                  <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => handleNavigate('/public-site')}
                  >
                    <View style={[styles.navIconBox, { backgroundColor: '#1E40AF' }]}>
                      <Building2 size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.navTextContainer}>
                      <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                        ISKON Ventures & Townships
                      </Text>
                      <Text style={styles.navSubtitle}>ISKON City - 2 & Dream City Nellore</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => handleNavigate('/inventory')}
                  >
                    <View style={[styles.navIconBox, { backgroundColor: '#0D9488' }]}>
                      <Layers size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.navTextContainer}>
                      <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                        Plot Inventory & Layout Maps
                      </Text>
                      <Text style={styles.navSubtitle}>NUDA & DTCP plots, pricing & status</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => handleNavigate('/public-site')}
                  >
                    <View style={[styles.navIconBox, { backgroundColor: '#059669' }]}>
                      <Car size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.navTextContainer}>
                      <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                        Free AC Cab Site Visit
                      </Text>
                      <Text style={styles.navSubtitle}>Complimentary pickup for venture tour</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => handleNavigate('/public-site')}
                  >
                    <View style={[styles.navIconBox, { backgroundColor: '#D97706' }]}>
                      <Sparkles size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.navTextContainer}>
                      <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                        Gemini AI Property Advisor
                      </Text>
                      <Text style={styles.navSubtitle}>Interactive budget & Vastu assistance</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Staff Sign In Gateway */}
                <View style={styles.menuSection}>
                  <Text style={styles.sectionLabel}>STAFF & EMPLOYEE DESK</Text>

                  <TouchableOpacity
                    style={[styles.navItem, { backgroundColor: 'rgba(37, 99, 235, 0.08)' }]}
                    onPress={() => handleNavigate('/login')}
                  >
                    <View style={[styles.navIconBox, { backgroundColor: '#2563EB' }]}>
                      <LogIn size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.navTextContainer}>
                      <Text style={[styles.navTitle, { color: '#2563EB', fontWeight: '800' }]}>
                        Staff / Employee Login
                      </Text>
                      <Text style={styles.navSubtitle}>Sign in for Field CRM, Attendance & Direct Leads</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Section: Preferences, Theme & Support */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionLabel}>PREFERENCES & SUPPORT</Text>

              {/* Theme Switcher Toggle */}
              <TouchableOpacity style={styles.navItem} onPress={toggleTheme}>
                <View
                  style={[
                    styles.navIconBox,
                    { backgroundColor: isDark ? '#F59E0B' : '#1E293B' },
                  ]}
                >
                  {isDark ? <Sun size={18} color="#FFFFFF" /> : <Moon size={18} color="#FFFFFF" />}
                </View>
                <View style={styles.navTextContainer}>
                  <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                    {isDark ? 'Light Theme Mode' : 'Dark Theme Mode'}
                  </Text>
                  <Text style={styles.navSubtitle}>
                    Current: {isDark ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Support Call Helpline */}
              <TouchableOpacity style={styles.navItem} onPress={handleSupportCall}>
                <View style={[styles.navIconBox, { backgroundColor: '#059669' }]}>
                  <PhoneCall size={18} color="#FFFFFF" />
                </View>
                <View style={styles.navTextContainer}>
                  <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                    Head Office Support
                  </Text>
                  <Text style={styles.navSubtitle}>+91 98480 12345 (Nellore Desk)</Text>
                </View>
              </TouchableOpacity>

              {/* Office Address Card */}
              <View style={styles.officeAddressCard}>
                <Text style={styles.officeAddressTitle}>ISKON DEVELOPERS HEAD OFFICE</Text>
                <Text style={styles.officeAddressBody}>
                  RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP
                </Text>
              </View>

              {/* Sign Out Action (Only shown when authenticated) */}
              {isAuthenticated && (
                <TouchableOpacity
                  style={[styles.navItem, styles.logoutNavItem]}
                  onPress={handleLogout}
                >
                  <View style={[styles.navIconBox, { backgroundColor: '#DC2626' }]}>
                    <LogOut size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.navTextContainer}>
                    <Text style={[styles.navTitle, { color: '#DC2626' }]}>Sign Out</Text>
                    <Text style={styles.navSubtitle}>End active mobile session</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Footer Information */}
            <View style={styles.drawerFooter}>
              <CheckCircle size={13} color="#10B981" />
              <Text style={styles.footerText}>
                {isAuthenticated
                  ? 'ISKON Developers Mobile • RBAC Protected v1.0.0'
                  : 'ISKON Developers Nellore • Public Portal v1.0.0'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContent: {
    width: '82%',
    maxWidth: 360,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 16,
    paddingHorizontal: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#02280B',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  brandInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  companySubtitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    fontFamily: 'Mallanna',
  },
  profileBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  profileBranchText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginLeft: 4,
    fontWeight: '500',
  },
  rbacNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  rbacNoticeText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  linksScroll: {
    flex: 1,
    marginTop: 4,
  },
  menuSection: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingHorizontal: 4,
    fontFamily: 'Mallanna',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(30, 64, 175, 0.08)',
  },
  logoutNavItem: {
    marginTop: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.06)',
  },
  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navTextContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  navSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  drawerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  officeAddressCard: {
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  officeAddressTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  officeAddressBody: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },
});
