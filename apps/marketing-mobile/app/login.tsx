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
import { ShieldCheck, UserCheck, Car, Briefcase, PhoneCall } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginDemo, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleDemoLogin = async (role: 'agent' | 'driver' | 'manager' | 'telecaller') => {
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
        {/* Header Branding */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={36} color="#ffffff" />
          </View>
          <Text style={styles.appTitle}>REOS Mobile</Text>
          <Text style={styles.appSubtitle}>Real Estate ERP - Field & Marketing Suite</Text>
        </View>

        {/* Login Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Sign In to Your Account</Text>
          <Text style={styles.formInstructions}>
            Enter your employee/agent email and password to access your assigned leads, site visits, and attendance.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

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
            title={isSubmitting || isLoading ? 'Authenticating...' : 'Sign In'}
            onPress={handleLogin}
            disabled={isSubmitting || isLoading}
            style={styles.signInButton}
          />
        </View>

        {/* Quick Demo Logins for Fast Role Testing */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Quick Demo Logins (1-Tap Test)</Text>
          <Text style={styles.demoSub}>Select a role to test immediate live permissions:</Text>

          <View style={styles.demoGrid}>
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
    backgroundColor: '#0f172a',
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
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  formInstructions: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorBoxText: {
    color: '#b91c1c',
    fontSize: 13,
  },
  signInButton: {
    marginTop: 12,
  },
  demoSection: {
    marginTop: 24,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2,
  },
  demoSub: {
    fontSize: 12,
    color: '#94a3b8',
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
    backgroundColor: '#0f172a',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  demoRole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  demoName: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
});
