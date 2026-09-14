import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Avatar,
  Alert,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockResetIcon from '@mui/icons-material/LockReset';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import GroupIcon from '@mui/icons-material/Group';
import { DataTable, StatusChip, SearchBox } from '@real-estate-erp/ui';
import { UserProfile, UserRole, UserStatus } from '@real-estate-erp/types';
import { getFirebaseInstance, signUpWithEmail, sendPasswordResetEmail } from '@real-estate-erp/firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export interface ExtendedStaffUser extends UserProfile {
  department?: string;
  reportingManager?: string;
  lastActive?: string;
}

export const DEFAULT_STAFF_USERS: ExtendedStaffUser[] = [
  {
    id: 'usr-000',
    uid: 'usr-000',
    email: 'superadmin@reerp.com',
    displayName: 'Satyadev Varma (Super Admin)',
    role: 'super_admin',
    status: 'active',
    phoneNumber: '+91 98480 00001',
    department: 'IT & System Governance',
    reportingManager: 'Board of Directors',
    permissions: ['*:*'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    lastActive: 'Just now',
  },
  {
    id: 'usr-001',
    uid: 'usr-001',
    email: 'admin@reerp.com',
    displayName: 'Rajesh Kumar (Managing Director)',
    role: 'director',
    status: 'active',
    phoneNumber: '+91 98480 11223',
    department: 'Executive Management',
    reportingManager: 'Board of Directors',
    permissions: ['*:*'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-01T15:30:00Z',
    lastActive: 'Just now',
  },
  {
    id: 'usr-001b',
    uid: 'usr-001b',
    email: 'director.ops@reerp.com',
    displayName: 'K. Raghava Rao (Executive Director)',
    role: 'director',
    status: 'active',
    phoneNumber: '+91 98480 11224',
    department: 'Operations & Strategy',
    reportingManager: 'Rajesh Kumar',
    permissions: ['*:*'],
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-03-01T16:00:00Z',
    lastActive: '15 mins ago',
  },
  {
    id: 'usr-bm1',
    uid: 'usr-bm1',
    email: 'bm.minibypass@iskondevelopers.com',
    displayName: 'Srinivas Murthy (Branch Head - Mini Bypass Hub)',
    role: 'branch_manager',
    status: 'active',
    phoneNumber: '+91 98480 99881',
    department: 'Mini Bypass Branch Operations',
    reportingManager: 'Rajesh Kumar',
    permissions: ['branch:*', 'lead:*', 'plot:*', 'booking:*', 'expenses:approve'],
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
    lastActive: '10 mins ago',
  },
  {
    id: 'usr-bm2',
    uid: 'usr-bm2',
    email: 'bm.central@iskondevelopers.com',
    displayName: 'Kavitha Reddy (Branch Head - Annamayya Circle)',
    role: 'branch_manager',
    status: 'active',
    phoneNumber: '+91 98480 99882',
    department: 'Central Branch Operations',
    reportingManager: 'Rajesh Kumar',
    permissions: ['branch:*', 'lead:*', 'plot:*', 'booking:*', 'expenses:approve'],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
    lastActive: '25 mins ago',
  },
  {
    id: 'usr-002',
    uid: 'usr-002',
    email: 'sales.mgr@reerp.com',
    displayName: 'Priya Sharma (Zonal Sales Head)',
    role: 'sales_manager',
    status: 'active',
    phoneNumber: '+91 98480 22334',
    department: 'Sales & Closures',
    reportingManager: 'Rajesh Kumar',
    permissions: ['lead:*', 'plot:*', 'booking:*', 'customer:*', 'reports:read'],
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-03-02T10:15:00Z',
    lastActive: '12 mins ago',
  },
  {
    id: 'usr-sm2',
    uid: 'usr-sm2',
    email: 'praveen.teja@reerp.com',
    displayName: 'Praveen Teja (Senior Sales Manager - Nellore)',
    role: 'sales_manager',
    status: 'active',
    phoneNumber: '+91 98480 22335',
    department: 'Venture Sales Desk',
    reportingManager: 'Priya Sharma',
    permissions: ['lead:*', 'plot:*', 'booking:*', 'customer:*'],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-03-04T14:00:00Z',
    lastActive: '1 hour ago',
  },
  {
    id: 'usr-003',
    uid: 'usr-003',
    email: 'marketing.mgr@reerp.com',
    displayName: 'Vikram Varma (Head of Marketing)',
    role: 'marketing_manager',
    status: 'active',
    phoneNumber: '+91 98480 33445',
    department: 'Marketing & Digital',
    reportingManager: 'Rajesh Kumar',
    permissions: ['campaign:*', 'lead:*', 'reports:read', 'ai:*'],
    createdAt: '2026-01-20T09:30:00Z',
    updatedAt: '2026-02-28T14:20:00Z',
    lastActive: '1 hour ago',
  },
  {
    id: 'usr-006',
    uid: 'usr-006',
    email: 'anand.naidu@reerp.com',
    displayName: 'Anand Naidu',
    role: 'sales_executive',
    status: 'active',
    phoneNumber: '+91 98480 66778',
    department: 'Field Sales & Client Visits',
    reportingManager: 'Priya Sharma',
    permissions: ['lead:read', 'lead:update', 'plot:read', 'booking:create', 'customer:read'],
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-04T12:30:00Z',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-se2',
    uid: 'usr-se2',
    email: 'vamshi.krishna@reerp.com',
    displayName: 'Vamshi Krishna',
    role: 'sales_executive',
    status: 'active',
    phoneNumber: '+91 98480 66779',
    department: 'Field Sales & Client Visits',
    reportingManager: 'Priya Sharma',
    permissions: ['lead:read', 'lead:update', 'plot:read', 'booking:create', 'customer:read'],
    createdAt: '2026-02-11T10:00:00Z',
    updatedAt: '2026-03-05T09:30:00Z',
    lastActive: '30 mins ago',
  },
  {
    id: 'usr-se3',
    uid: 'usr-se3',
    email: 'sneha.latha@reerp.com',
    displayName: 'Sneha Latha (Relationship Manager)',
    role: 'sales_executive',
    status: 'active',
    phoneNumber: '+91 98480 66780',
    department: 'HNI & Investor Sales',
    reportingManager: 'Priya Sharma',
    permissions: ['lead:read', 'lead:update', 'plot:read', 'booking:create', 'customer:read'],
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-03-05T14:15:00Z',
    lastActive: '45 mins ago',
  },
  {
    id: 'usr-007',
    uid: 'usr-007',
    email: 'mahesh.babu@reerp.com',
    displayName: 'Mahesh Babu M',
    role: 'marketing_executive',
    status: 'active',
    phoneNumber: '+91 98480 77889',
    department: 'Ground Marketing & Canvassing',
    reportingManager: 'Vikram Varma',
    permissions: ['campaign:read', 'lead:create', 'lead:read'],
    createdAt: '2026-02-12T14:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    lastActive: '3 hours ago',
  },
  {
    id: 'usr-me2',
    uid: 'usr-me2',
    email: 'divya.sree@reerp.com',
    displayName: 'Divya Sree (Events & Offline Promotions)',
    role: 'marketing_executive',
    status: 'active',
    phoneNumber: '+91 98480 77890',
    department: 'Marketing & Digital',
    reportingManager: 'Vikram Varma',
    permissions: ['campaign:read', 'lead:create', 'lead:read'],
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-04T16:00:00Z',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-004',
    uid: 'usr-004',
    email: 'telecaller1@reerp.com',
    displayName: 'Sunita Reddy (Calling Team Lead)',
    role: 'telecaller',
    status: 'active',
    phoneNumber: '+91 98480 44556',
    department: 'Inbound Calling Center',
    reportingManager: 'Vikram Varma',
    permissions: ['lead:read', 'lead:update', 'followup:create', 'customer:read'],
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-03T18:00:00Z',
    lastActive: '5 mins ago',
  },
  {
    id: 'usr-005',
    uid: 'usr-005',
    email: 'telecaller2@reerp.com',
    displayName: 'Kiran Rao (Digital Lead Specialist)',
    role: 'telecaller',
    status: 'active',
    phoneNumber: '+91 98480 55667',
    department: 'Outbound Campaigns',
    reportingManager: 'Vikram Varma',
    permissions: ['lead:read', 'lead:update', 'followup:create', 'customer:read'],
    createdAt: '2026-02-05T08:30:00Z',
    updatedAt: '2026-03-03T16:45:00Z',
    lastActive: '45 mins ago',
  },
  {
    id: 'usr-tc3',
    uid: 'usr-tc3',
    email: 'meena.kumari@reerp.com',
    displayName: 'Meena Kumari (NRI Support Desk)',
    role: 'telecaller',
    status: 'active',
    phoneNumber: '+91 98480 55668',
    department: 'Inbound Calling Center',
    reportingManager: 'Sunita Reddy',
    permissions: ['lead:read', 'lead:update', 'followup:create', 'customer:read'],
    createdAt: '2026-02-08T09:00:00Z',
    updatedAt: '2026-03-05T15:00:00Z',
    lastActive: '10 mins ago',
  },
  {
    id: 'usr-acc1',
    uid: 'usr-acc1',
    email: 'accounts.head@reerp.com',
    displayName: 'Lakshmi Narayana (Chief Accountant)',
    role: 'accountant',
    status: 'active',
    phoneNumber: '+91 98480 88991',
    department: 'Finance & Accounts',
    reportingManager: 'Rajesh Kumar',
    permissions: ['payments:*', 'expenses:*', 'reports:read'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-05T13:00:00Z',
    lastActive: '20 mins ago',
  },
  {
    id: 'usr-acc2',
    uid: 'usr-acc2',
    email: 'radha.krishna@reerp.com',
    displayName: 'Radha Krishna (Taxation & Auditing)',
    role: 'accountant',
    status: 'active',
    phoneNumber: '+91 98480 88992',
    department: 'Finance & Accounts',
    reportingManager: 'Lakshmi Narayana',
    permissions: ['payments:read', 'expenses:read', 'expenses:approve'],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-04T17:00:00Z',
    lastActive: '1 hour ago',
  },
  {
    id: 'usr-drv1',
    uid: 'usr-drv1',
    email: 'driver.ramesh@iskondevelopers.com',
    displayName: 'Ramesh Goud (Innova Crysta - AP 26 UB 1001)',
    role: 'driver',
    status: 'active',
    phoneNumber: '+91 98490 11223',
    department: 'Fleet & Logistics',
    reportingManager: 'Srinivas Murthy',
    permissions: ['vehicle:read', 'trip:create'],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z',
    lastActive: '10 mins ago',
  },
  {
    id: 'usr-drv2',
    uid: 'usr-drv2',
    email: 'driver.suresh@iskondevelopers.com',
    displayName: 'Suresh Kumar (Tempo Traveller - AP 26 EX 4050)',
    role: 'driver',
    status: 'active',
    phoneNumber: '+91 94412 33445',
    department: 'Fleet & Logistics',
    reportingManager: 'Srinivas Murthy',
    permissions: ['vehicle:read', 'trip:create'],
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-03-05T10:30:00Z',
    lastActive: 'On Field Duty',
  },
  {
    id: 'usr-drv3',
    uid: 'usr-drv3',
    email: 'driver.venu@iskondevelopers.com',
    displayName: 'Venu Madhav (Ertiga - AP 26 HK 2020)',
    role: 'driver',
    status: 'active',
    phoneNumber: '+91 91234 56780',
    department: 'Fleet & Logistics',
    reportingManager: 'Srinivas Murthy',
    permissions: ['vehicle:read', 'trip:create'],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-03-04T18:00:00Z',
    lastActive: 'Yesterday',
  },
  {
    id: 'usr-drv4',
    uid: 'usr-drv4',
    email: 'driver.prakash@iskondevelopers.com',
    displayName: 'Prakash Rao (Scorpio-N - AP 26 Z 8899)',
    role: 'driver',
    status: 'active',
    phoneNumber: '+91 99887 76655',
    department: 'Fleet & Logistics',
    reportingManager: 'Srinivas Murthy',
    permissions: ['vehicle:read', 'trip:create'],
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
    lastActive: 'On Field Duty',
  },
];

type RoleCategory = 'all' | 'admin' | 'manager' | 'telecaller' | 'field_agent';

export const UserManagementWorkspace: React.FC = () => {
  const [users, setUsers] = useState<ExtendedStaffUser[]>(DEFAULT_STAFF_USERS);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<RoleCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerNotice, setBannerNotice] = useState<{
    text: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  // Modals state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedStaffUser | null>(null);

  // New user form state
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('Pass@2026');
  const [newRole, setNewRole] = useState<UserRole>('telecaller');
  const [newDepartment, setNewDepartment] = useState('Operations');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit user role state
  const [editRole, setEditRole] = useState<UserRole>('telecaller');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // Subscribe to live users from Firestore
  useEffect(() => {
    try {
      const { db } = getFirebaseInstance();
      const usersCol = collection(db, 'users');
      const unsubscribe = onSnapshot(usersCol, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedUsers: ExtendedStaffUser[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              uid: data.uid || d.id,
              email: data.email || '',
              displayName: data.displayName || 'Staff User',
              role: data.role || 'customer',
              status: data.status || 'active',
              phoneNumber: data.phoneNumber || '',
              department: data.department || 'Operations',
              reportingManager: data.reportingManager || 'Admin',
              permissions: data.permissions || [],
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
              lastActive: 'Active recently',
            };
          });
          // Merge with default staff if few
          if (fetchedUsers.length > 0) {
            setUsers(fetchedUsers);
          }
        }
      }, () => {
        // Fallback silently to default demo staff
      });

      return () => unsubscribe();
    } catch {
      // Offline / bootstrap mode
    }
  }, []);

  const getRoleCategory = (role: UserRole): RoleCategory => {
    if (role === 'super_admin' || role === 'director') return 'admin';
    if (role === 'branch_manager' || role === 'sales_manager' || role === 'marketing_manager') return 'manager';
    if (role === 'telecaller') return 'telecaller';
    if (role === 'sales_executive' || role === 'marketing_executive' || role === 'driver') return 'field_agent';
    return 'all';
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role filter
      if (selectedRoleCategory !== 'all' && getRoleCategory(user.role) !== selectedRoleCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && user.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          user.displayName.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          (user.phoneNumber && user.phoneNumber.toLowerCase().includes(q)) ||
          user.role.toLowerCase().includes(q) ||
          (user.department && user.department.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [users, selectedRoleCategory, selectedStatus, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => getRoleCategory(u.role) === 'admin').length;
    const managers = users.filter((u) => getRoleCategory(u.role) === 'manager').length;
    const telecallers = users.filter((u) => u.role === 'telecaller').length;
    const fieldAgents = users.filter((u) => getRoleCategory(u.role) === 'field_agent').length;
    return { total, admins, managers, telecallers, fieldAgents };
  }, [users]);

  // Handlers
  const handleOpenCreate = () => {
    setNewDisplayName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('Pass@2026');
    setNewRole('telecaller');
    setNewDepartment('Customer Support');
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!newDisplayName || !newEmail || !newPassword) {
      setCreateError('Please complete all required fields.');
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      await signUpWithEmail(newEmail.trim(), newPassword, newDisplayName.trim(), newRole);
      setBannerNotice({
        text: `Staff profile created successfully for ${newDisplayName} (${newRole}).`,
        severity: 'success',
      });
      setCreateDialogOpen(false);
    } catch (err: unknown) {
      // In case Firebase throws or offline demo
      const errorMsg = err instanceof Error ? err.message : 'User creation failed';
      // Add to local state for seamless workflow
      const newStaff: ExtendedStaffUser = {
        id: `usr-${Date.now()}`,
        uid: `usr-${Date.now()}`,
        email: newEmail.trim(),
        displayName: newDisplayName.trim(),
        phoneNumber: newPhone,
        role: newRole,
        status: 'active',
        department: newDepartment,
        reportingManager: 'Admin',
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: 'Just registered',
      };
      setUsers((prev) => [newStaff, ...prev]);
      setBannerNotice({
        text: `Staff member ${newDisplayName} registered with role ${newRole} (saved locally). Notice: ${errorMsg}`,
        severity: 'warning',
      });
      setCreateDialogOpen(false);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEditRole = (user: ExtendedStaffUser) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditPermissions(user.permissions || []);
    setEditRoleDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    setEditLoading(true);

    try {
      const { db } = getFirebaseInstance();
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, {
        role: editRole,
        permissions: editPermissions,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Local state update fallback
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.uid === selectedUser.uid ? { ...u, role: editRole, permissions: editPermissions } : u
      )
    );
    setBannerNotice({
      text: `Updated ${selectedUser.displayName}'s role to ${editRole}.`,
      severity: 'success',
    });
    setEditLoading(false);
    setEditRoleDialogOpen(false);
  };

  const handleToggleStatus = async (user: ExtendedStaffUser) => {
    const nextStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const { db } = getFirebaseInstance();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Local state fallback
    }

    setUsers((prev) =>
      prev.map((u) => (u.uid === user.uid ? { ...u, status: nextStatus } : u))
    );
    setBannerNotice({
      text: `Account status for ${user.displayName} updated to ${nextStatus.toUpperCase()}.`,
      severity: 'info',
    });
  };

  const handleSendReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(email);
      setBannerNotice({
        text: `Password reset link successfully dispatched to ${email}.`,
        severity: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset link dispatch error';
      setBannerNotice({
        text: `Notice for ${email}: ${msg}`,
        severity: 'error',
      });
    }
  };

  const getRoleChip = (role: UserRole) => {
    const category = getRoleCategory(role);
    switch (category) {
      case 'admin':
        return <Chip label="Admin" color="error" size="small" icon={<AdminPanelSettingsIcon />} sx={{ fontWeight: 600 }} />;
      case 'manager':
        return <Chip label="Manager" color="secondary" size="small" icon={<SupervisorAccountIcon />} sx={{ fontWeight: 600 }} />;
      case 'telecaller':
        return <Chip label="Telecaller" color="info" size="small" icon={<HeadsetMicIcon />} sx={{ fontWeight: 600 }} />;
      case 'field_agent':
        return <Chip label="Field Agent" color="success" size="small" icon={<DirectionsRunIcon />} sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={role} size="small" />;
    }
  };

  const columns = [
    {
      id: 'displayName',
      label: 'Staff Member',
      minWidth: 220,
      format: (_: unknown, row?: ExtendedStaffUser) => {
        if (!row) return null;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 600 }}>
              {row.displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {row.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'role',
      label: 'Role & Tier',
      minWidth: 150,
      format: (val: unknown) => getRoleChip(val as UserRole),
    },
    {
      id: 'department',
      label: 'Department & Phone',
      minWidth: 180,
      format: (_: unknown, row?: ExtendedStaffUser) => {
        if (!row) return null;
        return (
          <Box>
            <Typography variant="body2" color="text.primary">
              {row.department || 'Operations'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.phoneNumber || 'No phone'}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (val: unknown) => {
        const s = String(val).toLowerCase();
        const validStatus: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' =
          s === 'active' ? 'active' : s === 'suspended' ? 'cancelled' : 'inactive';
        return <StatusChip status={validStatus} label={s.toUpperCase()} />;
      },
    },
    {
      id: 'lastActive',
      label: 'Activity',
      minWidth: 130,
      format: (val: unknown) => (
        <Typography variant="caption" color="text.secondary">
          {String(val || 'Active')}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      align: 'right' as const,
      format: (_: unknown, row?: ExtendedStaffUser) => {
        if (!row) return null;
        return (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Tooltip title="Edit Role & Permissions">
              <IconButton size="small" color="primary" onClick={() => handleOpenEditRole(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={row.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}>
              <IconButton
                size="small"
                color={row.status === 'active' ? 'warning' : 'success'}
                onClick={() => handleToggleStatus(row)}
              >
                {row.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Password Reset Email">
              <IconButton size="small" color="info" onClick={() => handleSendReset(row.email)}>
                <LockResetIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
            Staff & User Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage employee access, configure RBAC roles (Admin, Manager, Telecaller, Field Agent) & security.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 600, textTransform: 'none', px: 2, py: 0.75, borderRadius: 2, fontSize: '0.85rem' }}
          >
            Add Staff Member
          </Button>
        </Box>
      </Box>

      {bannerNotice && (
        <Alert severity={bannerNotice.severity} sx={{ mb: 1 }} onClose={() => setBannerNotice(null)}>
          {bannerNotice.text}
        </Alert>
      )}

      {/* KPI Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 48, height: 48 }}>
                <GroupIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Total Staff
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Avatar sx={{ bgcolor: '#ffebee', color: '#c62828', width: 48, height: 48 }}>
                <AdminPanelSettingsIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Admins
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.admins}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Avatar sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a', width: 48, height: 48 }}>
                <SupervisorAccountIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Managers
                </Typography>
                <Typography variant="h5" fontWeight={700} color="secondary.main">
                  {stats.managers}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Avatar sx={{ bgcolor: '#e1f5fe', color: '#0277bd', width: 48, height: 48 }}>
                <HeadsetMicIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Telecallers
                </Typography>
                <Typography variant="h5" fontWeight={700} color="info.main">
                  {stats.telecallers}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 48, height: 48 }}>
                <DirectionsRunIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Field Agents
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.fieldAgents}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Role Tabs & Filters */}
      <Card elevation={1} sx={{ borderRadius: 2, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Tabs
            value={selectedRoleCategory}
            onChange={(_, val) => setSelectedRoleCategory(val)}
            indicatorColor="primary"
            textColor="primary"
            sx={{ minHeight: 48 }}
          >
            <Tab label={`All Roles (${stats.total})`} value="all" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={`Admins (${stats.admins})`} value="admin" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={`Managers (${stats.managers})`} value="manager" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={`Telecallers (${stats.telecallers})`} value="telecaller" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={`Field Agents (${stats.fieldAgents})`} value="field_agent" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>

          <Stack direction="row" spacing={2} sx={{ pb: 1 }} alignItems="center">
            <TextField
              select
              size="small"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <SearchBox
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff, email, role…"
            />
          </Stack>
        </Box>

        {/* Data Table */}
        <Box sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredUsers}
            keyField="id"
            rowsPerPage={20}
            rowsPerPageOptions={[10, 20, 50, 100]}
            emptyMessage="No staff members match the selected filters."
          />
        </Box>
      </Card>

      {/* Create New Staff Member Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Staff Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Register an employee account with direct Firebase Authentication and assigned role.
          </Typography>

          {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="e.g. Ramesh Reddy"
            />
            <TextField
              label="Corporate Email Address"
              type="email"
              required
              fullWidth
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. ramesh.r@reerp.com"
            />
            <TextField
              label="Mobile Number"
              fullWidth
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+91 98480 99887"
            />
            <TextField
              label="Temporary Password"
              type="password"
              required
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Must contain uppercase, lowercase, number & special character"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Role Category"
                  fullWidth
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                >
                  <MenuItem value="director">Admin (Director)</MenuItem>
                  <MenuItem value="super_admin">Admin (Super Admin)</MenuItem>
                  <MenuItem value="sales_manager">Manager (Sales)</MenuItem>
                  <MenuItem value="marketing_manager">Manager (Marketing)</MenuItem>
                  <MenuItem value="branch_manager">Manager (Branch)</MenuItem>
                  <MenuItem value="telecaller">Telecaller (Queue)</MenuItem>
                  <MenuItem value="sales_executive">Field Agent (Sales)</MenuItem>
                  <MenuItem value="marketing_executive">Field Agent (Marketing)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Department"
                  fullWidth
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateDialogOpen(false)} color="inherit" disabled={createLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary" disabled={createLoading}>
            {createLoading ? 'Creating…' : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role & Permissions Dialog */}
      <Dialog open={editRoleDialogOpen} onClose={() => setEditRoleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Role & Permissions</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                  {selectedUser.displayName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedUser.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>

              <TextField
                select
                label="Assigned System Role"
                fullWidth
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as UserRole)}
                sx={{ mb: 3 }}
              >
                <MenuItem value="director">Admin (Director - Full Access)</MenuItem>
                <MenuItem value="super_admin">Admin (Super Admin)</MenuItem>
                <MenuItem value="sales_manager">Manager (Sales Team Leader)</MenuItem>
                <MenuItem value="marketing_manager">Manager (Marketing Team Leader)</MenuItem>
                <MenuItem value="branch_manager">Manager (Branch Executive)</MenuItem>
                <MenuItem value="telecaller">Telecaller (CRM Queue & Follow-ups)</MenuItem>
                <MenuItem value="sales_executive">Field Agent (Direct Sales & Visits)</MenuItem>
                <MenuItem value="marketing_executive">Field Agent (Campaign Executive)</MenuItem>
              </TextField>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Custom Permission Overrides:
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editPermissions.includes('booking:approve')}
                      onChange={(e) => {
                        setEditPermissions((prev) =>
                          e.target.checked ? [...prev, 'booking:approve'] : prev.filter((p) => p !== 'booking:approve')
                        );
                      }}
                    />
                  }
                  label="Approve Plot Bookings & Reservations"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editPermissions.includes('payments:approve')}
                      onChange={(e) => {
                        setEditPermissions((prev) =>
                          e.target.checked ? [...prev, 'payments:approve'] : prev.filter((p) => p !== 'payments:approve')
                        );
                      }}
                    />
                  }
                  label="Approve Payment Collections & Receipts"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editPermissions.includes('reports:export')}
                      onChange={(e) => {
                        setEditPermissions((prev) =>
                          e.target.checked ? [...prev, 'reports:export'] : prev.filter((p) => p !== 'reports:export')
                        );
                      }}
                    />
                  }
                  label="Export Financial & Sales Reports (Excel/CSV)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editPermissions.includes('lead:delete')}
                      onChange={(e) => {
                        setEditPermissions((prev) =>
                          e.target.checked ? [...prev, 'lead:delete'] : prev.filter((p) => p !== 'lead:delete')
                        );
                      }}
                    />
                  }
                  label="Delete or Merge Lead Records"
                />
              </FormGroup>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEditRoleDialogOpen(false)} color="inherit" disabled={editLoading}>
            Cancel
          </Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary" disabled={editLoading}>
            {editLoading ? 'Saving…' : 'Save Role & Permissions'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementWorkspace;
