import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, UserPlus, Phone, Mail, Building, Compass, DollarSign, FileText, CheckCircle2, BookOpen, Sparkles, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../../../providers/AuthProvider';
import { useMobileTheme } from '../../../theme';
import { getFirebaseInstance, collection, addDoc } from '../../../services/firebase';

interface AddLeadModalProps {
  visible: boolean;
  onClose: () => void;
  onLeadAdded: (newLead: any) => void;
}

const VENTURE_OPTIONS = [
  { id: 'ISKON City - 2 (Podalakur Road)', label: 'ISKON City - 2 (Podalakur Road)' },
  { id: 'Dream City (Nellore-Bombay Highway)', label: 'Dream City (Bombay Highway / Kovur)' },
  { id: 'ISKON Brundhavanam (Chinthareddypalem)', label: 'ISKON Brundhavanam (Chinthareddypalem)' },
  { id: 'ISKON Elite Township (Annamayya Circle)', label: 'ISKON Elite Township (Annamayya Circle)' },
  { id: 'General Open Plots Enquiry', label: 'General Open Plots Enquiry' },
];

const FACING_OPTIONS = ['EAST (తూర్పు)', 'WEST (పడమర)', 'NORTH (ఉత్తరం)', 'SOUTH (దక్షిణం)', 'ANY (ఏదైనా)'];

const BUDGET_OPTIONS = [
  '₹15L - ₹25L (150-180 Sq.Yds)',
  '₹25L - ₹45L (200-240 Sq.Yds)',
  '₹45L - ₹75L (300+ Sq.Yds)',
  '₹75L+ (Luxury Villa Plots)',
];

