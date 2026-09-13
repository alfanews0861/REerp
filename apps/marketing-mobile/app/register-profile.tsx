import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/providers/AuthProvider';
import { getFirebaseInstance, doc, updateDoc, collection, query, where, getDocs, limit, serverTimestamp } from '../src/services/firebase';
import { Shield, Award, Building, CheckCircle } from 'lucide-react-native';

const QUICK_CODES = [
  { code: 'REF-CGM-101', name: 'Ramesh Varma (CGM)' },
  { code: 'REF-GM-102', name: 'Vikram Rao (GM)' },
  { code: 'REF-SM-103', name: 'Priya Sharma (SM)' },
  { code: 'REF-DIR-100', name: 'Direct / Board (DIR)' },
];

export default function RegisterProfileScreen() {
  const { user, completeProfile } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [registrationType, setRegistrationType] = useState<'marketing_agent' | 'office_staff'>('marketing_agent');
  
  const [refCode, setRefCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [sponsorInfo, setSponsorInfo] = useState<{ name: string; cadre: string; uid: string } | null>(null);

  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyCode = async (codeToVerify?: string) => {
    const code = (codeToVerify || refCode).trim().toUpperCase();
    if (!code) {
      Alert.alert('Required', 'Please enter a Reference Code');
      return;
    }

    setIsVerifying(true);
    setSponsorInfo(null);

    // Quick lookup for seed directory
    if (code === 'REF-CGM-101') {
      setSponsorInfo({ name: 'Ramesh Varma', cadre: 'Chief General Manager (CGM)', uid: 'usr-cgm-101' });
      setIsVerifying(false);
      return;
    }
    if (code === 'REF-GM-102') {
      setSponsorInfo({ name: 'Vikram Rao', cadre: 'General Manager (GM)', uid: 'usr-gm-102' });
      setIsVerifying(false);
      return;
    }
    if (code === 'REF-SM-103') {
      setSponsorInfo({ name: 'Priya Sharma', cadre: 'Sales Manager (SM)', uid: 'usr-sm-103' });
      setIsVerifying(false);
      return;
    }
    if (code === 'REF-DIR-100') {
      setSponsorInfo({ name: 'Satyadev Varma', cadre: 'Director / Management', uid: 'usr-dir-100' });
      setIsVerifying(false);
      return;
    }

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const q = query(collection(db, 'users'), where('referralCode', '==', code), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setSponsorInfo({
            name: data.displayName || 'Authorized Leader',
            cadre: data.cadre || data.role || 'Sales Manager',
            uid: snap.docs[0].id,
          });
          setIsVerifying(false);
          return;
        }
      }
      Alert.alert('Not Found', `Reference Code "${code}" was not found. Please verify with your upline leader.`);
    } catch {
      Alert.alert('Notice', 'Could not verify code at this time. Please check network connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your Full Name');
      return;
    }
    if (registrationType === 'marketing_agent' && !sponsorInfo) {
      Alert.alert('Reference Required', 'Please enter and verify a valid Reference Code from your upline manager.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { db } = getFirebaseInstance();
      if (db && user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        const ownRefCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
        await updateDoc(userRef, {
          displayName: fullName.trim(),
          phoneNumber: phone.trim() || null,
          registrationType,
          referredByCode: sponsorInfo ? refCode.trim().toUpperCase() : null,
          referredByUid: sponsorInfo?.uid || null,
          referredByName: sponsorInfo?.name || null,
          referredByCadre: sponsorInfo?.cadre || null,
          hierarchyPath: sponsorInfo?.uid ? [sponsorInfo.uid] : [],
          isProfileCompleted: true,
          referralCode: ownRefCode,
          status: 'pending',
          kycDetails: {
            panNumber: pan.trim().toUpperCase() || null,
            bankAccount: bankAccount.trim() || null,
          },
          updatedAt: serverTimestamp(),
        });
      }

      await completeProfile({
        displayName: fullName.trim(),
        phoneNumber: phone.trim(),
        registrationType,
        refCode: refCode.trim().toUpperCase(),
      });

      Alert.alert(
        'Profile Registered',
        registrationType === 'marketing_agent'
          ? `Your profile is linked under ${sponsorInfo?.name || 'your Leader'}. Your reporting manager will review and assign your Cadre.`
          : 'Your Office Staff profile is submitted and under review by Company Management / Director.',
        [{ text: 'Continue to Workspace', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit profile registration.';
      Alert.alert('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Shield size={32} color="#2563eb" />
        </View>
        <Text style={styles.title}>Associate Registration</Text>
        <Text style={styles.subtitle}>
          Complete your profile and link your upline reference code to get your Cadre assigned.
        </Text>
      </View>

      {/* Role Selection */}
      <Text style={styles.sectionTitle}>1. Registration Type</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeCard, registrationType === 'marketing_agent' && styles.typeCardActive]}
          onPress={() => setRegistrationType('marketing_agent')}
        >
          <Award size={22} color={registrationType === 'marketing_agent' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.typeLabel, registrationType === 'marketing_agent' && styles.typeLabelActive]}>
            Marketing Agent
          </Text>
          <Text style={styles.typeDesc}>Field sales & team network</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeCard, registrationType === 'office_staff' && styles.typeCardActive]}
          onPress={() => setRegistrationType('office_staff')}
        >
          <Building size={22} color={registrationType === 'office_staff' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.typeLabel, registrationType === 'office_staff' && styles.typeLabelActive]}>
            Office Staff
          </Text>
          <Text style={styles.typeDesc}>Director approval required</Text>
        </TouchableOpacity>
      </View>

      {/* Reference Code */}
      {registrationType === 'marketing_agent' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Upline Reference Code</Text>
          <Text style={styles.helperText}>
            Enter the referral code given by your recruiter (e.g. REF-CGM-101, REF-GM-102).
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.inputFlex}
              placeholder="e.g. REF-CGM-101"
              placeholderTextColor="#94a3b8"
              value={refCode}
              onChangeText={(text) => {
                setRefCode(text.toUpperCase());
                setSponsorInfo(null);
              }}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.verifyButton, (!refCode.trim() || isVerifying) && styles.buttonDisabled]}
              onPress={() => handleVerifyCode()}
              disabled={!refCode.trim() || isVerifying}
            >
              {isVerifying ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.verifyButtonText}>Verify</Text>}
            </TouchableOpacity>
          </View>

          {/* Quick Codes */}
          <Text style={styles.quickCodeLabel}>Quick select leaders:</Text>
          <View style={styles.chipRow}>
            {QUICK_CODES.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={styles.chip}
                onPress={() => {
                  setRefCode(item.code);
                  handleVerifyCode(item.code);
                }}
              >
                <Text style={styles.chipText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {sponsorInfo && (
            <View style={styles.sponsorBanner}>
              <CheckCircle size={20} color="#10b981" />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.sponsorName}>Sponsor: {sponsorInfo.name}</Text>
                <Text style={styles.sponsorCadre}>Cadre: {sponsorInfo.cadre}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>3. Personal Information</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          placeholderTextColor="#94a3b8"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 9876543210"
          placeholderTextColor="#94a3b8"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>PAN Card Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="ABCDE1234F"
          placeholderTextColor="#94a3b8"
          value={pan}
          onChangeText={(t) => setPan(t.toUpperCase())}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Bank Account No (For Payouts)</Text>
        <TextInput
          style={styles.input}
          placeholder="Bank Account Number"
          placeholderTextColor="#94a3b8"
          value={bankAccount}
          onChangeText={setBankAccount}
          keyboardType="number-pad"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Profile & Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
    marginTop: 6,
  },
  typeLabelActive: {
    color: '#60a5fa',
  },
  typeDesc: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  quickCodeLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  sponsorBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10b981',
    alignItems: 'center',
    marginTop: 8,
  },
  sponsorName: {
    color: '#34d399',
    fontWeight: '700',
    fontSize: 13,
  },
  sponsorCadre: {
    color: '#a7f3d0',
    fontSize: 11,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

