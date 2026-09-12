import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Divider,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommuteIcon from '@mui/icons-material/Commute';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { Vehicle, OdometerLog, Driver, VehicleStatus } from '@real-estate-erp/types';
import { DataTable, MetricCard, SearchBox } from '@real-estate-erp/ui';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { AddVehicleDialog } from './components/AddVehicleDialog';
import { AddTripLogDialog } from './components/AddTripLogDialog';
import { CompleteTripDialog } from './components/CompleteTripDialog';

export const SEED_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Ramesh Goud',
    phone: '+91 98490 11223',
    licenseNumber: 'TS-09-2015-0048123',
    status: 'AVAILABLE',
    assignedVehicleId: 'veh-1',
    assignedVehicleName: 'Toyota Innova Crysta (TS 09 UB 1001)',
    totalTripsCount: 148,
    rating: 4.9,
  },
  {
    id: 'drv-2',
    name: 'Suresh Kumar',
    phone: '+91 94412 33445',
    licenseNumber: 'TS-08-2017-0092144',
    status: 'ON_TRIP',
    assignedVehicleId: 'veh-2',
    assignedVehicleName: 'Force Tempo Traveller (TS 08 EX 4050)',
    totalTripsCount: 215,
    rating: 4.8,
  },
  {
    id: 'drv-3',
    name: 'Venu Madhav',
    phone: '+91 91234 56780',
    licenseNumber: 'TS-07-2019-0012399',
    status: 'AVAILABLE',
    assignedVehicleId: 'veh-3',
    assignedVehicleName: 'Maruti Suzuki Ertiga (TS 07 HK 2020)',
    totalTripsCount: 92,
    rating: 4.7,
  },
  {
    id: 'drv-4',
    name: 'Prakash Rao',
    phone: '+91 99887 76655',
    licenseNumber: 'TS-09-2016-0078120',
    status: 'ON_TRIP',
    assignedVehicleId: 'veh-4',
    assignedVehicleName: 'Mahindra Scorpio-N (TS 09 Z 8899)',
    totalTripsCount: 174,
    rating: 4.9,
  },
  {
    id: 'drv-5',
    name: 'Naresh Reddy',
    phone: '+91 97001 22334',
    licenseNumber: 'TS-08-2021-0034112',
    status: 'AVAILABLE',
    assignedVehicleId: 'veh-5',
    assignedVehicleName: 'Toyota Innova Hycross (TS 08 FA 3311)',
    totalTripsCount: 68,
    rating: 4.8,
  },
  {
    id: 'drv-6',
    name: 'K. Mallesh',
    phone: '+91 98665 44332',
    licenseNumber: 'TS-09-2018-0065231',
    status: 'ON_TRIP',
    assignedVehicleId: 'veh-6',
    assignedVehicleName: 'Tata Winger Luxury (TS 09 WL 7788)',
    totalTripsCount: 126,
    rating: 4.8,
  },
  {
    id: 'drv-7',
    name: 'B. Appa Rao',
    phone: '+91 94901 88776',
    licenseNumber: 'TS-07-2020-0089145',
    status: 'AVAILABLE',
    assignedVehicleId: 'veh-7',
    assignedVehicleName: 'Mahindra Thar 4x4 (TS 07 TH 4400)',
    totalTripsCount: 54,
    rating: 4.9,
  },
  {
    id: 'drv-8',
    name: 'Chandra Sekhar',
    phone: '+91 91002 33445',
    licenseNumber: 'TS-09-2022-0019283',
    status: 'AVAILABLE',
    assignedVehicleId: 'veh-8',
    assignedVehicleName: 'Toyota Fortuner 4x4 (TS 09 TF 9900)',
    totalTripsCount: 42,
    rating: 5.0,
  },
];

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    registrationNumber: 'TS 09 UB 1001',
    makeModel: 'Toyota Innova Crysta 2.4 VX',
    vehicleType: 'SUV',
    capacitySeats: 7,
    fuelType: 'DIESEL',
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Ramesh Goud',
    currentOdometerKm: 48250,
    status: 'AVAILABLE',
    insuranceExpiryDate: '2027-02-28',
    branchId: 'branch-1',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
  {
    id: 'veh-2',
    registrationNumber: 'TS 08 EX 4050',
    makeModel: 'Force Tempo Traveller 17 Seater',
    vehicleType: 'MINI_BUS',
    capacitySeats: 17,
    fuelType: 'DIESEL',
    assignedDriverId: 'drv-2',
    assignedDriverName: 'Suresh Kumar',
    currentOdometerKm: 64120,
    status: 'IN_TRANSIT',
    insuranceExpiryDate: '2026-11-30',
    branchId: 'branch-1',
    createdAt: '2025-03-15T11:00:00Z',
    updatedAt: '2026-09-09T09:00:00Z',
  },
  {
    id: 'veh-3',
    registrationNumber: 'TS 07 HK 2020',
    makeModel: 'Maruti Suzuki Ertiga ZXi',
    vehicleType: 'CAB',
    capacitySeats: 7,
    fuelType: 'CNG',
    assignedDriverId: 'drv-3',
    assignedDriverName: 'Venu Madhav',
    currentOdometerKm: 32400,
    status: 'AVAILABLE',
    insuranceExpiryDate: '2027-05-15',
    branchId: 'branch-1',
    createdAt: '2025-06-20T14:00:00Z',
    updatedAt: '2026-09-07T18:00:00Z',
  },
  {
    id: 'veh-4',
    registrationNumber: 'TS 09 Z 8899',
    makeModel: 'Mahindra Scorpio-N Z8',
    vehicleType: 'SUV',
    capacitySeats: 7,
    fuelType: 'DIESEL',
    assignedDriverId: 'drv-4',
    assignedDriverName: 'Prakash Rao',
    currentOdometerKm: 28900,
    status: 'IN_TRANSIT',
    insuranceExpiryDate: '2027-01-10',
    branchId: 'branch-1',
    createdAt: '2025-08-05T09:30:00Z',
    updatedAt: '2026-09-09T10:00:00Z',
  },
  {
    id: 'veh-5',
    registrationNumber: 'TS 08 FA 3311',
    makeModel: 'Toyota Innova Hycross Hybrid',
    vehicleType: 'SUV',
    capacitySeats: 8,
    fuelType: 'PETROL',
    assignedDriverId: 'drv-5',
    assignedDriverName: 'Naresh Reddy',
    currentOdometerKm: 14500,
    status: 'AVAILABLE',
    insuranceExpiryDate: '2027-08-25',
    branchId: 'branch-1',
    createdAt: '2025-11-12T16:00:00Z',
    updatedAt: '2026-09-08T15:00:00Z',
  },
  {
    id: 'veh-6',
    registrationNumber: 'TS 09 WL 7788',
    makeModel: 'Tata Winger Platinum 12 Seater',
    vehicleType: 'MINI_BUS',
    capacitySeats: 12,
    fuelType: 'DIESEL',
    assignedDriverId: 'drv-6',
    assignedDriverName: 'K. Mallesh',
    currentOdometerKm: 22800,
    status: 'IN_TRANSIT',
    insuranceExpiryDate: '2027-03-20',
    branchId: 'branch-2',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-09-09T09:30:00Z',
  },
  {
    id: 'veh-7',
    registrationNumber: 'TS 07 TH 4400',
    makeModel: 'Mahindra Thar 4x4 (Venture Survey)',
    vehicleType: 'SUV',
    capacitySeats: 4,
    fuelType: 'DIESEL',
    assignedDriverId: 'drv-7',
    assignedDriverName: 'B. Appa Rao',
    currentOdometerKm: 19450,
    status: 'AVAILABLE',
    insuranceExpiryDate: '2027-06-15',
    branchId: 'branch-1',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-09-09T08:00:00Z',
  },
  {
    id: 'veh-8',
    registrationNumber: 'TS 09 TF 9900',
    makeModel: 'Toyota Fortuner 4x4 Legender (VIP / MD Escort)',
    vehicleType: 'SUV',
    capacitySeats: 7,
    fuelType: 'DIESEL',
    assignedDriverId: 'drv-8',
    assignedDriverName: 'Chandra Sekhar',
    currentOdometerKm: 12100,
    status: 'AVAILABLE',
    insuranceExpiryDate: '2027-10-10',
    branchId: 'branch-1',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-09-09T08:30:00Z',
  },
];

