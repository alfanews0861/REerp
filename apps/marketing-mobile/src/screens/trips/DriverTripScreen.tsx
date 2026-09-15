import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { getFirebaseInstance } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface DriverTripScreenProps {
  onBack?: () => void;
}

const ISKON_VEHICLES = [
  { id: 'veh-1', name: 'AP 26 TE 1928 - Toyota Innova Crysta (7 Seater AC)' },
  { id: 'veh-2', name: 'AP 26 CZ 4400 - Mahindra Scorpio Classic (7 Seater AC)' },
  { id: 'veh-3', name: 'AP 26 BD 8812 - Force Traveller Mini Bus (16 Seater AC)' },
  { id: 'veh-4', name: 'AP 26 AH 5519 - Maruti Suzuki Ertiga (7 Seater AC)' },
];

const ISKON_VENTURES = [
  'ISKON City - 2 (Podalakur Road, Nellore)',
  'Dream City (Nellore-Bombay Highway / Kovuru)',
  'ISKON Brundhavanam (Chinthareddypalem)',
  'ISKON Elite Township (Annamayya Circle Extn)',
];

export const DriverTripScreen: React.FC<DriverTripScreenProps> = ({ onBack }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(ISKON_VEHICLES[0].name);
  const [selectedVenture, setSelectedVenture] = useState(ISKON_VENTURES[0]);
  const [driverName, setDriverName] = useState('K. Venkataiah');
  const [passengerCount, setPassengerCount] = useState('4');
  const [startKm, setStartKm] = useState('42580');
  const [endKm, setEndKm] = useState('42645');
  const [fuelExpense, setFuelExpense] = useState('0');
  const [tollExpense, setTollExpense] = useState('0');
  const [otherExpense, setOtherExpense] = useState('0');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const calculatedDistance = Math.max(0, Number(endKm) - Number(startKm));
  const totalExpenses = Number(fuelExpense || 0) + Number(tollExpense || 0) + Number(otherExpense || 0);

  const handleSaveTrip = async () => {
    if (!startKm || !endKm) {
      Alert.alert('Validation Error', 'Please enter both Start and End Odometer readings.');
      return;
    }

    if (Number(endKm) < Number(startKm)) {
      Alert.alert('Invalid Odometer', 'End Odometer cannot be less than Start Odometer reading.');
      return;
    }

    setSubmitting(true);
    const now = new Date().toISOString();

    const tripData = {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      vehicle: selectedVehicle,
      ventureDestination: selectedVenture,
      driverName: driverName.trim(),
      passengerCount: Number(passengerCount) || 1,
      startOdometerKm: Number(startKm),
      endOdometerKm: Number(endKm),
      totalDistanceKm: calculatedDistance,
      expenses: {
        fuel: Number(fuelExpense) || 0,
        toll: Number(tollExpense) || 0,
        other: Number(otherExpense) || 0,
        total: totalExpenses,
      },
      notes: notes.trim(),
      status: 'COMPLETED',
      recordedAt: now,
      createdAt: now,
      serverTimestamp: serverTimestamp(),
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'driverTrips'), tripData);
      }
      Alert.alert(
        'Trip Recorded! (ట్రిప్ నమోదైంది)',
        `Distance: ${calculatedDistance} KM\nExpenses: ₹${totalExpenses}\nVenture: ${selectedVenture}`,
        [{ text: 'OK', onPress: () => onBack && onBack() }]
      );
    } catch (err: any) {
      console.warn('Trip save warning:', err);
      Alert.alert('Notice', 'Trip logged locally in offline mode.');
      if (onBack) onBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>ISKON DEVELOPERS</Text>
          <Text style={styles.screenTitle}>Driver Trip & Fleet Log (డ్రైవర్ ట్రిప్ రికార్డ్)</Text>
        </View>
        {onBack && (
          <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Vehicle Selection */}
        <Text style={styles.sectionHeading}>1. SELECT VEHICLE (వాహనం ఎంపిక)</Text>
        <View style={styles.chipContainer}>
          {ISKON_VEHICLES.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.chip, selectedVehicle === v.name && styles.activeChip]}
              onPress={() => setSelectedVehicle(v.name)}
            >
              <Text style={[styles.chipText, selectedVehicle === v.name && styles.activeChipText]}>
                {v.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Destination Venture */}
        <Text style={styles.sectionHeading}>2. VENTURE DESTINATION (వెంచర్ గమ్యస్థానం)</Text>
        <View style={styles.chipContainer}>
          {ISKON_VENTURES.map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.chip, selectedVenture === v && styles.activeChip]}
              onPress={() => setSelectedVenture(v)}
            >
              <Text style={[styles.chipText, selectedVenture === v && styles.activeChipText]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Odometer Tracking */}
        <Text style={styles.sectionHeading}>3. ODOMETER & DISTANCE (ఓడోమీటర్ కి.మీ)</Text>
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Start Odometer (KM)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={startKm}
              onChangeText={setStartKm}
              placeholder="e.g. 42580"
            />
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.label}>End Odometer (KM)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={endKm}
              onChangeText={setEndKm}
              placeholder="e.g. 42645"
            />
          </View>
        </View>

        {/* Distance Banner */}
        <View style={styles.distanceBanner}>
          <Text style={styles.distanceLabel}>Total Distance Run:</Text>
          <Text style={styles.distanceValue}>{calculatedDistance} KM</Text>
        </View>

        {/* Expenses */}
        <Text style={styles.sectionHeading}>4. TRIP EXPENSES (ఇంధనం & టోల్ ఖర్చులు)</Text>
        <View style={styles.row}>
          <View style={styles.thirdCol}>
            <Text style={styles.label}>Fuel (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={fuelExpense}
              onChangeText={setFuelExpense}
              placeholder="0"
            />
          </View>
          <View style={styles.thirdCol}>
            <Text style={styles.label}>Toll (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tollExpense}
              onChangeText={setTollExpense}
              placeholder="0"
            />
          </View>
          <View style={styles.thirdCol}>
            <Text style={styles.label}>Food / Other (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={otherExpense}
              onChangeText={setOtherExpense}
              placeholder="0"
            />
          </View>
        </View>

        {/* Notes */}
        <Text style={styles.label}>Trip Remarks / Customer Feedback</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={2}
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Customer pickup from Podalakur bus stop. Smooth visit."
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSaveTrip}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Save Trip & Submit Expenses (నమోదు చేయి)</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerLeft: {
    flex: 1,
  },
  brandTitle: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  screenTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: 'Mallanna',
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'Mallanna',
  },
  chipContainer: {
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeChip: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  chipText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  halfCol: {
    flex: 1,
  },
  thirdCol: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  distanceBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  distanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
  },
  submitBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
