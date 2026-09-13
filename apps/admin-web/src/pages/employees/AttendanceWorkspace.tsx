import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import { AttendanceRecord, AttendanceStatus } from '@real-estate-erp/types';
import { DataTable, MetricCard, SearchBox } from '@real-estate-erp/ui';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { PunchInOutDialog } from './components/PunchInOutDialog';
import { AttendanceDetailsDialog } from './components/AttendanceDetailsDialog';

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    userId: 'usr-1',
    userName: 'Rajesh Kumar',
    userRole: 'Managing Director',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Corporate HQ (Jubilee Hills, Hyderabad)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T08:30:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Executive Board review meeting, investor syndicate discussion for Shadnagar Phase 3.',
    totalHoursWorked: 9.5,
    createdAt: '2026-09-09T08:30:00Z',
    updatedAt: '2026-09-09T08:30:00Z',
  },
  {
    id: 'att-2',
    userId: 'usr-2',
    userName: 'K. Raghava Rao',
    userRole: 'Executive Director (Operations)',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Sunrise Enclave Site Office (Mokila)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T08:45:00Z`,
    isGeoFenceVerified: true,
    status: 'ON_FIELD_DUTY',
    workSummary: 'Inspecting HMDA layout demarcation, clubhouse foundation, and avenue plantation progress.',
    totalHoursWorked: 9,
    createdAt: '2026-09-09T08:45:00Z',
    updatedAt: '2026-09-09T08:45:00Z',
  },
  {
    id: 'att-3',
    userId: 'usr-3',
    userName: 'Srinivas Murthy',
    userRole: 'Branch Manager (Gachibowli)',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Gachibowli Branch Office',
    branchId: 'branch-2',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:00:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Conducted weekly sales review with Gachibowli team. Finalized 4 NRI token closures.',
    totalHoursWorked: 8.5,
    createdAt: '2026-09-09T09:00:00Z',
    updatedAt: '2026-09-09T09:00:00Z',
  },
  {
    id: 'att-4',
    userId: 'usr-4',
    userName: 'Kavitha Reddy',
    userRole: 'Branch Manager (Jubilee Hills)',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Head Office (Jubilee Hills)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:10:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Supervising HNI customer walkthroughs and branch administrative operations.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:10:00Z',
    updatedAt: '2026-09-09T09:10:00Z',
  },
  {
    id: 'att-5',
    userId: 'usr-5',
    userName: 'Lakshmi Narayana',
    userRole: 'Chief Financial Officer / Chief Accountant',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Finance Wing (Jubilee Hills HO)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:15:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Led statutory GST & TDS reconciliations. Approved agent commission batch #14.',
    totalHoursWorked: 8.5,
    createdAt: '2026-09-09T09:15:00Z',
    updatedAt: '2026-09-09T09:15:00Z',
  },
  {
    id: 'att-6',
    userId: 'usr-6',
    userName: 'Radha Krishna',
    userRole: 'Senior Accountant (Tax & Audits)',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Finance Wing (Jubilee Hills HO)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:20:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Customer payment receipt voucher generations and escrow bank account reconciliation.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:20:00Z',
    updatedAt: '2026-09-09T09:20:00Z',
  },
  {
    id: 'att-7',
    userId: 'usr-7',
    userName: 'Priya Sharma',
    userRole: 'Zonal Sales Head (Hyderabad West)',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Sunrise Enclave (Mokila)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:05:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Hosted high-ticket NRI investor delegation. Closed plot #SE-102 and villa plot #PC-05.',
    totalHoursWorked: 9.0,
    createdAt: '2026-09-09T09:05:00Z',
    updatedAt: '2026-09-09T09:05:00Z',
  },
  {
    id: 'att-8',
    userId: 'usr-8',
    userName: 'Praveen Teja',
    userRole: 'Senior Sales Manager',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Palm County Villa Plots (Kollur)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:40:00Z`,
    isGeoFenceVerified: true,
    status: 'ON_FIELD_DUTY',
    workSummary: 'Corner villa plot inspections with prospective doctor association buyers.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:40:00Z',
    updatedAt: '2026-09-09T09:40:00Z',
  },
  {
    id: 'att-9',
    userId: 'usr-9',
    userName: 'Anand Naidu',
    userRole: 'Senior Sales Executive',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Sunrise Enclave (Mokila)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:12:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Coordinated 3 family site visits from Financial District; collected 2 booking advances.',
    totalHoursWorked: 8.5,
    createdAt: '2026-09-09T09:12:00Z',
    updatedAt: '2026-09-09T09:12:00Z',
  },
  {
    id: 'att-10',
    userId: 'usr-10',
    userName: 'Vamshi Krishna',
    userRole: 'Field Sales Executive',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Green Valley Phase 2 (Shadnagar)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:15:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Accompanied highway corridor bus tour of 14 prospective investors.',
    totalHoursWorked: 8.5,
    createdAt: '2026-09-09T09:15:00Z',
    updatedAt: '2026-09-09T09:15:00Z',
  },
  {
    id: 'att-11',
    userId: 'usr-11',
    userName: 'Sneha Latha',
    userRole: 'Sales Relationship Executive',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Gachibowli Branch Office',
    branchId: 'branch-2',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:30:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Preparing sales agreement deeds, KYC dossiers, and allotment letters.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:30:00Z',
    updatedAt: '2026-09-09T09:30:00Z',
  },
  {
    id: 'att-12',
    userId: 'usr-12',
    userName: 'Vikram Varma',
    userRole: 'Digital Marketing Manager',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Corporate HQ (Jubilee Hills)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:10:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Optimizing Meta ads CPL to ₹34, launched NRI Gulf investment video campaign.',
    totalHoursWorked: 8.5,
    createdAt: '2026-09-09T09:10:00Z',
    updatedAt: '2026-09-09T09:10:00Z',
  },
  {
    id: 'att-13',
    userId: 'usr-13',
    userName: 'Mahesh Babu M',
    userRole: 'Digital Marketing Specialist',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Corporate HQ (Jubilee Hills)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:25:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'A/B testing landing page copy for Palm County villa plots; created Google ad variants.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:25:00Z',
    updatedAt: '2026-09-09T09:25:00Z',
  },
  {
    id: 'att-14',
    userId: 'usr-14',
    userName: 'Divya Sree',
    userRole: 'Events & Canvassing Lead',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Outdoor Canopy Stalls (Hitec City Metro)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T10:05:00Z`,
    isGeoFenceVerified: true,
    status: 'LATE',
    workSummary: 'Setting up Sunday property expo booth at Novotel Hitec City.',
    totalHoursWorked: 7.5,
    createdAt: '2026-09-09T10:05:00Z',
    updatedAt: '2026-09-09T10:05:00Z',
  },
  {
    id: 'att-15',
    userId: 'usr-15',
    userName: 'Sunita Reddy',
    userRole: 'Senior Telecaller Lead (HNI Desk)',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Head Office (Jubilee Hills)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:20:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Conducted 68 outbound HNI calls; scheduled 11 weekend site visits for Mokila.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:20:00Z',
    updatedAt: '2026-09-09T09:20:00Z',
  },
  {
    id: 'att-16',
    userId: 'usr-16',
    userName: 'Kiran Rao',
    userRole: 'Inbound Telecaller Executive',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Gachibowli Call Center',
    branchId: 'branch-2',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:28:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Handled 52 incoming phone enquiries from 99acres and billboard campaigns.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:28:00Z',
    updatedAt: '2026-09-09T09:28:00Z',
  },
  {
    id: 'att-17',
    userId: 'usr-17',
    userName: 'Meena Kumari',
    userRole: 'Outbound Telesales Associate',
    staffType: 'OFFICE_STAFF',
    assignedLocationName: 'Head Office (Jubilee Hills)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:30:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Cold calling bank employee database; converted 7 leads to warm follow-up.',
    totalHoursWorked: 8.0,
    createdAt: '2026-09-09T09:30:00Z',
    updatedAt: '2026-09-09T09:30:00Z',
  },
  {
    id: 'att-18',
    userId: 'usr-18',
    userName: 'Ramesh Goud',
    userRole: 'Senior Fleet Pilot',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Innova Crysta (TS 09 UB 1001)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T08:30:00Z`,
    isGeoFenceVerified: true,
    status: 'ON_FIELD_DUTY',
    workSummary: 'Morning pickup from Jubilee Hills to Mokila site with NRI customer family.',
    totalHoursWorked: 9.0,
    createdAt: '2026-09-09T08:30:00Z',
    updatedAt: '2026-09-09T08:30:00Z',
  },
  {
    id: 'att-19',
    userId: 'usr-19',
    userName: 'Suresh Kumar',
    userRole: 'Site Pilot (Tempo Traveller)',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Force Tempo Traveller (TS 08 EX 4050)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T08:45:00Z`,
    isGeoFenceVerified: true,
    status: 'ON_FIELD_DUTY',
    workSummary: 'Group tour of 14 investors to Green Valley Phase 2 Shadnagar.',
    totalHoursWorked: 9.5,
    createdAt: '2026-09-09T08:45:00Z',
    updatedAt: '2026-09-09T08:45:00Z',
  },
  {
    id: 'att-20',
    userId: 'usr-20',
    userName: 'Venu Madhav',
    userRole: 'Executive Chauffeur',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Maruti Suzuki Ertiga (TS 07 HK 2020)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    punchInTime: `${new Date().toISOString().split('T')[0]}T09:00:00Z`,
    isGeoFenceVerified: true,
    status: 'PRESENT',
    workSummary: 'Site visit with Dr. Anand Swamy to Palm County Kollur.',
    totalHoursWorked: 8.5,
    createdAt: '2026-09-09T09:00:00Z',
    updatedAt: '2026-09-09T09:00:00Z',
  },
  {
    id: 'att-21',
    userId: 'usr-21',
    userName: 'Prakash Rao',
    userRole: 'Site Van Pilot',
    staffType: 'FIELD_STAFF',
    assignedLocationName: 'Mahindra Scorpio-N (TS 09 Z 8899)',
    branchId: 'branch-1',
    date: new Date().toISOString().split('T')[0],
    isGeoFenceVerified: false,
    status: 'ON_LEAVE',
    workSummary: 'Approved casual leave for personal family event.',
    totalHoursWorked: 0,
    createdAt: '2026-09-09T08:00:00Z',
    updatedAt: '2026-09-09T08:00:00Z',
  },
];

export const AttendanceWorkspace: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Dialog States
  const [punchDialogOpen, setPunchDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const q = query(collection(db, 'attendance'), orderBy('createdAt', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as AttendanceRecord[];
            const fIds = new Set(fetched.map((a) => a.id));
            setAttendanceRecords([...fetched, ...SEED_ATTENDANCE.filter((a) => !fIds.has(a.id))]);
          }
        }
      } catch (err) {
        console.warn('Firestore fetch attendance error, fallback to seeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleAttendanceRecorded = (newRecord: AttendanceRecord) => {
    setAttendanceRecords((prev) => [newRecord, ...prev]);
  };

  const handleOpenDetails = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  const handlePunchOut = (recordId: string, punchOutTime: string, notes?: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            punchOutTime,
            workSummary: notes ? `${r.workSummary ? r.workSummary + '\n' : ''}${notes}` : r.workSummary,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalPresent = attendanceRecords.filter(
      (r) => r.status === 'PRESENT' || r.status === 'ON_FIELD_DUTY' || r.status === 'LATE'
    ).length;
    const fieldStaffCount = attendanceRecords.filter(
      (r) => r.staffType === 'FIELD_STAFF' && r.status !== 'ON_LEAVE' && r.status !== 'ABSENT'
    ).length;
    const officeStaffCount = attendanceRecords.filter(
      (r) => r.staffType === 'OFFICE_STAFF' && r.status !== 'ON_LEAVE' && r.status !== 'ABSENT'
    ).length;
    const onLeaveCount = attendanceRecords.filter(
      (r) => r.status === 'ON_LEAVE' || r.status === 'ABSENT'
    ).length;

    return {
      totalPresent,
      fieldStaffCount,
      officeStaffCount,
      onLeaveCount,
    };
  }, [attendanceRecords]);

  // Tab & Search Filtering
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      // Tab constraint
      if (currentTab === 1 && record.staffType !== 'FIELD_STAFF') return false;
      if (currentTab === 2 && record.staffType !== 'OFFICE_STAFF') return false;
      if (currentTab === 3 && record.status !== 'ON_LEAVE' && record.status !== 'ABSENT') return false;

      // Search
      const matchSearch =
        !searchTerm.trim() ||
        record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.assignedLocationName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const matchStatus = statusFilter === 'ALL' || record.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [attendanceRecords, currentTab, searchTerm, statusFilter]);

  const getStatusChip = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
      case 'ON_FIELD_DUTY':
        return <Chip label={status.replace('_', ' ')} size="small" color="success" sx={{ fontWeight: 700 }} />;
      case 'LATE':
      case 'HALF_DAY':
        return <Chip label={status.replace('_', ' ')} size="small" color="warning" sx={{ fontWeight: 700 }} />;
      case 'ON_LEAVE':
      case 'ABSENT':
        return <Chip label={status.replace('_', ' ')} size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.7rem', height: 22 }} />;
      default:
        return <Chip label={status} size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', height: 22 }} />;
    }
  };

  const columns = [
    {
      id: 'userName',
      label: 'Employee & Role',
      sortable: true,
      minWidth: 170,
      render: (row: AttendanceRecord) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" fontWeight={700} color="#0f172a">
            {row.userName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
            {row.userRole}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'staffType',
      label: 'Staff Category',
      minWidth: 150,
      render: (row: AttendanceRecord) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Chip
            size="small"
            icon={row.staffType === 'FIELD_STAFF' ? <TerrainIcon sx={{ fontSize: '14px !important' }} /> : <BusinessIcon sx={{ fontSize: '14px !important' }} />}
            label={row.staffType === 'FIELD_STAFF' ? 'Field Site Staff' : 'Head Office Staff'}
            color={row.staffType === 'FIELD_STAFF' ? 'primary' : 'default'}
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24 }}
          />
        </Box>
      ),
    },
    {
      id: 'location',
      label: 'Assigned Site / Branch',
      minWidth: 190,
      render: (row: AttendanceRecord) => (
        <Typography variant="body2" fontWeight={500} color="#334155" sx={{ fontSize: '0.82rem' }}>
          {row.assignedLocationName || 'Head Office'}
        </Typography>
      ),
    },
    {
      id: 'punchInTime',
      label: 'Punch In / Out',
      minWidth: 130,
      render: (row: AttendanceRecord) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>
            In:{' '}
            {row.punchInTime
              ? new Date(row.punchInTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : '--:--'}
          </Typography>
          <Typography variant="caption" sx={{ color: row.punchOutTime ? 'text.secondary' : '#16a34a', fontWeight: row.punchOutTime ? 500 : 700, display: 'block', fontSize: '0.72rem' }}>
            Out:{' '}
            {row.punchOutTime
              ? new Date(row.punchOutTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : 'Active Duty'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'geoFence',
      label: 'Geo-Fence Status',
      minWidth: 150,
      render: (row: AttendanceRecord) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          {row.isGeoFenceVerified ? (
            <Chip
              size="small"
              icon={<VerifiedIcon sx={{ fontSize: '14px !important' }} />}
              label="Verified On-Site"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24 }}
            />
          ) : (
            <Chip
              size="small"
              icon={<LocationOffIcon sx={{ fontSize: '14px !important' }} />}
              label="Outside Boundary"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24 }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'hours',
      label: 'Hours',
      minWidth: 80,
      render: (row: AttendanceRecord) => (
        <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
          {row.totalHoursWorked || 8} Hrs
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Attendance Status',
      sortable: true,
      minWidth: 130,
      render: (row: AttendanceRecord) => getStatusChip(row.status),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 90,
      render: (row: AttendanceRecord) => (
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDetails(row);
          }}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 1.5,
            py: 0.3,
            px: 1.5,
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
            Employee Attendance & HR Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Daily check-in and attendance tracking for field staff on venture sites and office personnel
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setPunchDialogOpen(true)}
          sx={{ px: 2, py: 0.75, fontWeight: 600, borderRadius: 2, fontSize: '0.85rem' }}
        >
          Record Attendance / Punch In
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Staff Present Today"
            value={metrics.totalPresent}
            subtitle="Checked In Today"
            icon={<VerifiedIcon />}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Field Staff on Site Duty"
            value={metrics.fieldStaffCount}
            subtitle="Active on Venture Sites"
            icon={<TerrainIcon />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Office Staff Present"
            value={metrics.officeStaffCount}
            subtitle="At Corporate / Branch Office"
            icon={<BusinessIcon />}
            color="#0891b2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="On Leave / Absent"
            value={metrics.onLeaveCount}
            subtitle="Approved Leave / Off-Duty"
            icon={<LocationOffIcon />}
            color="#d97706"
          />
        </Grid>
      </Grid>

      {/* Workspace Tabs & Filter Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Today's Attendance Ledger" />
          <Tab
            label={
              <Badge badgeContent={metrics.fieldStaffCount} color="primary" sx={{ pr: 1 }}>
                Field Staff (Site Duty)
              </Badge>
            }
          />
          <Tab label="Head Office & Telecallers" />
          <Tab label="Leave & Absences" />
        </Tabs>

        {/* Search Toolbar */}
        <Box sx={{ p: 2.5, pb: 1 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, maxWidth: { md: 450 } }}>
              <SearchBox
                placeholder="Search staff by name, role, or venture location..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </Box>

            <TextField
              select
              size="small"
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="PRESENT">Present</MenuItem>
              <MenuItem value="ON_FIELD_DUTY">On Field Duty</MenuItem>
              <MenuItem value="LATE">Late Check-in</MenuItem>
              <MenuItem value="HALF_DAY">Half Day</MenuItem>
              <MenuItem value="ON_LEAVE">On Leave</MenuItem>
            </TextField>
          </Stack>
        </Box>

        {/* Attendance DataTable */}
        <Box sx={{ p: 2.5, pt: 1 }}>
          <DataTable
            {...({
              columns,
              data: filteredRecords,
              loading,
              onRowClick: (row: AttendanceRecord) => handleOpenDetails(row),
            } as any)}
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <PunchInOutDialog
        open={punchDialogOpen}
        onClose={() => setPunchDialogOpen(false)}
        onAttendanceRecorded={handleAttendanceRecorded}
      />

      <AttendanceDetailsDialog
        record={selectedRecord}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        onPunchOut={handlePunchOut}
      />
    </Box>
  );
};

export default AttendanceWorkspace;
