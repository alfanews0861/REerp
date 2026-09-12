import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { queueOfflineMutation } from '../../services/backgroundSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VEHICLES = [
  { id: 'veh-1', name: 'Toyota Innova Crysta (TS 09 UB 1001)', currentKm: 48250 },
  { id: 'veh-2', name: 'Force Tempo Traveller (TS 08 EX 4050)', currentKm: 64120 },
  { id: 'veh-3', name: 'Mahindra Scorpio-N (TS 07 HK 9922)', currentKm: 32400 },
];

export default function TripsScreen() {
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [isTripActive, setIsTripActive] = useState(false);
  const [startOdometer, setStartOdometer] = useState(VEHICLES[0].currentKm.toString());
  const [endOdometer, setEndOdometer] = useState('');
  const [clientPickupLocation, setClientPickupLocation] = useState('Gachibowli Junction');
  const [destinationVenture, setDestinationVenture] = useState('Sunrise Enclave (Mokila)');
  const [fuelExpenseAmount, setFuelExpenseAmount] = useState('');
  const [fuelLitres, setFuelLitres] = useState('');
  const [tripHistory, setTripHistory] = useState<any[]>([]);

  useEffect(() => {
    loadActiveTrip();
  }, []);

  const loadActiveTrip = async () => {
    const saved = await AsyncStorage.getItem('active_driver_trip');
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsTripActive(true);
      setStartOdometer(parsed.startOdometer.toString());
      setClientPickupLocation(parsed.clientPickupLocation);
      setDestinationVenture(parsed.destinationVenture);
    }
  };

  const handleStartTrip = async () => {
    const startKm = Number(startOdometer);
    if (!startKm || isNaN(startKm)) {
      Alert.alert('Validation Error', 'Please enter a valid start odometer reading.');
      return;
    }

    const tripData = {
      id: `trip_${Date.now()}`,
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      driverId: 'drv-1',
      driverName: 'Ramesh Goud',
      startOdometerKm: startKm,
      pickupLocation: clientPickupLocation,
      destinationVenture,
      startedAt: new Date().toISOString(),
      status: 'IN_PROGRESS',
    };

    await queueOfflineMutation({
      type: 'TRIP_START',
      payload: tripData,
    });

    await AsyncStorage.setItem('active_driver_trip', JSON.stringify({
      tripId: tripData.id,
      startOdometer: startKm,
      clientPickupLocation,
      destinationVenture,
      vehicleId: selectedVehicle.id,
    }));

    setIsTripActive(true);
    Alert.alert('Trip Started', `Trip initiated with start odometer: ${startKm} KM`);
  };

  const handleEndTrip = async () => {
    const startKm = Number(startOdometer);
    const endKm = Number(endOdometer);

    if (!endKm || isNaN(endKm) || endKm <= startKm) {
      Alert.alert('Validation Error', `End odometer must be greater than start odometer (${startKm} KM).`);
      return;
    }

    const totalDistance = endKm - startKm;

    const saved = await AsyncStorage.getItem('active_driver_trip');
    const parsed = saved ? JSON.parse(saved) : {};

    // 1. Queue trip end mutation
    await queueOfflineMutation({
      type: 'TRIP_END',
      payload: {
        tripId: parsed.tripId || `trip_${Date.now()}`,
        vehicleId: selectedVehicle.id,
        endOdometerKm: endKm,
        totalDistanceKm: totalDistance,
        endedAt: new Date().toISOString(),
      },
    });

    // 2. If fuel expense entered, queue expense mutation
    if (fuelExpenseAmount && Number(fuelExpenseAmount) > 0) {
      await queueOfflineMutation({
        type: 'ADD_EXPENSE',
        payload: {
          category: 'VEHICLE_FUEL',
          title: `Diesel Refuel for ${selectedVehicle.name}`,
          amount: Number(fuelExpenseAmount),
          description: `${fuelLitres ? fuelLitres + ' Litres' : 'Fuel refuel'} on trip ${clientPickupLocation} to ${destinationVenture}`,
          vehicleId: selectedVehicle.id,
        },
      });
    }

    await AsyncStorage.removeItem('active_driver_trip');

    setTripHistory([
      {
        id: Date.now().toString(),
        route: `${clientPickupLocation} ➔ ${destinationVenture}`,
        distance: `${totalDistance} KM`,
        date: new Date().toLocaleDateString(),
      },
      ...tripHistory,
    ]);

    setIsTripActive(false);
    setEndOdometer('');
    setFuelExpenseAmount('');
    setFuelLitres('');
    setStartOdometer(endKm.toString());

    Alert.alert(
      'Trip Completed',
      `Trip successfully logged! Total Distance: ${totalDistance} KM.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Driver & Vehicle Trip Log</Text>

      {/* Vehicle Selection */}
      <Card title="Assigned Fleet Vehicle" style={styles.card}>
        <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
        <Text style={styles.subText}>Current Registered Odometer: {selectedVehicle.currentKm} KM</Text>
      </Card>

      {!isTripActive ? (
        /* Start Trip Form */
        <Card title="Start New Customer Site Trip" style={styles.card}>
          <Input
            label="Start Odometer Reading (KM)"
            keyboardType="numeric"
            value={startOdometer}
            onChangeText={setStartOdometer}
          />
          <Input
            label="Client Pickup Location"
            value={clientPickupLocation}
            onChangeText={setClientPickupLocation}
          />
          <Input
            label="Destination Venture Site"
            value={destinationVenture}
            onChangeText={setDestinationVenture}
          />
          <Button
            title="Start Trip (Log Departure)"
            onPress={handleStartTrip}
            style={styles.startBtn}
          />
        </Card>
      ) : (
        /* End Trip Form */
        <Card title="Trip In Progress" style={styles.card}>
          <View style={styles.inProgressBanner}>
            <Text style={styles.inProgressText}>ACTIVE TRIP IN PROGRESS</Text>
            <Text style={styles.routeText}>{clientPickupLocation} ➔ {destinationVenture}</Text>
            <Text style={styles.startKmText}>Departure Reading: {startOdometer} KM</Text>
          </View>

          <Input
            label="Final End Odometer Reading (KM)"
            keyboardType="numeric"
            placeholder="e.g. 48310"
            value={endOdometer}
            onChangeText={setEndOdometer}
          />

          <Text style={styles.expenseSectionHeader}>Refuel Expenses (Optional)</Text>
          <Input
            label="Diesel/Fuel Refill Cost (₹)"
            keyboardType="numeric"
            placeholder="e.g. 2500"
            value={fuelExpenseAmount}
            onChangeText={setFuelExpenseAmount}
          />
          <Input
            label="Fuel Litres"
            keyboardType="numeric"
            placeholder="e.g. 25.5"
            value={fuelLitres}
            onChangeText={setFuelLitres}
          />

          <Button
            title="Complete Trip & Log Fleet Data"
            onPress={handleEndTrip}
            style={styles.endBtn}
          />
        </Card>
      )}

      {/* Recent Trips History */}
      {tripHistory.length > 0 && (
        <Card title="Recent Completed Trips" style={styles.card}>
          {tripHistory.map((trip) => (
            <View key={trip.id} style={styles.tripRow}>
              <View>
                <Text style={styles.tripRoute}>{trip.route}</Text>
                <Text style={styles.tripDate}>{trip.date}</Text>
              </View>
              <Text style={styles.tripDist}>{trip.distance}</Text>
            </View>
          ))}
        </Card>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    marginBottom: 14,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#64748b',
  },
  startBtn: {
    backgroundColor: '#16a34a',
    marginTop: 12,
  },
  endBtn: {
    backgroundColor: '#2563eb',
    marginTop: 12,
  },
  inProgressBanner: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  inProgressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 4,
  },
  startKmText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  expenseSectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tripRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  tripDate: {
    fontSize: 12,
    color: '#64748b',
  },
  tripDist: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
});
