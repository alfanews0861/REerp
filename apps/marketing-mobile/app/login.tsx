import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/providers/AuthProvider';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { ShieldCheck, UserCheck, Car, Briefcase, PhoneCall, ArrowLeft, Crown } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithPhone, loginDemo, isLoading } = useAuth();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.warn('Login error:', err);
      const msg = err?.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
      Alert.alert('Login Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPhoneOtp = () => {
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    setOtpSent(true);
    Alert.alert('OTP Sent', `Verification code sent to ${phone}. For testing, you can use: 123456`);
  };

  const handleVerifyPhoneOtp = async () => {
    if (!otp.trim() || otp.trim().length < 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithPhone(phone.trim(), otp.trim());
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'agent' | 'driver' | 'manager' | 'telecaller') => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginDemo(role);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError('Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back to Public Website */}
        <TouchableOpacity
          style={styles.backToPublicBtn}
          onPress={() => router.replace('/')}
        >
          <ArrowLeft size={16} color="#CBD5E1" />
          <Text style={styles.backToPublicText}>← Back to Public Website (పబ్లిక్ సైట్)</Text>
        </TouchableOpacity>

        {/* Header Branding */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={36} color="#ffffff" />
          </View>
          <Text style={styles.appTitle}>REOS Mobile</Text>
          <Text style={styles.appSubtitle}>Real Estate ERP - Executive & Field Operations Suite</Text>
        </View>

        {/* Login Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Sign In to Your Account</Text>
          <Text style={styles.formInstructions}>
            Select your preferred sign-in method to access assigned leads and site visits.
          </Text>

          {/* Method Switcher */}
          <View style={styles.methodSwitcher}>
            <TouchableOpacity
              style={[styles.methodTab, method === 'email' && styles.methodTabActive]}
              onPress={() => {
                setMethod('email');
                setError(null);
              }}
            >
              <Text style={[styles.methodTabText, method === 'email' && styles.methodTabTextActive]}>
                Email & Pass
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodTab, method === 'phone' && styles.methodTabActive]}
              onPress={() => {
                setMethod('phone');
                setError(null);
              }}
            >
              <Text style={[styles.methodTabText, method === 'phone' && styles.methodTabTextActive]}>
                Phone OTP
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          {method === 'email' ? (
            <>
              <Input
                label="Work Email"
                placeholder="agent@reerp.com"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (error) setError(null);
                }}
                secureTextEntry
              />

              <Button
                title={isSubmitting || isLoading ? 'Authenticating...' : 'Sign In with Email'}
                onPress={handleLogin}
                disabled={isSubmitting || isLoading}
                style={styles.signInButton}
              />
            </>
          ) : (
            <>
              {!otpSent ? (
                <>
                  <Input
                    label="Mobile Phone Number"
                    placeholder="+91 98480 12345"
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val);
                      if (error) setError(null);
                    }}
                    keyboardType="phone-pad"
                  />
                  <Button
                    title="Send Verification OTP"
                    onPress={handleSendPhoneOtp}
                    disabled={isSubmitting || isLoading}
                    style={styles.signInButton}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.otpNotice}>Enter 6-digit code sent to {phone}</Text>
                  <Input
                    label="6-Digit OTP Code"
                    placeholder="123456"
                    value={otp}
                    onChangeText={(val) => {
                      setOtp(val);
                      if (error) setError(null);
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <Button
                    title={isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
                    onPress={handleVerifyPhoneOtp}
                    disabled={isSubmitting || isLoading}
                    style={styles.signInButton}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    style={{ marginTop: 8, alignItems: 'center' }}
                  >
                    <Text style={{ color: '#2563eb', fontSize: 13, fontWeight: '600' }}>Change Phone Number</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {/* Google Sign-in Alternative */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isSubmitting || isLoading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Logins for Fast Role Testing */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Quick Demo Logins (1-Tap Test)</Text>
          <Text style={styles.demoSub}>Select a role to test immediate live permissions:</Text>

          <View style={styles.demoGrid}>
            <TouchableOpacity
              style={[
                styles.demoCard,
                { borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.12)', flexBasis: '100%' },
              ]}
              onPress={() => handleDemoLogin('admin')}
              disabled={isSubmitting}
            >
              <Crown size={22} color="#F59E0B" />
              <Text style={[styles.demoRole, { color: '#FDE68A', fontSize: 13 }]}>
                👑 Super Admin & Executive (CEO)
              </Text>
              <Text style={styles.demoName}>Full Admin Console, Dashboard & Inventory Control</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#2563eb' }]}
              onPress={() => handleDemoLogin('agent')}
              disabled={isSubmitting}
            >
              <UserCheck size={20} color="#2563eb" />
              <Text style={styles.demoRole}>Field Agent</Text>
              <Text style={styles.demoName}>Vamshi K.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#16a34a' }]}
              onPress={() => handleDemoLogin('driver')}
              disabled={isSubmitting}
            >
              <Car size={20} color="#16a34a" />
              <Text style={styles.demoRole}>Fleet Driver</Text>
              <Text style={styles.demoName}>Ramesh G.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#8b5cf6' }]}
              onPress={() => handleDemoLogin('manager')}
              disabled={isSubmitting}
            >
              <Briefcase size={20} color="#8b5cf6" />
              <Text style={styles.demoRole}>Sales Manager</Text>
              <Text style={styles.demoName}>Rajesh K.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#f59e0b' }]}
              onPress={() => handleDemoLogin('telecaller')}
              disabled={isSubmitting}
            >
              <PhoneCall size={20} color="#f59e0b" />
              <Text style={styles.demoRole}>Telecaller</Text>
              <Text style={styles.demoName}>Pooja R.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0A192F',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#1E40AF',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  formInstructions: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  methodSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  methodTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  methodTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  methodTabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorBoxText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 14,
  },
  otpNotice: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 22,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  demoSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  demoRole: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  demoName: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  backToPublicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  backToPublicText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
});
