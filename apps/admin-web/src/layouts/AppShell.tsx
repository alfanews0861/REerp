import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Breadcrumbs,
  Link,
  Avatar,
  Badge,
  InputBase,
  Menu,
  MenuItem,
  useTheme,
  Collapse,
  Chip,
  Button,
  Tooltip,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import BusinessCenter from '@mui/icons-material/BusinessCenter';
import Map from '@mui/icons-material/Map';
import Campaign from '@mui/icons-material/Campaign';
import EventNote from '@mui/icons-material/EventNote';
import Payment from '@mui/icons-material/Payment';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import Receipt from '@mui/icons-material/Receipt';
import BarChart from '@mui/icons-material/BarChart';
import Assessment from '@mui/icons-material/Assessment';
import Settings from '@mui/icons-material/Settings';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@real-estate-erp/firebase';
import { UserRole, CADRE_DISPLAY_NAMES, CadreLevel } from '@real-estate-erp/types';
import { NotificationDropdown } from '../components/notifications/NotificationDropdown';
import { messagingService } from '../services/messagingService';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

interface NavChildItem {
  text: string;
  path: string;
  roles?: UserRole[];
}

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  externalUrl?: string;
  roles?: UserRole[];
  children?: NavChildItem[];
}

export const AppShell = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [pendingCounts, setPendingCounts] = useState<{ unreadMessages: number; unreadNotifications: number; total: number }>({
    unreadMessages: 0,
    unreadNotifications: 0,
    total: 0,
  });
  const theme = useTheme();
  const location = useLocation();

  const currentRole: UserRole = (user?.role as UserRole) || 'customer';
  const isSuperOrDirector = currentRole === 'super_admin' || currentRole === 'director';

  // Real-time unread messages & notification counter subscription
  React.useEffect(() => {
    const userId = user?.uid || 'usr-001';
    const updateCounts = () => {
      const counts = messagingService.getPendingCount(userId);
      setPendingCounts(counts);
    };

    updateCounts();
    const unsubC = messagingService.subscribeToConversations(userId, () => updateCounts());
    const unsubN = messagingService.subscribeToNotifications(userId, () => updateCounts());

    return () => {
      unsubC();
      unsubN();
    };
  }, [user]);

  // Automatically redirect new users to complete their profile registration
  React.useEffect(() => {
    if (user && user.isProfileCompleted === false && location.pathname !== '/register-profile') {
      navigate('/register-profile', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = async () => {
    handleClose();
    try {
      await signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/login', { replace: true });
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Role-mapped Navigation Items
  const allNavItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive', 'sales_manager', 'sales_executive', 'telecaller', 'accountant', 'driver', 'customer'],
      children: [
        { text: 'Executive Overview', path: '/dashboard' },
        { text: 'Command Center', path: '/dashboard/command-center', roles: ['super_admin', 'director', 'branch_manager'] },
      ],
    },
    {
      text: 'Communications',
      icon: <ChatIcon />,
      path: '/messages',
      roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive', 'sales_manager', 'sales_executive', 'telecaller', 'accountant', 'driver', 'customer'],
    },
    {
      text: 'CRM',
      icon: <People />,
      roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive', 'telecaller', 'marketing_manager'],
      children: [
        { text: 'Leads', path: '/crm/leads', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive', 'telecaller', 'marketing_manager'] },
        { text: 'Site Visits', path: '/crm/site-visits', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive'] },
        { text: 'Customer 360', path: '/crm/customers', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive', 'telecaller'] },
      ],
    },
    { text: 'Projects', icon: <BusinessCenter />, path: '/projects', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive'] },
    { text: 'Plots', icon: <Map />, path: '/plots', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive', 'customer'] },
    {
      text: 'Marketing',
      icon: <Campaign />,
      roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive', 'telecaller'],
      children: [
        { text: 'Campaigns', path: '/marketing/campaigns', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive'] },
        { text: 'Telecaller Queue', path: '/marketing/telecaller', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'telecaller'] },
        { text: 'Marketing Network', path: '/marketing/network', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager'] },
        { text: 'Commission Ledger', path: '/marketing/commission', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'accountant'] },
        { text: 'Commission Rules', path: '/marketing/commission/rules', roles: ['super_admin', 'director', 'marketing_manager'] },
      ],
    },
    { text: 'Bookings', icon: <EventNote />, path: '/bookings', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive', 'accountant', 'customer'] },
    { text: 'Payments', icon: <Payment />, path: '/payments', roles: ['super_admin', 'director', 'branch_manager', 'accountant', 'customer'] },
    {
      text: 'Employees',
      icon: <BadgeIcon />,
      roles: ['super_admin', 'director', 'branch_manager'],
      children: [
        { text: 'Attendance', path: '/employees/attendance' },
      ],
    },
    { text: 'Vehicles', icon: <DirectionsCar />, path: '/vehicles', roles: ['super_admin', 'director', 'branch_manager', 'driver'] },
    { text: 'Expenses', icon: <Receipt />, path: '/expenses', roles: ['super_admin', 'director', 'branch_manager', 'accountant'] },
    { text: 'Analytics', icon: <BarChart />, path: '/analytics', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'sales_manager'] },
    {
      text: 'Reports',
      icon: <Assessment />,
      roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive', 'sales_manager', 'sales_executive', 'telecaller', 'accountant', 'driver'],
      children: [
        { text: 'All Reports Overview', path: '/reports' },
        { text: 'Sales & Revenue', path: '/reports?category=Sales', roles: ['super_admin', 'director', 'branch_manager', 'sales_manager', 'sales_executive'] },
        { text: 'Marketing & Leads', path: '/reports?category=Marketing', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive'] },
        { text: 'Telecalling Performance', path: '/reports?category=Telecalling', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'telecaller'] },
        { text: 'Site Visits & Fleet', path: '/reports?category=Site+Visits', roles: ['super_admin', 'director', 'branch_manager', 'driver', 'sales_manager', 'sales_executive'] },
        { text: 'Finance & Commissions', path: '/reports?category=Finance+%26+Commissions', roles: ['super_admin', 'director', 'branch_manager', 'accountant'] },
      ],
    },
    { text: 'Settings', icon: <Settings />, path: '/settings', roles: ['super_admin', 'director'] },
    { text: 'Administration', icon: <AdminPanelSettings />, path: '/administration', roles: ['super_admin', 'director'] },
    {
      text: 'Public Website',
      icon: <TravelExploreIcon />,
      externalUrl: 'https://reerp-website.web.app',
      roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive', 'sales_manager', 'sales_executive', 'telecaller', 'accountant', 'driver', 'customer'],
    },
  ];

  // Filter items based on active user role
  const visibleNavItems = useMemo(() => {
    return allNavItems
      .filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(currentRole);
      })
      .map((item) => {
        if (!item.children) return item;
        const filteredChildren = item.children.filter((child) => {
          if (!child.roles) return true;
          return child.roles.includes(currentRole);
        });
        return {
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : undefined,
        };
      })
      .filter((item) => !item.children || item.children.length > 0);
  }, [currentRole]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleCollapseToggle = () => setIsCollapsed(!isCollapsed);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    Reports: true,
  });
  const handleSubMenuToggle = (text: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path.includes('?')) {
      return (location.pathname + location.search) === path;
    }
    return location.pathname === path && !location.search;
  };

  const renderNavItems = (items: any[]) => {
    return items.map((item) => {
      if (item.externalUrl) {
        return (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component="a"
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: isCollapsed ? 0 : 1 }} />
              {!isCollapsed && <OpenInNewIcon sx={{ fontSize: '0.85rem', color: 'text.secondary' }} />}
            </ListItemButton>
          </ListItem>
        );
      }

      const isItemActive = item.children
        ? item.children.some((c: any) => isPathActive(c.path))
        : isPathActive(item.path);

      return (
        <React.Fragment key={item.text}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={item.children ? 'div' : RouterLink}
              to={item.children ? undefined : item.path}
              onClick={() => (item.children ? handleSubMenuToggle(item.text) : undefined)}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                backgroundColor: isItemActive ? theme.palette.action.selected : 'transparent',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: 'center',
                  color: isItemActive ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: isCollapsed ? 0 : 1 }} />
              {!isCollapsed && item.children && (
                openSubMenus[item.text] ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>
          </ListItem>
          {!isCollapsed && item.children && (
            <Collapse in={openSubMenus[item.text]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child: any) => {
                  const isChildActive = isPathActive(child.path);
                  return (
                    <ListItemButton
                      key={child.text}
                      component={RouterLink}
                      to={child.path}
                      sx={{
                        pl: 4,
                        backgroundColor: isChildActive ? theme.palette.action.selected : 'transparent',
                        borderLeft: isChildActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                      }}
                    >
                      <ListItemText
                        primary={child.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: isChildActive ? 700 : 500,
                          color: isChildActive ? theme.palette.primary.main : 'inherit',
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const drawerContent = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', px: [1] }}>
        {!isCollapsed && <Typography variant="h6" noWrap component="div" sx={{ ml: 2, fontWeight: 700, color: theme.palette.primary.main }}>ISKON Developers</Typography>}
        <IconButton onClick={handleCollapseToggle} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {renderNavItems(visibleNavItems)}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          ml: { sm: `${isCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ display: { xs: 'none', lg: 'flex' }, minWidth: 160 }}>
            <Link underline="hover" color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Typography color="text.primary" fontWeight={700}>
              {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
            </Typography>
          </Breadcrumbs>

          {/* Global Search Bar (Spacious and prominent) */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              backgroundColor: '#f1f5f9',
              borderRadius: 2.5,
              px: 2,
              py: 0.75,
              flex: 1,
              maxWidth: 440,
              mx: { sm: 1, md: 3 },
              border: '1px solid #e2e8f0',
            }}
          >
            <SearchIcon sx={{ color: '#64748b', mr: 1.5, fontSize: '1.2rem' }} />
            <InputBase
              placeholder="Global Search (leads, plots, bookings, reports)..."
              inputProps={{ 'aria-label': 'global search' }}
              fullWidth
              sx={{ fontSize: '0.875rem' }}
            />
          </Box>

          {/* Right Header Actions & User Profile Card (All in ONE neat row!) */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 'auto' }}>
            {/* Notifications & Communications Bell */}
            <Tooltip title="Notifications & Messages">
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
                sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: 2 }}
              >
                <Badge badgeContent={pendingCounts.total} color="error">
                  <NotificationsIcon fontSize="small" sx={{ color: '#475569' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <NotificationDropdown
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
            />

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, alignSelf: 'center' }} />

            {/* Profile & Cadre Info Pill Card */}
            {user && (
              <Box
                onClick={handleMenu}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  p: '4px 10px 4px 6px',
                  borderRadius: 2.5,
                  cursor: 'pointer',
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 5px rgba(37,99,235,0.25)',
                  }}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                </Avatar>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                    {user.displayName || 'Staff User'}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.3 }}>
                    <Chip
                      label={user.cadre ? (CADRE_DISPLAY_NAMES[user.cadre as CadreLevel] || user.cadre).toUpperCase() : (user.role || 'ADMIN').replace('_', ' ').toUpperCase()}
                      size="small"
                      color={user.role === 'super_admin' || user.role === 'director' ? 'error' : user.role?.includes('manager') ? 'secondary' : 'primary'}
                      sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, borderRadius: 1 }}
                    />
                    {user.referralCode && (
                      <Chip
                        label={user.referralCode}
                        size="small"
                        variant="outlined"
                        color="info"
                        title="Your Reference Code"
                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, borderRadius: 1 }}
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
          </Stack>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/profile');
                }}
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                <ListItemIcon>
                  <BadgeIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                My Profile & ID Card
              </MenuItem>
              <MenuItem
                component="a"
                href="https://reerp-website.web.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
              >
                <ListItemIcon>
                  <TravelExploreIcon fontSize="small" />
                </ListItemIcon>
                View Public Website ↗
              </MenuItem>
              <Divider />
              {isSuperOrDirector && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/administration');
                  }}
                >
                  Staff Administration
                </MenuItem>
              )}
              {isSuperOrDirector && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/settings');
                  }}
                >
                  System Settings
                </MenuItem>
              )}
              {isSuperOrDirector && <Divider />}
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

      <Box component="nav" sx={{ width: { sm: isCollapsed ? collapsedDrawerWidth : drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 2.5 },
          width: { sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }} />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        
        {/* Footer */}
        <Box component="footer" sx={{ mt: 'auto', py: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            &copy; {new Date().getFullYear()} Enterprise Real Estate Marketing ERP. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