export const SEED_TRIPS: OdometerLog[] = [
  {
    id: 'trip-1',
    tripNumber: 'TRIP-2026-042',
    vehicleId: 'veh-2',
    vehicleName: 'Force Tempo Traveller (TS 08 EX 4050)',
    driverId: 'drv-2',
    driverName: 'Suresh Kumar',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Sunrise Enclave (Mokila)',
    customerName: 'NRI Investors Delegation from Dallas (12 Pax)',
    startOdometerKm: 64020,
    startTime: '2026-09-09T09:30:00Z',
    notes: 'Direct site visit from Jubilee Hills office with executive refreshments and lunch buffet.',
    status: 'ACTIVE',
  },
  {
    id: 'trip-2',
    tripNumber: 'TRIP-2026-041',
    vehicleId: 'veh-4',
    vehicleName: 'Mahindra Scorpio-N (TS 09 Z 8899)',
    driverId: 'drv-4',
    driverName: 'Prakash Rao',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Green Valley Phase 2 (Shadnagar)',
    customerName: 'Mr. Rajasekhar & Family',
    startOdometerKm: 28810,
    startTime: '2026-09-09T10:15:00Z',
    notes: 'Visiting 60ft road commercial plots and East facing villa plots.',
    status: 'ACTIVE',
  },
  {
    id: 'trip-3',
    tripNumber: 'TRIP-2026-043',
    vehicleId: 'veh-6',
    vehicleName: 'Tata Winger Luxury (TS 09 WL 7788)',
    driverId: 'drv-6',
    driverName: 'K. Mallesh',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Palm County Villa Plots (Kollur)',
    customerName: 'Gachibowli IT Corridor Group (8 Pax)',
    startOdometerKm: 22710,
    startTime: '2026-09-09T10:30:00Z',
    notes: 'Pickup from Wipro Circle & DLF Cybercity; site tour with sales exec Anand Naidu.',
    status: 'ACTIVE',
  },
  {
    id: 'trip-4',
    tripNumber: 'TRIP-2026-040',
    vehicleId: 'veh-1',
    vehicleName: 'Toyota Innova Crysta (TS 09 UB 1001)',
    driverId: 'drv-1',
    driverName: 'Ramesh Goud',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Sunrise Enclave (Mokila)',
    customerName: 'Kiran Reddy & Dr. Haritha Rao',
    startOdometerKm: 48160,
    endOdometerKm: 48250,
    totalDistanceKm: 90,
    startTime: '2026-09-08T11:00:00Z',
    endTime: '2026-09-08T16:30:00Z',
    notes: 'Completed site visit. Customer paid ₹5,00,000 token advance for Plot SE-102.',
    status: 'COMPLETED',
  },
  {
    id: 'trip-5',
    tripNumber: 'TRIP-2026-039',
    vehicleId: 'veh-3',
    vehicleName: 'Maruti Suzuki Ertiga (TS 07 HK 2020)',
    driverId: 'drv-3',
    driverName: 'Venu Madhav',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Palm County Villa Plots (Kollur)',
    customerName: 'Dr. Anand Swamy & Family',
    startOdometerKm: 32320,
    endOdometerKm: 32400,
    totalDistanceKm: 80,
    startTime: '2026-09-07T14:00:00Z',
    endTime: '2026-09-07T18:00:00Z',
    notes: 'Villa plot boundary inspection completed. Expressed interest in corner plot PC-05.',
    status: 'COMPLETED',
  },
  {
    id: 'trip-6',
    tripNumber: 'TRIP-2026-038',
    vehicleId: 'veh-5',
    vehicleName: 'Toyota Innova Hycross (TS 08 FA 3311)',
    driverId: 'drv-5',
    driverName: 'Naresh Reddy',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Royal Meadows (Shankarpally)',
    customerName: 'Satyanarayana Murthy & Friends',
    startOdometerKm: 14380,
    endOdometerKm: 14500,
    totalDistanceKm: 120,
    startTime: '2026-09-06T09:30:00Z',
    endTime: '2026-09-06T15:00:00Z',
    notes: 'Roundtrip inspection of farmhouse & residential plots. Customer requested quotation.',
    status: 'COMPLETED',
  },
  {
    id: 'trip-7',
    tripNumber: 'TRIP-2026-037',
    vehicleId: 'veh-2',
    vehicleName: 'Force Tempo Traveller (TS 08 EX 4050)',
    driverId: 'drv-2',
    driverName: 'Suresh Kumar',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Green Valley Phase 2 (Shadnagar)',
    customerName: 'Sunday Mega Tour (16 Prospective Buyers)',
    startOdometerKm: 63860,
    endOdometerKm: 64020,
    totalDistanceKm: 160,
    startTime: '2026-09-05T08:30:00Z',
    endTime: '2026-09-05T17:30:00Z',
    notes: 'Mega weekend public site tour. 4 on-spot spot token bookings collected.',
    status: 'COMPLETED',
  },
  {
    id: 'trip-8',
    tripNumber: 'TRIP-2026-036',
    vehicleId: 'veh-7',
    vehicleName: 'Mahindra Thar 4x4 (TS 07 TH 4400)',
    driverId: 'drv-7',
    driverName: 'B. Appa Rao',
    tripType: 'OFFICE_COMMUTE',
    siteVisitProjectName: 'Sunrise Enclave Phase 2 Extension',
    customerName: 'Project Civil Engineering & Survey Team',
    startOdometerKm: 19350,
    endOdometerKm: 19450,
    totalDistanceKm: 100,
    startTime: '2026-09-04T07:30:00Z',
    endTime: '2026-09-04T16:00:00Z',
    notes: 'Topographical land survey and contour GPS marking for Phase 2 extension.',
    status: 'COMPLETED',
  },
  {
    id: 'trip-9',
    tripNumber: 'TRIP-2026-035',
    vehicleId: 'veh-8',
    vehicleName: 'Toyota Fortuner 4x4 Legender (TS 09 TF 9900)',
    driverId: 'drv-8',
    driverName: 'Chandra Sekhar',
    tripType: 'MARKETING',
    siteVisitProjectName: 'Sunrise Enclave (Mokila)',
    customerName: 'Managing Director & Institutional Investors',
    startOdometerKm: 11980,
    endOdometerKm: 12100,
    totalDistanceKm: 120,
    startTime: '2026-09-03T10:00:00Z',
    endTime: '2026-09-03T16:00:00Z',
    notes: 'High-level syndicate joint venture inspection with institutional banking partners.',
    status: 'COMPLETED',
  },
  {
    id: 'trip-10',
    tripNumber: 'TRIP-2026-034',
    vehicleId: 'veh-1',
    vehicleName: 'Toyota Innova Crysta (TS 09 UB 1001)',
    driverId: 'drv-1',
    driverName: 'Ramesh Goud',
    tripType: 'SITE_VISIT',
    siteVisitProjectName: 'Green Valley Phase 2 (Shadnagar)',
    customerName: 'Kalyan Chakravarthy & Venkat Raman',
    startOdometerKm: 48020,
    endOdometerKm: 48160,
    totalDistanceKm: 140,
    startTime: '2026-09-02T10:00:00Z',
    endTime: '2026-09-02T16:00:00Z',
    notes: 'Highway corridor site tour. Both customers booked adjacent commercial plots.',
    status: 'COMPLETED',
  },
];

