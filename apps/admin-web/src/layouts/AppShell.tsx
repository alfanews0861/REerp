import React, { useState } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';

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
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { useThemeMode } from '@real-estate-erp/ui';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

export const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const location = useLocation();

  // Navigation Items
  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    {
      text: 'CRM',
      icon: <People />,
      children: [
        { text: 'Leads', path: '/crm/leads' },
        { text: 'Customers', path: '/crm/customers' },
      ],
    },
    { text: 'Projects', icon: <BusinessCenter />, path: '/projects' },
    { text: 'Plots', icon: <Map />, path: '/plots' },
    {
      text: 'Marketing',
      icon: <Campaign />,
      children: [
        { text: 'Campaigns', path: '/marketing/campaigns' },
        { text: 'Site Visits', path: '/marketing/site-visits' },
      ],
    },
    { text: 'Bookings', icon: <EventNote />, path: '/bookings' },
    { text: 'Payments', icon: <Payment />, path: '/payments' },
    {
      text: 'Employees',
      icon: <BadgeIcon />,
      children: [
        { text: 'Attendance', path: '/employees/attendance' },
      ],
    },
    { text: 'Vehicles', icon: <DirectionsCar />, path: '/vehicles' },
    { text: 'Expenses', icon: <Receipt />, path: '/expenses' },
    { text: 'Reports', icon: <BarChart />, path: '/reports' },
    { text: 'Analytics', icon: <BarChart />, path: '/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Administration', icon: <AdminPanelSettings />, path: '/administration' },
  ];

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
            component={item.path ? RouterLink : 'div'}
            to={item.path}
            onClick={() => item.children ? handleSubMenuToggle(item.text) : null}
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
        {renderNavItems(navItems)}
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
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>A</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
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
