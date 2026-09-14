import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Switch,
  FormControlLabel,
  Card,
  Divider,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PhoneIcon from '@mui/icons-material/Phone';
import LayersIcon from '@mui/icons-material/Layers';
import { Vehicle, OdometerLog, Driver, VehicleLocation } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveVehicleTrackingMapProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: OdometerLog[];
}

// Nellore Region Hubs & Ventures Coordinates
export const NELLORE_HUBS = {
  HEAD_OFFICE: { name: 'RKRI Towers Head Office (Annamayya Circle, Nellore)', lat: 14.4426, lng: 79.9865 },
  VENTURES: [
    { id: 'v-iskon-city-2', name: 'ISKON City - 2 (Podalakur Road)', lat: 14.4100, lng: 79.8800 },
    { id: 'v-dream-city', name: 'Dream City (Nellore-Bombay Hwy / Kovuru)', lat: 14.5000, lng: 79.9800 },
    { id: 'v-brundhavanam', name: 'ISKON Brundhavanam (Chinthareddypalem)', lat: 14.4280, lng: 79.9700 },
    { id: 'v-elite-township', name: 'ISKON Elite Township (Annamayya Extn)', lat: 14.4380, lng: 79.9650 },
  ],
};

// Initial Seed Locations for Vehicles
const INITIAL_LOCATIONS: Record<string, VehicleLocation> = {
  'veh-2': {
    vehicleId: 'veh-2',
    driverId: 'drv-2',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 94412 33445',
    registrationNumber: 'AP 26 TH 4050',
    makeModel: 'Force Tempo Traveller 17 Seater',
    vehicleType: 'MINI_BUS',
    latitude: 14.4250,
    longitude: 79.9200, // Moving towards ISKON City - 2 on Podalakur road
    speedKmH: 52,
    headingDegrees: 260,
    status: 'IN_TRANSIT',
    currentTripId: 'trip-1',
    destinationVenture: 'ISKON City - 2 (Podalakur Road)',
    customerPickup: {
      customerName: 'NRI Investors Delegation (12 Pax)',
      phone: '+91 98490 99887',
      latitude: 14.4426,
      longitude: 79.9865, // Annamayya Circle
      address: 'Annamayya Circle, Mini Bypass Road, Nellore',
      status: 'PICKED_UP',
    },
    batteryLevelPercent: 94,
    timestamp: new Date().toISOString(),
  },
  'veh-4': {
    vehicleId: 'veh-4',
    driverId: 'drv-4',
    driverName: 'Prakash Rao',
    driverPhone: '+91 99887 76655',
    registrationNumber: 'AP 26 Z 8899',
    makeModel: 'Mahindra Scorpio-N Z8',
    vehicleType: 'SUV',
    latitude: 14.4750,
    longitude: 79.9800, // Towards Kovuru / Dream City
    speedKmH: 64,
    headingDegrees: 195,
    status: 'IN_TRANSIT',
    currentTripId: 'trip-2',
    destinationVenture: 'Dream City (Kovuru)',
    customerPickup: {
      customerName: 'Mr. Rajasekhar & Family',
      phone: '+91 91234 11223',
      latitude: 14.4450,
      longitude: 79.9800, // Nellore RTC Complex
      address: 'RTC Complex, Nellore City',
      status: 'PICKED_UP',
    },
    batteryLevelPercent: 88,
    timestamp: new Date().toISOString(),
  },
  'veh-6': {
    vehicleId: 'veh-6',
    driverId: 'drv-6',
    driverName: 'K. Mallesh',
    driverPhone: '+91 98665 44332',
    registrationNumber: 'AP 26 WL 7788',
    makeModel: 'Tata Winger Platinum 12 Seater',
    vehicleType: 'MINI_BUS',
    latitude: 14.4320,
    longitude: 79.9750, // Towards Chinthareddypalem
    speedKmH: 46,
    headingDegrees: 310,
    status: 'IN_TRANSIT',
    currentTripId: 'trip-3',
    destinationVenture: 'ISKON Brundhavanam (Chinthareddypalem)',
    customerPickup: {
      customerName: 'Narayana Hospital Doctors Group (8 Pax)',
      phone: '+91 97001 88990',
      latitude: 14.4350,
      longitude: 79.9820,
      address: 'Narayana Medical College, Nellore',
      status: 'PICKED_UP',
    },
    batteryLevelPercent: 91,
    timestamp: new Date().toISOString(),
  },
  'veh-1': {
    vehicleId: 'veh-1',
    driverId: 'drv-1',
    driverName: 'Ramesh Goud',
    driverPhone: '+91 98490 11223',
    registrationNumber: 'AP 26 UB 1001',
    makeModel: 'Toyota Innova Crysta',
    vehicleType: 'SUV',
    latitude: 14.4426,
    longitude: 79.9865, // Parked at RKRI Towers Head Office
    speedKmH: 0,
    headingDegrees: 0,
    status: 'AVAILABLE',
    timestamp: new Date().toISOString(),
  },
  'veh-3': {
    vehicleId: 'veh-3',
    driverId: 'drv-3',
    driverName: 'Venu Madhav',
    driverPhone: '+91 91234 56780',
    registrationNumber: 'AP 26 HK 2020',
    makeModel: 'Maruti Suzuki Ertiga ZXi',
    vehicleType: 'CAB',
    latitude: 14.4430,
    longitude: 79.9870, // Near Annamayya Circle
    speedKmH: 0,
    headingDegrees: 0,
    status: 'AVAILABLE',
    timestamp: new Date().toISOString(),
  },
  'veh-5': {
    vehicleId: 'veh-5',
    driverId: 'drv-5',
    driverName: 'Naresh Reddy',
    driverPhone: '+91 97001 22334',
    registrationNumber: 'AP 26 FA 3311',
    makeModel: 'Toyota Innova Hycross Hybrid',
    vehicleType: 'SUV',
    latitude: 14.4420,
    longitude: 79.9860,
    speedKmH: 0,
    headingDegrees: 0,
    status: 'AVAILABLE',
    timestamp: new Date().toISOString(),
  },
  'veh-7': {
    vehicleId: 'veh-7',
    driverId: 'drv-7',
    driverName: 'B. Appa Rao',
    driverPhone: '+91 94901 88776',
    registrationNumber: 'AP 26 TH 4400',
    makeModel: 'Mahindra Thar 4x4',
    vehicleType: 'SUV',
    latitude: 14.4425,
    longitude: 79.9868,
    speedKmH: 0,
    headingDegrees: 0,
    status: 'AVAILABLE',
    timestamp: new Date().toISOString(),
  },
  'veh-8': {
    vehicleId: 'veh-8',
    driverId: 'drv-8',
    driverName: 'Chandra Sekhar',
    driverPhone: '+91 91002 33445',
    registrationNumber: 'AP 26 TF 9900',
    makeModel: 'Toyota Fortuner 4x4 Legender',
    vehicleType: 'SUV',
    latitude: 14.4428,
    longitude: 79.9862,
    speedKmH: 0,
    headingDegrees: 0,
    status: 'AVAILABLE',
    timestamp: new Date().toISOString(),
  },
};