export const VehiclesWorkspace: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(SEED_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(SEED_DRIVERS);
  const [trips, setTrips] = useState<OdometerLog[]>(SEED_TRIPS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Dialogs
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [addTripOpen, setAddTripOpen] = useState(false);
  const [selectedTripToComplete, setSelectedTripToComplete] = useState<OdometerLog | null>(null);
  const [completeTripOpen, setCompleteTripOpen] = useState(false);

  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const vSnap = await getDocs(query(collection(db, 'vehicles'), limit(50)));
          if (!vSnap.empty) {
            const fetchedV = vSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Vehicle[];
            const fIds = new Set(fetchedV.map((v) => v.id));
            setVehicles([...fetchedV, ...SEED_VEHICLES.filter((v) => !fIds.has(v.id))]);
          }

          const tSnap = await getDocs(
            query(collection(db, 'vehicle_trips'), orderBy('createdAt', 'desc'), limit(50))
          );
          if (!tSnap.empty) {
            const fetchedT = tSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as OdometerLog[];
            const tIds = new Set(fetchedT.map((t) => t.id));
            setTrips([...fetchedT, ...SEED_TRIPS.filter((t) => !tIds.has(t.id))]);
          }
        }
      } catch (err) {
        console.warn('Firebase fetch fleet error, fallback to seed records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFleetData();
  }, []);

  const handleVehicleAdded = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const handleTripAdded = (newTrip: OdometerLog) => {
    setTrips((prev) => [newTrip, ...prev]);
    // Set vehicle status to IN_TRANSIT
    setVehicles((prev) =>
      prev.map((v) => (v.id === newTrip.vehicleId ? { ...v, status: 'IN_TRANSIT' } : v))
    );
    // Set driver status to ON_TRIP
    setDrivers((prev) =>
      prev.map((d) => (d.id === newTrip.driverId ? { ...d, status: 'ON_TRIP' } : d))
    );
  };

  const handleTripCompleted = (tripId: string, endOdometerKm: number, notes?: string) => {
    let completedTrip: OdometerLog | undefined;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const totalDistanceKm = endOdometerKm - t.startOdometerKm;
          completedTrip = {
            ...t,
            endOdometerKm,
            totalDistanceKm,
            endTime: new Date().toISOString(),
            notes: notes ? `${t.notes ? t.notes + '\n' : ''}${notes}` : t.notes,
            status: 'COMPLETED',
          };
          return completedTrip;
        }
        return t;
      })
    );

    // Free up vehicle and driver
    if (completedTrip) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === completedTrip!.vehicleId
            ? { ...v, currentOdometerKm: endOdometerKm, status: 'AVAILABLE' }
            : v
        )
      );
      setDrivers((prev) =>
        prev.map((d) => (d.id === completedTrip!.driverId ? { ...d, status: 'AVAILABLE' } : d))
      );
    }
  };

  const openCompleteModal = (trip: OdometerLog) => {
    setSelectedTripToComplete(trip);
    setCompleteTripOpen(true);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const inTransit = vehicles.filter((v) => v.status === 'IN_TRANSIT').length;
    const available = vehicles.filter((v) => v.status === 'AVAILABLE').length;
    const totalTripsDist = trips.reduce((sum, t) => sum + (t.totalDistanceKm || 0), 0);

    return {
      totalVehicles,
      inTransit,
      available,
      totalDistance: `${totalTripsDist.toLocaleString('en-IN')} KM`,
    };
  }, [vehicles, trips]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (v) =>
        !searchTerm.trim() ||
        v.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.assignedDriverName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  const filteredTrips = useMemo(() => {
    return trips.filter(
      (t) =>
        !searchTerm.trim() ||
        t.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.siteVisitProjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tripNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trips, searchTerm]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(
      (d) =>
        !searchTerm.trim() ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.assignedVehicleName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [drivers, searchTerm]);

  const getVehicleStatusChip = (status: VehicleStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <Chip label="AVAILABLE" size="small" color="success" sx={{ fontWeight: 700 }} />;
      case 'IN_TRANSIT':
        return <Chip label="IN TRANSIT" size="small" color="warning" sx={{ fontWeight: 700 }} />;
      case 'MAINTENANCE':
        return <Chip label="MAINTENANCE" size="small" color="error" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label={status} size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  // Vehicles Table Columns
  const vehicleColumns = [
    {
      id: 'registrationNumber',
      label: 'Reg. Number & Model',
      sortable: true,
      render: (row: Vehicle) => (
        <Box>
          <Typography variant="body2" fontWeight={700} color="primary">
            {row.registrationNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.makeModel}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'vehicleType',
      label: 'Type & Capacity',
      render: (row: Vehicle) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <AirlineSeatReclineNormalIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {row.capacitySeats} Seater ({row.vehicleType})
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'fuelType',
      label: 'Fuel Type',
      render: (row: Vehicle) => (
        <Chip
          size="small"
          icon={<LocalGasStationIcon />}
          label={row.fuelType}
          variant="outlined"
        />
      ),
    },
    {
      id: 'assignedDriver',
      label: 'Assigned Driver',
      render: (row: Vehicle) => (
        <Typography variant="body2" fontWeight={500}>
          {row.assignedDriverName || 'Unassigned'}
        </Typography>
      ),
    },
    {
      id: 'odometer',
      label: 'Current Odometer',
      render: (row: Vehicle) => (
        <Typography variant="body2" fontWeight={700}>
          {row.currentOdometerKm.toLocaleString('en-IN')} KM
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (row: Vehicle) => getVehicleStatusChip(row.status),
    },
  ];

  // Trips Table Columns
  const tripColumns = [
    {
      id: 'tripNumber',
      label: 'Trip No. & Date',
      sortable: true,
      render: (row: OdometerLog) => (
        <Box>
          <Typography variant="body2" fontWeight={700} color="primary">
            {row.tripNumber || row.id}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(row.startTime).toLocaleDateString('en-IN')}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'vehicle',
      label: 'Fleet Vehicle & Driver',
      render: (row: OdometerLog) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.vehicleName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Driver: {row.driverName}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'destination',
      label: 'Destination Venture & Customer',
      render: (row: OdometerLog) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {row.siteVisitProjectName}
          </Typography>
          {row.customerName && (
            <Typography variant="caption" color="text.secondary" display="block">
              Group: {row.customerName}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'odometer',
      label: 'Odometer (Start / End)',
      render: (row: OdometerLog) => (
        <Box>
          <Typography variant="body2">
            Start: {row.startOdometerKm.toLocaleString('en-IN')} KM
          </Typography>
          {row.endOdometerKm ? (
            <Typography variant="caption" color="success.main" fontWeight={600} display="block">
              End: {row.endOdometerKm.toLocaleString('en-IN')} KM ({row.totalDistanceKm} KM)
            </Typography>
          ) : (
            <Typography variant="caption" color="warning.main" fontWeight={600} display="block">
              Trip Ongoing...
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (row: OdometerLog) => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'ACTIVE' ? 'warning' : 'success'}
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: OdometerLog) =>
        row.status === 'ACTIVE' ? (
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={(e) => {
              e.stopPropagation();
              openCompleteModal(row);
            }}
          >
            End Trip
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Completed
          </Typography>
        ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Vehicle Fleet & Drivers Workspace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage company vehicles, driver roster, customer site visit logs, and trip odometer readings
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<CommuteIcon />}
            onClick={() => setAddTripOpen(true)}
            sx={{ px: 2, fontWeight: 600, borderRadius: 2 }}
          >
            Dispatch Trip
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddVehicleOpen(true)}
            sx={{ px: 2.5, fontWeight: 600, borderRadius: 2 }}
          >
            Add Fleet Car
          </Button>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Fleet Vehicles" value={metrics.totalVehicles} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="In Transit / Active Trips" value={metrics.inTransit} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Available for Site Trips" value={metrics.available} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Logged Mileage This Month" value={metrics.totalDistance} />
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Fleet Vehicles & Cars" />
          <Tab
            label={
              <Badge badgeContent={metrics.inTransit} color="warning" sx={{ pr: 1 }}>
                Site Visit Trip Logs
              </Badge>
            }
          />
          <Tab label="Drivers Directory" />
        </Tabs>

        {/* Search Toolbar */}
        <Box sx={{ p: 2.5, pb: 0 }}>
          <Box sx={{ maxWidth: 450 }}>
            <SearchBox
              placeholder="Search by vehicle reg, model, driver, or customer..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>

        {/* Tab 0: Fleet Vehicles */}
        {currentTab === 0 && (
          <Box sx={{ p: 2.5 }}>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {filteredVehicles.map((v) => (
                <Grid item xs={12} sm={6} md={4} key={v.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2.5,
                      border: 1,
                      borderColor: v.status === 'IN_TRANSIT' ? 'warning.main' : 'divider',
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {v.makeModel}
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight={700}>
                            {v.registrationNumber}
                          </Typography>
                        </Box>
                        {getVehicleStatusChip(v.status)}
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Capacity:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {v.capacitySeats} Seater ({v.vehicleType})
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Fuel Type:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {v.fuelType}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Assigned Driver:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {v.assignedDriverName || 'None'}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Odometer Reading:
                          </Typography>
                          <Typography variant="body2" fontWeight={800}>
                            {v.currentOdometerKm.toLocaleString('en-IN')} KM
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ p: 1.5, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        startIcon={<CommuteIcon />}
                        onClick={() => setAddTripOpen(true)}
                      >
                        Dispatch on Trip
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Fleet Inventory Table
            </Typography>
            <DataTable {...({ columns: vehicleColumns, data: filteredVehicles, loading } as any)} />
          </Box>
        )}

        {/* Tab 1: Site Visit Trip Logs */}
        {currentTab === 1 && (
          <Box sx={{ p: 2 }}>
            <DataTable {...({ columns: tripColumns, data: filteredTrips, loading } as any)} />
          </Box>
        )}

        {/* Tab 2: Drivers Directory */}
        {currentTab === 2 && (
          <Box sx={{ p: 2.5 }}>
            <Grid container spacing={2.5}>
              {filteredDrivers.map((driver) => (
                <Grid item xs={12} sm={6} md={4} key={driver.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {driver.name}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {driver.phone}
                            </Typography>
                          </Stack>
                        </Box>
                        <Chip
                          label={driver.status.replace('_', ' ')}
                          size="small"
                          color={driver.status === 'AVAILABLE' ? 'success' : 'warning'}
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Stack spacing={0.75}>
                        <Typography variant="caption" color="text.secondary">
                          Driving License: <b>{driver.licenseNumber}</b>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Assigned Vehicle: <b>{driver.assignedVehicleName || 'None'}</b>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Site Trips: <b>{driver.totalTripsCount || 0} Trips Completed</b>
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Dialogs */}
      <AddVehicleDialog
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onVehicleAdded={handleVehicleAdded}
        availableDrivers={drivers}
      />

      <AddTripLogDialog
        open={addTripOpen}
        onClose={() => setAddTripOpen(false)}
        onTripAdded={handleTripAdded}
        vehicles={vehicles}
        drivers={drivers}
      />

      <CompleteTripDialog
        trip={selectedTripToComplete}
        open={completeTripOpen}
        onClose={() => setCompleteTripOpen(false)}
        onTripCompleted={handleTripCompleted}
      />
    </Box>
  );
};

export default VehiclesWorkspace;
