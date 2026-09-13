import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { PUBLIC_VENTURES, PublicVenture } from '../../data/publicVenturesData';
import {
  fetchLiveVentures,
  createLiveSiteVisitRequest,
  MobileSiteVisitResult,
} from '../../services/publicDataService';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Navigation,
  Sparkles,
} from 'lucide-react-native';

interface PublicSiteVisitScreenProps {
  initialVentureId?: string;
}

export const PublicSiteVisitScreen: React.FC<PublicSiteVisitScreenProps> = ({
  initialVentureId,
}) => {
  const [ventures, setVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [selectedVentureId, setSelectedVentureId] = useState<string>(
    initialVentureId || PUBLIC_VENTURES[0].id
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM (Morning)');
  const [passengerCount, setPassengerCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [visitResult, setVisitResult] = useState<MobileSiteVisitResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadVentures = async () => {
    try {
      const data = await fetchLiveVentures();
      setVentures(data);
      if (!selectedVentureId && data.length > 0) {
        setSelectedVentureId(data[0].id);
      }
    } catch (err) {
      console.warn('Live ventures load notice:', err);
    }
  };

  useEffect(() => {
    loadVentures();
  }, []);

  const selectedVenture = ventures.find((v) => v.id === selectedVentureId) || ventures[0];

  const handleBookVisit = async () => {
    if (!fullName.trim() || !phone.trim() || !pickupAddress.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in your full name, contact phone, and pickup address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createLiveSiteVisitRequest({
        ventureId: selectedVenture.id,
        ventureName: selectedVenture.name,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        pickupAddress: pickupAddress.trim(),
        timeSlot: selectedTimeSlot,
        passengerCount,
      });
      setVisitResult(result);
      setBookingConfirmed(true);
    } catch (err: any) {
      Alert.alert('Booking Error', err?.message || 'Failed to submit site visit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <Car size={16} color="#F59E0B" />
          <Text style={styles.badgeText}>COMPLIMENTARY AC CAB SERVICE</Text>
        </View>
        <Text style={styles.title}>Book Free Site Visit Pickup & Drop</Text>
        <Text style={styles.subtitle}>
          మీ ఇంటి నుండే ఉచిత ఏసీ క్యాబ్ సౌకర్యం • నిపుణులతో లేఅవుట్ పరిశీలన.
        </Text>
      </View>

      {!bookingConfirmed ? (
        <View style={styles.formCard}>
          {/* Select Venture */}
          <Text style={styles.label}>Select Venture to Visit</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ventureScroll}>
            {ventures.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.ventureChip,
                  selectedVentureId === v.id && styles.ventureChipActive,
                ]}
                onPress={() => setSelectedVentureId(v.id)}
              >
                <Text
                  style={[
                    styles.ventureChipText,
                    selectedVentureId === v.id && styles.ventureChipTextActive,
                  ]}
                >
                  {v.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Full Name */}
          <Text style={styles.label}>Your Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Srinivas Rao"
            value={fullName}
            onChangeText={setFullName}
          />

          {/* Contact Phone */}
          <Text style={styles.label}>Mobile Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98480 12345"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Pickup Address */}
          <Text style={styles.label}>Pickup Address in Hyderabad</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Flat 302, Cyber Heights, Gachibowli"
            value={pickupAddress}
            onChangeText={setPickupAddress}
          />

          {/* Time Slot Selector */}
          <Text style={styles.label}>Preferred Time Slot</Text>
          <View style={styles.timeSlotRow}>
            {['10:00 AM (Morning)', '02:00 PM (Afternoon)', '04:30 PM (Evening)'].map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlotChip,
                  selectedTimeSlot === slot && styles.timeSlotChipActive,
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Clock
                  size={12}
                  color={selectedTimeSlot === slot ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot && styles.timeSlotTextActive,
                  ]}
                >
                  {slot.split(' ')[0]} {slot.includes('Morning') ? 'AM' : 'PM'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Passenger Count */}
          <Text style={styles.label}>Number of Family / Passengers</Text>
          <View style={styles.passengerRow}>
            {[1, 2, 3, 4, 6].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.passengerChip,
                  passengerCount === count && styles.passengerChipActive,
                ]}
                onPress={() => setPassengerCount(count)}
              >
                <Text
                  style={[
                    styles.passengerText,
                    passengerCount === count && styles.passengerTextActive,
                  ]}
                >
                  {count === 6 ? '5+' : count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary Box */}
          <View style={styles.guaranteeBox}>
            <ShieldCheck size={18} color="#059669" />
            <Text style={styles.guaranteeText}>
              Zero-obligation free ride. Dedicated Toyota Innova / Ertiga with certified company driver.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleBookVisit}
            disabled={isSubmitting}
          >
            <Car size={20} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>
              {isSubmitting ? 'Confirming Cab Assignment...' : 'Confirm Free AC Cab Booking'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Booking Confirmation & Live Cab Dispatch Simulation */
        <View style={styles.confirmedCard}>
          <View style={styles.successIconBadge}>
            <CheckCircle2 size={36} color="#059669" />
          </View>
          <Text style={styles.confirmedTitle}>Free Cab Confirmed! 🚗</Text>
          <Text style={styles.confirmedSubtitle}>
            Your AC pickup vehicle has been scheduled for {selectedVenture?.name}.
          </Text>

          {/* Live Driver & Vehicle Info */}
          <View style={styles.driverCard}>
            <View style={styles.driverInfoRow}>
              <View style={styles.driverAvatar}>
                <Car size={22} color="#FFFFFF" />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>Ramesh Goud (Driver)</Text>
                <Text style={styles.vehicleModel}>White Toyota Innova Crysta</Text>
                <Text style={styles.vehiclePlate}>TS-08-ER-1234 • ⭐ 4.9 Rated</Text>
              </View>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL('tel:+919848022338')}
              >
                <Phone size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Live Progress Tracker */}
            <View style={styles.trackerBox}>
              <Text style={styles.trackerHeading}>Live Visit Status</Text>
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, styles.stepDotActive]} />
                <Text style={styles.stepActiveText}>Cab Assigned & Scheduled for {selectedTimeSlot}</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepDot} />
                <Text style={styles.stepPendingText}>Pickup Address: {pickupAddress}</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepDot} />
                <Text style={styles.stepPendingText}>Destination: {selectedVenture?.location}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookAnotherBtn}
            onPress={() => setBookingConfirmed(false)}
          >
            <Text style={styles.bookAnotherBtnText}>Schedule Another Site Visit</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FDE68A',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  ventureScroll: {
    marginBottom: 6,
  },
  ventureChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ventureChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  ventureChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  ventureChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 4,
  },
  timeSlotRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  timeSlotChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeSlotChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  timeSlotText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  passengerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  passengerChip: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passengerChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  passengerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  passengerTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginVertical: 4,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 11.5,
    color: '#065F46',
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  confirmedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  successIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  confirmedSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
  },
  driverCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vehicleModel: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  vehiclePlate: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerBox: {
    gap: 8,
  },
  trackerHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  stepDotActive: {
    backgroundColor: '#10B981',
  },
  stepActiveText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  stepPendingText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  bookAnotherBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  bookAnotherBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
});
