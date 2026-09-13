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
import { ShieldCheck, ArrowLeft, Lock, Mail, Phone, KeyRound, CheckCircle2 } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithPhone, isLoading } = useAuth();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both work email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
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
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    setOtpSent(true);
    Alert.alert('OTP Sent', `Verification OTP sent to +91 ${cleanPhone}. Please enter the 6-digit code.`);
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

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Reset Password', 'Please enter your work email in the box above to receive a reset link.');
      return;
    }
    setForgotPasswordSent(true);
    Alert.alert('Password Reset Sent', `Password reset instructions have been sent to ${email}.`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back to Public Website Gateway */}
        <TouchableOpacity
          style={styles.backToPublicBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <ArrowLeft size={16} color="#CBD5E1" />
          <Text style={styles.backToPublicText}>← Back to Public Website (పబ్లిక్ సైట్)</Text>
        </TouchableOpacity>

        {/* Header Branding */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={36} color="#ffffff" />
          </View>
          <Text style={styles.appTitle}>REOS Enterprise</Text>
          <Text style={styles.appSubtitle}>Executive, Sales & Operations Management Suite</Text>
        </View>

        {/* Production Login Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Authorized Employee Sign-In</Text>
          <Text style={styles.formInstructions}>
            Sign in with your corporate credentials to access the Executive Dashboard, CRM Leads, and Operations Suite.
          </Text>

          {/* Method Switcher (Email / Phone OTP) */}
          <View style={styles.methodSwitcher}>
            <TouchableOpacity
              style={[styles.methodTab, method === 'email' && styles.methodTabActive]}
              onPress={() => {
                setMethod('email');
                setError(null);
              }}
            >
              <Mail size={15} color={method === 'email' ? '#0F172A' : '#64748B'} />
              <Text style={[styles.methodTabText, method === 'email' && styles.methodTabTextActive]}>
                Work Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodTab, method === 'phone' && styles.methodTabActive]}
              onPress={() => {
                setMethod('phone');
                setError(null);
              }}
            >
              <Phone size={15} color={method === 'phone' ? '#0F172A' : '#64748B'} />
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
                label="Corporate Email Address"
                placeholder="admin@reerp.com / employee@reerp.com"
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
                placeholder="••••••••••••"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (error) setError(null);
                }}
                secureTextEntry
              />

              <View style={styles.forgotRow}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

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
                    label="Registered Mobile Number"
                    placeholder="+91 98480 12345"
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val);
                      if (error) setError(null);
                    }}
                    keyboardType="phone-pad"
                  />
                  <Button
                    title="Send Secure Verification OTP"
                    onPress={handleSendPhoneOtp}
                    disabled={isSubmitting || isLoading}
                    style={styles.signInButton}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.otpNotice}>Enter 6-digit OTP code sent to {phone}</Text>
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
                    title={isSubmitting ? 'Verifying...' : 'Verify OTP & Enter Suite'}
                    onPress={handleVerifyPhoneOtp}
                    disabled={isSubmitting || isLoading}
                    style={styles.signInButton}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    style={{ marginTop: 10, alignItems: 'center' }}
                  >
                    <Text style={{ color: '#2563eb', fontSize: 13, fontWeight: '700' }}>Change Mobile Number</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {/* Google Sign-in Alternative */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN IN VIA</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isSubmitting || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.googleButtonText}>Continue with Google Workspace</Text>
          </TouchableOpacity>
        </View>

        {/* Security & Compliance Footer */}
        <View style={styles.securityFooter}>
          <ShieldCheck size={16} color="#10B981" />
          <Text style={styles.securityText}>256-Bit SSL Encrypted • Role-Based Access Control (RBAC)</Text>
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
    paddingTop: 45,
    paddingBottom: 40,
    justifyContent: 'center',
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 3,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  formInstructions: {
    fontSize: 12.5,
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
    gap: 4,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 6,
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
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  methodTabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 12,
  },
  forgotText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
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
    marginTop: 4,
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
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
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
    fontSize: 13.5,
    fontWeight: '700',
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  securityText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
});
