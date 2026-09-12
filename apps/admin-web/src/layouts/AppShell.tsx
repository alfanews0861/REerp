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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
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
import Settings from '@mui/icons-material/Settings';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '@real-estate-erp/ui';
import { useAuthContext } from '@real-estate-erp/firebase';
import { UserRole } from '@real-estate-erp/types';

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
  roles?: UserRole[];
  children?: NavChildItem[];
}

export const AppShell = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const location = useLocation();

  const currentRole: UserRole = (user?.role as UserRole) || 'customer';
  const isSuperOrDirector = currentRole === 'super_admin' || currentRole === 'director';

  const handleLogout = async () => {
    handleClose();
    try {
      await signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/login', { replace: true });
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
    { text: 'Reports', icon: <BarChart />, path: '/reports', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'sales_manager', 'accountant'] },
    { text: 'Analytics', icon: <BarChart />, path: '/analytics', roles: ['super_admin', 'director', 'branch_manager', 'marketing_manager', 'sales_manager'] },
    { text: 'Settings', icon: <Settings />, path: '/settings', roles: ['super_admin', 'director'] },
    { text: 'Administration', icon: <AdminPanelSettings />, path: '/administration', roles: ['super_admin', 'director'] },
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
  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'corporate' : 'light');

  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const handleSubMenuToggle = (text: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const renderNavItems = (items: any[]) => {
    return items.map((item) => (
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
              backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 3,
                justifyContent: 'center',
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
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
              {item.children.map((child: any) => (
                <ListItemButton
                  key={child.text}
                  component={RouterLink}
                  to={child.path}
                  sx={{ pl: 4, backgroundColor: location.pathname === child.path ? theme.palette.action.selected : 'transparent' }}
                >
                  <ListItemText primary={child.text} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  const drawerContent = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', px: [1] }}>
        {!isCollapsed && <Typography variant="h6" noWrap component="div" sx={{ ml: 2, fontWeight: 700, color: theme.palette.primary.main }}>ERP Admin</Typography>}
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
          <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link underline="hover" color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Typography color="text.primary">
              {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
            </Typography>
          </Breadcrumbs>

          {/* Global Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.action.hover, borderRadius: 2, px: 2, py: 0.5, mr: 2, width: { xs: '100%', sm: 'auto' } }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase placeholder="Global Search…" inputProps={{ 'aria-label': 'search' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Direct Link to Public Customer Website */}
            <Tooltip title="Open Public Customer & Investor Website in a new tab">
              <Button
                component="a"
                href="https://reerp-website.web.app"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                startIcon={<TravelExploreIcon sx={{ fontSize: '1.05rem !important', color: 'primary.main' }} />}
                endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  mr: 1.5,
                  whiteSpace: 'nowrap',
                  display: { xs: 'none', md: 'inline-flex' },
                  borderColor: theme.palette.divider,
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Public Website
              </Button>
            </Tooltip>

            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {user && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end', mr: 1.5 }}>
                <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                  {user.displayName || 'Staff User'}
                </Typography>
                <Chip
                  label={(user.role || 'ADMIN').replace('_', ' ').toUpperCase()}
                  size="small"
                  color={user.role === 'super_admin' || user.role === 'director' ? 'error' : user.role?.includes('manager') ? 'secondary' : 'primary'}
                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, mt: 0.3 }}
                />
              </Box>
            )}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: theme.palette.primary.main, fontSize: '0.9rem', fontWeight: 600 }}>
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
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
          </Box>
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
          p: 3,
          width: { sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        
        {/* Footer */}
        <Box component="footer" sx={{ mt: 'auto', py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Enterprise Admin. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