export const LiveVehicleTrackingMap: React.FC<LiveVehicleTrackingMapProps> = ({
  vehicles,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  const [liveLocations, setLiveLocations] = useState<Record<string, VehicleLocation>>(INITIAL_LOCATIONS);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-2');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'IN_TRANSIT' | 'AVAILABLE'>('ALL');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [mapTileType, setMapTileType] = useState<'STREET' | 'DARK' | 'SATELLITE'>('STREET');
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  // Merge registered fleet metadata into locations
  const fleetLocations = useMemo(() => {
    const merged: Record<string, VehicleLocation> = { ...liveLocations };

    vehicles.forEach((v) => {
      if (!merged[v.id]) {
        merged[v.id] = {
          vehicleId: v.id,
          driverId: v.assignedDriverId || '',
          driverName: v.assignedDriverName,
          registrationNumber: v.registrationNumber,
          makeModel: v.makeModel,
          vehicleType: v.vehicleType,
          latitude: NELLORE_HUBS.HEAD_OFFICE.lat + (Math.random() - 0.5) * 0.01,
          longitude: NELLORE_HUBS.HEAD_OFFICE.lng + (Math.random() - 0.5) * 0.01,
          speedKmH: 0,
          headingDegrees: 0,
          status: v.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        merged[v.id].makeModel = v.makeModel;
        merged[v.id].registrationNumber = v.registrationNumber;
        merged[v.id].vehicleType = v.vehicleType;
        merged[v.id].driverName = v.assignedDriverName || merged[v.id].driverName;
      }
    });

    return merged;
  }, [liveLocations, vehicles]);

  // Firestore Realtime Subscription
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const locCollection = collection(db, 'vehicle_live_locations');
        unsubscribe = onSnapshot(
          locCollection,
          (snapshot) => {
            if (!snapshot.empty) {
              const remoteLocs: Record<string, VehicleLocation> = {};
              snapshot.forEach((doc) => {
                const data = doc.data() as VehicleLocation;
                remoteLocs[doc.id] = data;
              });
              setLiveLocations((prev) => ({ ...prev, ...remoteLocs }));
              setLastSyncTime(new Date().toLocaleTimeString());
            }
          },
          (err) => {
            console.warn('Live location Firestore snapshot listener fallback to simulated state:', err);
          }
        );
      }
    } catch (e) {
      console.warn('Firebase init error in tracking map:', e);
    }

    return () => unsubscribe();
  }, []);

  // Live Simulation Ticker (Moves In-Transit Vehicles along realistic corridors)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setLiveLocations((prev) => {
        const next = { ...prev };

        // 1. veh-2 moving towards ISKON City - 2 on Podalakur Road (West)
        if (next['veh-2']) {
          const v = next['veh-2'];
          const deltaLat = (Math.random() - 0.48) * 0.0006;
          const deltaLng = -0.0012; // Westward towards Podalakur Road
          const newLng = v.longitude + deltaLng < 79.8800 ? 79.9500 : v.longitude + deltaLng;
          next['veh-2'] = {
            ...v,
            latitude: v.latitude + deltaLat,
            longitude: newLng,
            speedKmH: Math.floor(45 + Math.random() * 15),
            headingDegrees: 255 + Math.floor(Math.random() * 10),
            timestamp: new Date().toISOString(),
          };
        }

        // 2. veh-4 moving towards Dream City (Kovuru / North)
        if (next['veh-4']) {
          const v = next['veh-4'];
          const deltaLat = 0.0015; // Northward towards Kovuru
          const deltaLng = (Math.random() - 0.5) * 0.0004;
          const newLat = v.latitude + deltaLat > 14.5000 ? 14.4450 : v.latitude + deltaLat;
          next['veh-4'] = {
            ...v,
            latitude: newLat,
            longitude: v.longitude + deltaLng,
            speedKmH: Math.floor(55 + Math.random() * 20),
            headingDegrees: 15 + Math.floor(Math.random() * 10),
            timestamp: new Date().toISOString(),
          };
        }

        // 3. veh-6 moving towards ISKON Brundhavanam (Chinthareddypalem)
        if (next['veh-6']) {
          const v = next['veh-6'];
          const deltaLat = -0.0006;
          const deltaLng = -0.0008;
          const newLat = v.latitude + deltaLat < 14.4200 ? 14.4400 : v.latitude + deltaLat;
          const newLng = v.longitude + deltaLng < 79.9600 ? 79.9850 : v.longitude + deltaLng;
          next['veh-6'] = {
            ...v,
            latitude: newLat,
            longitude: newLng,
            speedKmH: Math.floor(40 + Math.random() * 18),
            headingDegrees: 215 + Math.floor(Math.random() * 10),
            timestamp: new Date().toISOString(),
          };
        }

        return next;
      });
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Tile URL based on switcher
  const getTileUrl = (type: 'STREET' | 'DARK' | 'SATELLITE') => {
    switch (type) {
      case 'DARK':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      case 'SATELLITE':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'STREET':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [14.4426, 79.9865],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer(getTileUrl(mapTileType), {
        attribution: '&copy; OpenStreetMap contributors | ISKON Developers Fleet GPS',
        maxZoom: 19,
      }).addTo(map);

      // Layers for dynamic updates
      routesLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Fix Leaflet tile rendering in flex containers
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, []);

  // Update Tile Layer if changed
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      L.tileLayer(getTileUrl(mapTileType), {
        attribution: '&copy; OpenStreetMap contributors | ISKON Developers Fleet GPS',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }
  }, [mapTileType]);

  // Create Custom HTML Icons
  const createVehicleIcon = useCallback((loc: VehicleLocation, isSelected: boolean) => {
    const isInTransit = loc.status === 'IN_TRANSIT';
    const bgGradient = isInTransit
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    const pulseRing = isInTransit
      ? `<div style="position: absolute; top: -6px; left: -6px; width: 44px; height: 44px; border-radius: 50%; background: rgba(245, 158, 11, 0.35); animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>`
      : '';

    const vehicleSvg =
      loc.vehicleType === 'MINI_BUS' || loc.vehicleType === 'BUS'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="15" rx="2"/><path d="M7 18v2"/><path d="M17 18v2"/><path d="M3 10h18"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.8 2 11v5c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;

    const html = `
      <style>
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      </style>
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        ${pulseRing}
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${bgGradient};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid ${isSelected ? '#ffffff' : '#f1f5f9'};
          transform: rotate(${loc.headingDegrees || 0}deg);
          transition: transform 0.4s ease;
          z-index: 10;
        ">
          ${vehicleSvg}
        </div>
        <div style="
          position: absolute;
          top: -22px;
          white-space: nowrap;
          background: ${isInTransit ? '#1e293b' : '#047857'};
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          pointer-events: none;
        ">
          ${loc.registrationNumber ? loc.registrationNumber.split(' ').slice(1).join(' ') : loc.vehicleId}
          ${isInTransit ? ` • ${loc.speedKmH} km/h` : ''}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-vehicle-marker',
      html,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  }, []);

  const createCustomerPickupIcon = (customer: any) => {
    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(37,99,235,0.4);
          border: 2px solid #ffffff;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div style="
          position: absolute;
          top: -20px;
          white-space: nowrap;
          background: #1d4ed8;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.3);
        ">
          Pickup: ${customer.customerName.split(' ')[0]}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-customer-marker',
      html,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  };

  const createVentureIcon = (ventureName: string) => {
    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px;">
        <div style="
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(124,58,237,0.4);
          border: 2px solid #ffffff;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        </div>
        <div style="
          position: absolute;
          bottom: -18px;
          white-space: nowrap;
          background: #581c87;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 6px;
        ">
          ${ventureName.split('(')[0].trim()}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-venture-marker',
      html,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -14],
    });
  };

  const createOfficeIcon = () => {
    const html = `
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: #0f172a;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #f8fafc;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
    `;

    return L.divIcon({
      className: 'custom-office-marker',
      html,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -16],
    });
  };

  // Render Markers and Polylines on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();

    // 1. Add Main Office HQ Marker
    const officeMarker = L.marker([NELLORE_HUBS.HEAD_OFFICE.lat, NELLORE_HUBS.HEAD_OFFICE.lng], {
      icon: createOfficeIcon(),
      title: NELLORE_HUBS.HEAD_OFFICE.name,
    }).bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <strong style="color: #0f172a; font-size: 13px;">🏢 ${NELLORE_HUBS.HEAD_OFFICE.name}</strong><br/>
        <span style="color: #64748b;">Central Fleet Dispatch & Executive HQ</span>
      </div>
    `);
    markersLayerRef.current.addLayer(officeMarker);

    // 2. Add Venture Destination Pins
    NELLORE_HUBS.VENTURES.forEach((ven) => {
      const vMarker = L.marker([ven.lat, ven.lng], {
        icon: createVentureIcon(ven.name),
        title: ven.name,
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #7c3aed; font-size: 13px;">🚩 ${ven.name}</strong><br/>
          <span style="color: #64748b;">Real Estate Site Visit Destination</span>
        </div>
      `);
      markersLayerRef.current?.addLayer(vMarker);
    });

    // 3. Filter Vehicles to display
    const visibleLocations = Object.values(fleetLocations).filter((loc) => {
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'IN_TRANSIT') return loc.status === 'IN_TRANSIT';
      if (filterStatus === 'AVAILABLE') return loc.status === 'AVAILABLE';
      return true;
    });

    // 4. Add Vehicles and Customer Pickups
    visibleLocations.forEach((loc) => {
      const isSelected = loc.vehicleId === selectedVehicleId;
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: createVehicleIcon(loc, isSelected),
        title: `${loc.registrationNumber || loc.vehicleId} (${loc.driverName || 'Driver'})`,
        zIndexOffset: isSelected ? 1000 : loc.status === 'IN_TRANSIT' ? 500 : 100,
      });

      marker.on('click', () => {
        setSelectedVehicleId(loc.vehicleId);
      });

      // Rich Vehicle Popup
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 230px; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 800; color: #1e293b; font-size: 13px;">${loc.registrationNumber || loc.vehicleId}</span>
            <span style="background: ${loc.status === 'IN_TRANSIT' ? '#fef3c7' : '#dcfce7'}; color: ${loc.status === 'IN_TRANSIT' ? '#92400e' : '#166534'}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;">
              ${loc.status === 'IN_TRANSIT' ? 'LIVE ON TRIP' : 'AVAILABLE'}
            </span>
          </div>

          <div style="color: #475569; font-size: 11px; margin-bottom: 8px;">
            ${loc.makeModel || 'Fleet Vehicle'}
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-bottom: 8px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Driver:</span>
              <strong style="color: #0f172a;">${loc.driverName || 'Unassigned'}</strong>
            </div>
            ${loc.driverPhone ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span style="color: #64748b;">Phone:</span>
                <a href="tel:${loc.driverPhone}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${loc.driverPhone}</a>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Speed:</span>
              <strong style="color: #ea580c;">${loc.speedKmH || 0} KM/H</strong>
            </div>
          </div>

          ${loc.destinationVenture ? `
            <div style="font-size: 11px; color: #581c87; margin-bottom: 4px;">
              <strong>🎯 Destination:</strong> ${loc.destinationVenture}
            </div>
          ` : ''}

          ${loc.customerPickup ? `
            <div style="font-size: 11px; color: #1e40af; margin-bottom: 6px; background: #eff6ff; padding: 5px; border-radius: 4px;">
              <strong>👤 Customer:</strong> ${loc.customerPickup.customerName}<br/>
              <span style="font-size: 10px; color: #3b82f6;">📍 ${loc.customerPickup.address || 'Pickup Point'}</span>
            </div>
          ` : ''}

          <div style="font-size: 9px; color: #94a3b8; text-align: right; margin-top: 4px;">
            GPS Ping: ${new Date(loc.timestamp).toLocaleTimeString()}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersLayerRef.current?.addLayer(marker);

      // If In Transit and has customer pickup, plot customer marker + route line
      if (loc.status === 'IN_TRANSIT' && loc.customerPickup) {
        const custMarker = L.marker([loc.customerPickup.latitude, loc.customerPickup.longitude], {
          icon: createCustomerPickupIcon(loc.customerPickup),
          title: `Pickup: ${loc.customerPickup.customerName}`,
        }).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #1d4ed8; font-size: 13px;">👤 ${loc.customerPickup.customerName}</strong><br/>
            <span style="color: #475569;">📞 ${loc.customerPickup.phone || ''}</span><br/>
            <span style="color: #64748b;">📍 ${loc.customerPickup.address}</span>
          </div>
        `);
        markersLayerRef.current?.addLayer(custMarker);

        // Find venture destination coords
        const ventureObj = NELLORE_HUBS.VENTURES.find((v) => v.name === loc.destinationVenture);
        const destinationCoords = ventureObj
          ? [ventureObj.lat, ventureObj.lng]
          : [loc.latitude, loc.longitude];

        // Draw Polyline Route
        const routePoints: [number, number][] = [
          [NELLORE_HUBS.HEAD_OFFICE.lat, NELLORE_HUBS.HEAD_OFFICE.lng],
          [loc.customerPickup.latitude, loc.customerPickup.longitude],
          [loc.latitude, loc.longitude],
          destinationCoords as [number, number],
        ];

        const polyline = L.polyline(routePoints, {
          color: isSelected ? '#ea580c' : '#f59e0b',
          weight: isSelected ? 4 : 3,
          opacity: isSelected ? 0.9 : 0.65,
          dashArray: '6, 8',
        });
        routesLayerRef.current?.addLayer(polyline);
      }
    });
  }, [fleetLocations, filterStatus, selectedVehicleId, createVehicleIcon]);

  // Center on Selected Vehicle
  const handleFocusVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const loc = fleetLocations[vehicleId];
    if (loc && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 14, {
        animate: true,
        duration: 1.2,
      });
    }
  };

  // Fit all markers
  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const coords: [number, number][] = Object.values(fleetLocations).map((loc) => [
      loc.latitude,
      loc.longitude,
    ]);
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const selectedLoc = selectedVehicleId ? fleetLocations[selectedVehicleId] : null;
  const inTransitCount = Object.values(fleetLocations).filter((l) => l.status === 'IN_TRANSIT').length;

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Map Control Bar */}
      <Box
        sx={{
          p: 1.5,
          px: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        {/* Left: Title & Live Badge */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: inTransitCount > 0 ? '#fff7ed' : '#f0fdf4',
              border: '1px solid',
              borderColor: inTransitCount > 0 ? '#fdba74' : '#86efac',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: inTransitCount > 0 ? '#ea580c' : '#16a34a',
                animation: inTransitCount > 0 ? 'pulse-dot 1.5s infinite' : 'none',
                '@keyframes pulse-dot': {
                  '0%': { transform: 'scale(0.8)', opacity: 0.8 },
                  '50%': { transform: 'scale(1.3)', opacity: 1 },
                  '100%': { transform: 'scale(0.8)', opacity: 0.8 },
                },
              }}
            />
            <Typography variant="subtitle2" fontWeight={800} color={inTransitCount > 0 ? '#9a3412' : '#166534'}>
              LIVE GPS TRACKING
            </Typography>
            <Chip
              size="small"
              label={`${inTransitCount} IN TRANSIT`}
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: inTransitCount > 0 ? '#f97316' : '#22c55e',
                color: '#ffffff',
              }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            Last Sync: {lastSyncTime}
          </Typography>
        </Stack>

        {/* Center: Filter Tabs */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label="All Fleet"
            size="small"
            clickable
            color={filterStatus === 'ALL' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('ALL')}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="In Transit (Active)"
            size="small"
            clickable
            color={filterStatus === 'IN_TRANSIT' ? 'warning' : 'default'}
            onClick={() => setFilterStatus('IN_TRANSIT')}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="Available"
            size="small"
            clickable
            color={filterStatus === 'AVAILABLE' ? 'success' : 'default'}
            onClick={() => setFilterStatus('AVAILABLE')}
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {/* Right: Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={isSimulating}
                onChange={(e) => setIsSimulating(e.target.checked)}
                color="warning"
              />
            }
            label={
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Live Simulation
              </Typography>
            }
          />

          <Tooltip title="Switch Map Layer">
            <IconButton
              size="small"
              onClick={() =>
                setMapTileType((prev) => (prev === 'STREET' ? 'DARK' : prev === 'DARK' ? 'SATELLITE' : 'STREET'))
              }
            >
              <LayersIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Fit all fleet on map">
            <Button
              size="small"
              variant="outlined"
              startIcon={<MyLocationIcon fontSize="small" />}
              onClick={handleFitAll}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.4 }}
            >
              Fit Bounds
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* Main Map Container + Quick Active Fleet Drawer */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: 380, md: 440 } }}>
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Floating Quick Vehicle Selector Overlay (Top-Left) */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 400,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 0.75,
            maxHeight: 380,
            overflowY: 'auto',
            pointerEvents: 'auto',
          }}
        >
          {Object.values(fleetLocations)
            .filter((v) => v.status === 'IN_TRANSIT')
            .map((loc) => {
              const isSelected = loc.vehicleId === selectedVehicleId;
              return (
                <Card
                  key={loc.vehicleId}
                  onClick={() => handleFocusVehicle(loc.vehicleId)}
                  sx={{
                    width: 240,
                    p: 1.25,
                    cursor: 'pointer',
                    borderRadius: 2,
                    bgcolor: isSelected ? 'primary.dark' : 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.light' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#f8fafc', fontSize: '0.82rem' }}>
                      {loc.registrationNumber}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${loc.speedKmH} km/h`}
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: 'warning.main',
                        color: '#000000',
                      }}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.25 }} noWrap>
                    Driver: {loc.driverName}
                  </Typography>
                  {loc.destinationVenture && (
                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', fontWeight: 600 }} noWrap>
                      ➔ {loc.destinationVenture}
                    </Typography>
                  )}
                  {loc.customerPickup && (
                    <Typography variant="caption" sx={{ color: '#60a5fa', display: 'block', fontSize: '0.7rem' }} noWrap>
                      👤 Pickup: {loc.customerPickup.customerName}
                    </Typography>
                  )}
                </Card>
              );
            })}
        </Box>

        {/* Floating Selected Vehicle Telemetry Card (Bottom-Right) */}
        {selectedLoc && (
          <Card
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 400,
              width: { xs: 290, sm: 330 },
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                  {selectedLoc.registrationNumber || selectedLoc.vehicleId}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedLoc.makeModel}
                </Typography>
              </Box>
              <Chip
                label={selectedLoc.status}
                size="small"
                color={selectedLoc.status === 'IN_TRANSIT' ? 'warning' : 'success'}
                sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
              />
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack spacing={0.75}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Assigned Driver:
                </Typography>
                <Typography variant="caption" fontWeight={700}>
                  {selectedLoc.driverName || 'None'}
                </Typography>
              </Stack>

              {selectedLoc.driverPhone && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Driver Phone:
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<PhoneIcon fontSize="small" />}
                    href={`tel:${selectedLoc.driverPhone}`}
                    sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    {selectedLoc.driverPhone}
                  </Button>
                </Stack>
              )}

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Live Speed & Direction:
                </Typography>
                <Typography variant="caption" fontWeight={700} color="warning.dark">
                  {selectedLoc.speedKmH} KM/H • Heading {selectedLoc.headingDegrees || 0}°
                </Typography>
              </Stack>

              {selectedLoc.destinationVenture && (
                <Box sx={{ bgcolor: 'secondary.50', p: 0.75, borderRadius: 1.5, border: '1px dashed', borderColor: 'secondary.200' }}>
                  <Typography variant="caption" color="secondary.dark" fontWeight={700} display="block">
                    🎯 Destination: {selectedLoc.destinationVenture}
                  </Typography>
                  {selectedLoc.customerPickup && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      👤 Group: {selectedLoc.customerPickup.customerName}
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          </Card>
        )}
      </Box>
    </Paper>
  );
};
