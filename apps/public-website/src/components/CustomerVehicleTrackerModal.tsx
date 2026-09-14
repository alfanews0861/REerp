import { FC, useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PhoneIcon from '@mui/icons-material/Phone';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CustomerVehicleTrackerModalProps {
  open: boolean;
  onClose: () => void;
  defaultCustomerPhone?: string;
}

export const CustomerVehicleTrackerModal: FC<CustomerVehicleTrackerModalProps> = ({
  open,
  onClose,
  defaultCustomerPhone = '',
}) => {
  const [customerName, setCustomerName] = useState('Valued Customer');
  const [customerPhone, setCustomerPhone] = useState(defaultCustomerPhone || '+91 98490 99887');
  const [customerAddress, setCustomerAddress] = useState('Annamayya Circle, Mini Bypass Road, Nellore');
  const [isLocating, setIsLocating] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number }>({
    lat: 14.4426,
    lng: 79.9865,
  });


  const [vehicleTelemetry, setVehicleTelemetry] = useState<any>({
    vehicleId: 'veh-2',
    registrationNumber: 'AP 26 TH 4050',
    makeModel: 'Force Tempo Traveller 17 Seater (AC Luxury)',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 94412 33445',
    latitude: 14.4250,
    longitude: 79.9200,
    speedKmH: 48,
    headingDegrees: 260,
    status: 'IN_TRANSIT',
    destinationVenture: 'ISKON City - 2 (Podalakur Road)',
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Real-time Firestore sync for customer's assigned vehicle
  useEffect(() => {
    if (!open) return;

    let unsubscribe = () => {};
    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const docRef = doc(db, 'vehicle_live_locations', vehicleTelemetry.vehicleId || 'veh-2');
        unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setVehicleTelemetry((prev: any) => ({ ...prev, ...data }));
          }
        });
      }
    } catch (e) {
      console.warn('Customer live tracker Firestore sync:', e);
    }

    return () => unsubscribe();
  }, [open, vehicleTelemetry.vehicleId]);

  // Simulated live movement if testing
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setVehicleTelemetry((prev: any) => {
        const deltaLng = -0.0008;
        const newLng = prev.longitude + deltaLng < 79.8800 ? 79.9800 : prev.longitude + deltaLng;
        return {
          ...prev,
          longitude: newLng,
          speedKmH: Math.floor(40 + Math.random() * 15),
          headingDegrees: 255 + Math.floor(Math.random() * 8),
          timestamp: new Date().toISOString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [open]);

  // Initialize Map
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [customerCoords.lat, customerCoords.lng],
          zoom: 12,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap | ISKON Developers GPS',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [open]);

  // Update Markers and Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 1. Vehicle Marker
    const vehicleIconHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(234, 88, 12, 0.3); animation: pulse 1.5s infinite;"></div>
        <div style="width: 34px; height: 34px; border-radius: 50%; background: #ea580c; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="15" rx="2"/><path d="M7 18v2"/><path d="M17 18v2"/><path d="M3 10h18"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/></svg>
        </div>
      </div>
    `;
    const vehicleIcon = L.divIcon({
      html: vehicleIconHtml,
      className: 'cust-veh-marker',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = L.marker([vehicleTelemetry.latitude, vehicleTelemetry.longitude], {
        icon: vehicleIcon,
      }).addTo(map);
    } else {
      vehicleMarkerRef.current.setLatLng([vehicleTelemetry.latitude, vehicleTelemetry.longitude]);
    }

    // 2. Customer Marker
    const customerIconHtml = `
      <div style="width: 32px; height: 32px; border-radius: 50%; background: #2563eb; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(37,99,235,0.4);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
    `;
    const customerIcon = L.divIcon({
      html: customerIconHtml,
      className: 'cust-user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!customerMarkerRef.current) {
      customerMarkerRef.current = L.marker([customerCoords.lat, customerCoords.lng], {
        icon: customerIcon,
      }).addTo(map);
    } else {
      customerMarkerRef.current.setLatLng([customerCoords.lat, customerCoords.lng]);
    }

    // 3. Polyline between Vehicle and Customer
    const lineCoords: [number, number][] = [
      [vehicleTelemetry.latitude, vehicleTelemetry.longitude],
      [customerCoords.lat, customerCoords.lng],
    ];

    if (!routePolylineRef.current) {
      routePolylineRef.current = L.polyline(lineCoords, {
        color: '#2563eb',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8,
      }).addTo(map);
    } else {
      routePolylineRef.current.setLatLngs(lineCoords);
    }
  }, [vehicleTelemetry, customerCoords]);

  // Use browser Geolocation to Share/Set Live Pickup Location
  const handleShareCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCustomerCoords({ lat, lng });
        setLocationShared(true);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 14);
        }

        // Push customer pickup location to Firestore for driver and admin to see
        try {
          const { db } = getFirebaseInstance();
          if (db) {
            const locRef = doc(db, 'vehicle_live_locations', vehicleTelemetry.vehicleId || 'veh-2');
            await setDoc(
              locRef,
              {
                customerPickup: {
                  customerName,
                  phone: customerPhone,
                  latitude: lat,
                  longitude: lng,
                  address: customerAddress,
                  status: 'WAITING',
                  pickupTime: new Date().toISOString(),
                },
              },
              { merge: true }
            );
          }
        } catch (e) {
          console.warn('Customer location push to Firestore skipped:', e);
        }
      },
      () => {
        setIsLocating(false);
        alert('Could not access device GPS. You can enter your pickup area in the text field.');
      },

      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              bgcolor: 'primary.main',
              color: '#ffffff',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <DirectionsCarIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              Track My Site Visit Vehicle
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time GPS ride tracking & pickup location sharing
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {/* Top Status Banner */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            bgcolor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={800} color="#1e3a8a">
              {vehicleTelemetry.makeModel} ({vehicleTelemetry.registrationNumber})
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Assigned Driver: <strong>{vehicleTelemetry.driverName}</strong> ({vehicleTelemetry.driverPhone})
            </Typography>
            <Typography variant="caption" color="secondary.main" fontWeight={700} display="block">
              Destination Venture: {vehicleTelemetry.destinationVenture}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Vehicle Speed
              </Typography>
              <Chip
                icon={<SpeedIcon sx={{ fontSize: '1rem !important' }} />}
                label={`${vehicleTelemetry.speedKmH} KM/H`}
                size="small"
                color="warning"
                sx={{ fontWeight: 800 }}
              />
            </Box>

            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<PhoneIcon />}
              href={`tel:${vehicleTelemetry.driverPhone}`}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Call Driver
            </Button>
          </Stack>
        </Box>

        {/* Leaflet Live Map */}
        <Paper
          elevation={0}
          sx={{
            height: 280,
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            mb: 2,
            position: 'relative',
          }}
        >
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating Live Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 500,
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }} />
            <Typography variant="caption" fontWeight={700}>
              LIVE GPS ACTIVE
            </Typography>
          </Box>
        </Paper>

        {/* Customer Location Sharing Section */}
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                  📍 Set / Share Your Pickup Location
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Let the driver know your exact live GPS location for hassle-free pickup
                </Typography>
              </Box>

              <Button
                variant={locationShared ? 'contained' : 'outlined'}
                color={locationShared ? 'success' : 'primary'}
                size="small"
                startIcon={isLocating ? <CircularProgress size={16} /> : locationShared ? <CheckCircleIcon /> : <MyLocationIcon />}
                onClick={handleShareCurrentLocation}
                disabled={isLocating}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                {isLocating ? 'Acquiring GPS...' : locationShared ? 'Location Shared!' : 'Share My Live GPS'}
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="Your Name / Group"
                size="small"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Phone Number"
                size="small"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Pickup Landmark / Colony"
                size="small"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                sx={{ flex: 1.5 }}
              />
            </Stack>

            {locationShared && (
              <Alert severity="success" sx={{ mt: 1.5, py: 0.25, fontSize: '0.8rem' }}>
                Coordinates ({customerCoords.lat.toFixed(4)}° N, {customerCoords.lng.toFixed(4)}° E) successfully transmitted to driver <strong>{vehicleTelemetry.driverName}</strong>!
              </Alert>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Estimated Vehicle Arrival: <strong>~12 Minutes</strong>
        </Typography>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
          Close Tracker
        </Button>
      </DialogActions>
    </Dialog>
  );
};
