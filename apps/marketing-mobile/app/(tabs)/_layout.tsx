import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Users, MapPin, ReceiptText, CalendarCheck, Car } from 'lucide-react-native';
import { useMobileTheme } from '../../src/theme';

export default function TabLayout() {
  const { colors, isDark } = useMobileTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surfaceCard,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
        headerStyle: {
          backgroundColor: colors.surfaceCard,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 2,
          shadowColor: '#000000',
          shadowOpacity: 0.05,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          letterSpacing: -0.2,
        },
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Leads',
          tabBarIcon: ({ color, focused }) => (
            <Users color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color, focused }) => (
            <MapPin color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, focused }) => (
            <CalendarCheck color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <Car color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, focused }) => (
            <ReceiptText color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

