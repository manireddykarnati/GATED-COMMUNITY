import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, CssBaseline, Drawer, List, ListItem, ListItemIcon,
    ListItemText, Box, IconButton, Switch, useTheme
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    Payments as PaymentsIcon,
    Assessment as AssessmentIcon,
    Menu as MenuIcon,
    LightMode, DarkMode
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const drawerWidth = 240;

const navItems = [
    { label: 'Manage Streets', icon: <HomeIcon />, path: 'streets' },
    { label: 'Manage Plots', icon: <DashboardIcon />, path: 'plots' },
    { label: 'Manage Residents', icon: <PeopleIcon />, path: 'residents' },
    { label: 'Manage Payments', icon: <PaymentsIcon />, path: 'payments' },
    { label: 'Reports & Analytics', icon: <AssessmentIcon />, path: 'reports' },
];

const AdminLayout = () => {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleThemeToggle = () => setDarkMode(!darkMode);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawer = (
        <Box sx={{ bgcolor: darkMode ? 'grey.900' : 'grey.100', height: '100%' }}>
            <Toolbar>
                <Typography variant="h6">GCMS Admin</Typography>
            </Toolbar>
            <List>
                {navItems.map(({ label, icon, path }) => (
                    <ListItem
                        button
                        key={label}
                        component={Link}
                        to={path}
                        selected={location.pathname.includes(path)}
                        sx={{
                            '&:hover': {
                                bgcolor: darkMode ? 'grey.800' : 'grey.200',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: darkMode ? 'grey.100' : '#fafafa' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: darkMode ? '#212121' : '#1976d2',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <IconButton onClick={handleThemeToggle} color="inherit">
                        {darkMode ? <DarkMode /> : <LightMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
                    },
                }}
                open
            >
                {drawer}
            </Drawer>

            {/* Page Content */}
            <Box
                component={motion.main}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: darkMode ? 'grey.900' : 'white'
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;
