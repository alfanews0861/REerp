import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PublicMainPortal } from '../src/screens/public/PublicMainPortal';
import { ArrowLeft, Shield } from 'lucide-react-native';

export default function PublicSiteRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Return to Admin / Staff Console Banner */}
      <View
        style={[
          styles.topBanner,
          {
            paddingTop: Math.max(insets.top, 10),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={16} color="#FFFFFF" />
          <Shield size={16} color="#F59E0B" />
          <Text style={styles.returnBtnText}>Return to Staff / Admin Suite (కన్సోల్‌కు తిరిగి వెళ్లు)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.portalWrapper}>
        <PublicMainPortal onOpenLogin={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBanner: {
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  portalWrapper: {
    flex: 1,
  },
});