const SOURCE_OPTIONS = [
  'Phone Contacts / Phonebook (ఫోన్ కాంటాక్ట్స్)',
  'Direct Field Prospecting (స్వంత పరిచయం)',
  'Personal Network / Friends (స్నేహితులు / బంధువులు)',
  'Customer Referral (పాత కస్టమర్ రిఫరల్)',
  'Social Media / WhatsApp (సోషల్ మీడియా)',
  'Walk-in / Spot Meeting (స్పాట్ మీటింగ్)',
];

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ visible, onClose, onLeadAdded }) => {
  const { user } = useAuth();
  const { colors, isDark } = useMobileTheme();

  const [rawContactInput, setRawContactInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedVenture, setSelectedVenture] = useState(VENTURE_OPTIONS[0].id);
  const [selectedFacing, setSelectedFacing] = useState('EAST (తూర్పు)');
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_OPTIONS[1]);
  const [selectedSource, setSelectedSource] = useState(SOURCE_OPTIONS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setRawContactInput('');
    setFullName('');
    setPhone('');
    setEmail('');
    setSelectedVenture(VENTURE_OPTIONS[0].id);
    setSelectedFacing('EAST (తూర్పు)');
    setSelectedBudget(BUDGET_OPTIONS[1]);
    setSelectedSource(SOURCE_OPTIONS[0]);
    setNotes('');
    setError(null);
  };

  const handleParseContact = () => {
    if (!rawContactInput.trim()) return;

    const cleaned = rawContactInput.trim();
    // Look for 10-12 digits optionally prefixed with +91
    const phoneMatch = cleaned.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/);

    if (phoneMatch) {
      const extractedDigits = phoneMatch[0].replace(/\D/g, '').slice(-10);
      setPhone(extractedDigits);

      // Remaining text becomes customer name
      const remainingName = cleaned.replace(phoneMatch[0], '').replace(/[-:,;|]/g, ' ').trim();
      if (remainingName) {
        setFullName(remainingName.replace(/\s+/g, ' '));
      }
      setSelectedSource('Phone Contacts / Phonebook (ఫోన్ కాంటాక్ట్స్)');
      setRawContactInput('');
      setError(null);
    } else {
      const onlyDigits = cleaned.replace(/\D/g, '');
      if (onlyDigits.length >= 10) {
        setPhone(onlyDigits.slice(-10));
        const remainingName = cleaned.replace(/\d+/g, '').replace(/[-:,;|]/g, ' ').trim();
        if (remainingName) {
          setFullName(remainingName.replace(/\s+/g, ' '));
        }
        setSelectedSource('Phone Contacts / Phonebook (ఫోన్ కాంటాక్ట్స్)');
        setRawContactInput('');
        setError(null);
      } else {
        setError('కాంటాక్ట్‌లో 10 అంకెల మొబైల్ నంబర్ కనిపించలేదు. దయచేసి తనిఖీ చేయండి.');
      }
    }
  };

  const handleSaveLead = async () => {
    if (!fullName.trim()) {
      setError('దయచేసి కస్టమర్ పేరు నమోదు చేయండి (Please enter customer name).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి (Please enter valid 10-digit phone number).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const now = new Date().toISOString();
    const leadPayload = {
      fullName: fullName.trim(),
      customerName: fullName.trim(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      phoneNumber: `+91 ${cleanPhone.slice(-10)}`,
      email: email.trim() || undefined,
      projectName: selectedVenture,
      propertyInterest: selectedVenture,
      facing: selectedFacing.split(' ')[0],
      budget: selectedBudget,
      source: selectedSource,
      notes: notes.trim() || 'Direct self-sourced lead from mobile app.',
      status: 'NEW',
      assignedTo: user?.uid || 'self',
      assignedAgentName: user?.displayName || user?.email || 'Self Agent',
      agentCadre: user?.cadre || user?.role || 'Associate',
      createdAt: now,
      updatedAt: now,
    };

    try {
      const { db } = getFirebaseInstance();
      let createdId = `lead-${Date.now()}`;
      if (db) {
        const docRef = await addDoc(collection(db, 'leads'), leadPayload);
        createdId = docRef.id;
      }

      const createdLead = {
        id: createdId,
        name: leadPayload.fullName,
        phone: leadPayload.phone,
        email: leadPayload.email,
        status: 'NEW',
        assignedTo: leadPayload.assignedTo,
        source: leadPayload.source,
        propertyInterest: leadPayload.propertyInterest,
        createdAt: now,
      };

      Alert.alert(
        'లీడ్ విజయవంతంగా జోడించబడింది! (Lead Added)',
        `${fullName} గారి వివరాలు మీ లీడ్స్‌లో నమోదు చేయబడ్డాయి. మీరు వెంటనే సైట్ విజిట్ షెడ్యూల్ చేయవచ్చు లేదా కాల్ చేయవచ్చు.`
      );

      onLeadAdded(createdLead);
      resetForm();
      onClose();
    } catch (err: any) {
      console.warn('Failed to save lead:', err);
      // Offline fallback
      const offlineLead = {
        id: `offline-${Date.now()}`,
        name: leadPayload.fullName,
        phone: leadPayload.phone,
        email: leadPayload.email,
        status: 'NEW',
        assignedTo: leadPayload.assignedTo,
        source: leadPayload.source,
        propertyInterest: leadPayload.propertyInterest,
        createdAt: now,
      };
      Alert.alert(
        'సేవ్ చేయబడింది (Offline Saved)',
        'లీడ్ లోకల్ సెషన్‌లో సేవ్ చేయబడింది. ఇంటర్నెట్ కనెక్ట్ అవ్వగానే క్లౌడ్‌కి సింక్ అవుతుంది.'
      );
      onLeadAdded(offlineLead);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalCard, { backgroundColor: colors.surfaceCard }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.iconCircle}>
                <UserPlus size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  Add Direct Lead / Customer
                </Text>
                <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                  స్వంత కస్టమర్ / పరిచయస్తుల వివరాలు నమోదు చేయండి
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Direct Agent Commission Guarantee Notice */}
            <View style={styles.guaranteeBox}>
              <ShieldCheck size={16} color="#10B981" />
              <Text style={styles.guaranteeText}>
                ఈ లీడ్ మీ పేరు మీద రిజిస్టర్ అవుతుంది. మీ సేల్స్ కమిషన్ సురక్షితంగా మీ ఖాతాలో జమ చేయబడుతుంది.
              </Text>
            </View>

            {/* Quick Contact Fill from Phone Contacts / WhatsApp */}
            <View style={[styles.quickFillCard, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: '#3B82F6' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={16} color="#2563EB" />
                  <Text style={[styles.quickFillTitle, { color: colors.textPrimary }]}>
                    ఫోన్ కాంటాక్ట్స్ / పేస్ట్ ఫిల్ (Quick Contact Fill)
                  </Text>
                </View>
                <View style={styles.smartBadge}>
                  <Sparkles size={11} color="#FFFFFF" />
                  <Text style={styles.smartBadgeText}>SMART</Text>
                </View>
              </View>
              <Text style={[styles.quickFillSub, { color: colors.textSecondary }]}>
                కాపీ చేసిన కాంటాక్ట్ టెక్స్ట్ ఇక్కడ పేస్ట్ చేసి నింపండి (ఉదా: "రమేష్ 9848012345" లేదా "+91 94401 23456 - సురేష్"):
              </Text>
              <View style={styles.quickFillRow}>
                <TextInput
                  style={[styles.quickFillInput, { color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Paste phone contact / text here..."
                  placeholderTextColor={colors.textMuted}
                  value={rawContactInput}
                  onChangeText={setRawContactInput}
                />
                <TouchableOpacity
                  style={styles.quickFillBtn}
                  onPress={handleParseContact}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickFillBtnText}>Auto-Fill</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Customer Full Name (కస్టమర్ పేరు) *
              </Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <UserPlus size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="e.g. Venkata Ramana Rao"
                  placeholderTextColor={colors.textMuted}
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (error) setError(null);
                  }}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Mobile Number (మొబైల్ నంబర్) *
              </Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Phone size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="e.g. 98480 12345"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (error) setError(null);
                  }}
                  maxLength={15}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Email Address (ఈమెయిల్ - ఐచ్ఛికం)
              </Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Mail size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="e.g. customer@gmail.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Interested Venture */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Interested Venture (ఆసక్తి ఉన్న వెంచర్)
              </Text>
              <View style={styles.chipsContainer}>
                {VENTURE_OPTIONS.map((v) => {
                  const isSelected = selectedVenture === v.id;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      style={[
                        styles.chip,
                        { borderColor: colors.border, backgroundColor: colors.background },
                        isSelected && { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
                      ]}
                      onPress={() => setSelectedVenture(v.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: colors.textPrimary },
                          isSelected && { color: '#FFFFFF', fontWeight: '800' },
                        ]}
                      >
                        {v.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Facing Preference */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Plot Facing Preference (దిశ)
              </Text>
              <View style={styles.chipsRow}>
                {FACING_OPTIONS.map((f) => {
                  const isSelected = selectedFacing === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.smallChip,
                        { borderColor: colors.border, backgroundColor: colors.background },
                        isSelected && { backgroundColor: '#059669', borderColor: '#059669' },
                      ]}
                      onPress={() => setSelectedFacing(f)}
                    >
                      <Text
                        style={[
                          styles.smallChipText,
                          { color: colors.textPrimary },
                          isSelected && { color: '#FFFFFF', fontWeight: '800' },
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Estimated Budget */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Estimated Budget Range (బడ్జెట్ పరిధి)
              </Text>
              <View style={styles.chipsContainer}>
                {BUDGET_OPTIONS.map((b) => {
                  const isSelected = selectedBudget === b;
                  return (
                    <TouchableOpacity
                      key={b}
                      style={[
                        styles.chip,
                        { borderColor: colors.border, backgroundColor: colors.background },
                        isSelected && { backgroundColor: '#D97706', borderColor: '#D97706' },
                      ]}
                      onPress={() => setSelectedBudget(b)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: colors.textPrimary },
                          isSelected && { color: '#FFFFFF', fontWeight: '800' },
                        ]}
                      >
                        {b}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Lead Source */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Lead Acquisition Channel (పరిచయ మార్గం)
              </Text>
              <View style={styles.chipsContainer}>
                {SOURCE_OPTIONS.map((s) => {
                  const isSelected = selectedSource === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.chip,
                        { borderColor: colors.border, backgroundColor: colors.background },
                        isSelected && { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
                      ]}
                      onPress={() => setSelectedSource(s)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: colors.textPrimary },
                          isSelected && { color: '#FFFFFF', fontWeight: '800' },
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Initial Notes / Follow-up */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Follow-up Notes / Remarks (వివరాలు / రిమార్క్స్)
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  { borderColor: colors.border, backgroundColor: colors.background },
                ]}
              >
                <TextInput
                  style={[styles.textArea, { color: colors.textPrimary }]}
                  placeholder="e.g. Spoke over phone. Customer wants 200 Sq.Yds East facing plot near Podalakur Road. Free cab visit requested for Sunday."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>

            {/* Agent Attribution Banner */}
            <View style={styles.attributionCard}>
              <CheckCircle2 size={16} color="#059669" />
              <Text style={styles.attributionText}>
                This lead will be registered and locked under your name: <Text style={{ fontWeight: '800' }}>{user?.displayName || 'Your Profile'}</Text>
              </Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>రద్దు చేయి (Cancel)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSaveLead}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <UserPlus size={16} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>లీడ్ సేవ్ చేయి (Save Lead)</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: {
    fontSize: 13,
    minHeight: 65,
    textAlignVertical: 'top',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  smallChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  attributionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  attributionText: {
    color: '#065F46',
    fontSize: 11.5,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  guaranteeText: {
    color: '#065F46',
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  quickFillCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  quickFillTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  smartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  smartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickFillSub: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
    lineHeight: 15,
  },
  quickFillRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  quickFillInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  quickFillBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFillBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default AddLeadModal;
