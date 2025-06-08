import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const drawerWidth = 240;

const PageWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    background: {
                        default: darkMode ? '#1e293b' : '#f8fafc',
                    },
                },
            }),
        [darkMode]
    );

    const handleToggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    const menuItems = [
        { text: 'Streets Management', icon: <LocationCityIcon />, route: '/admin-dashboard/streets' },
        { text: 'Plots Management', icon: <HomeWorkIcon />, route: '/admin-dashboard/plots' },
        { text: 'Residents Management', icon: <PeopleIcon />, route: '/admin-dashboard/residents' },
        { text: 'Payments Management', icon: <PaymentIcon />, route: '/admin-dashboard/payments' },
        { text: 'Reports & Analytics', icon: <BarChartIcon />, route: '/admin-dashboard/reports' },
        { text: 'Logout', icon: <LogoutIcon />, action: 'logout' },
    ];

    const handleMenuClick = (item) => {
        if (item.action === 'logout') {
            sessionStorage.clear();
            navigate('/');
        } else if (item.route) {
            navigate(item.route);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', backgroundColor: theme.palette.background.default }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                        backgroundColor: darkMode ? '#1e293b' : '#3b82f6',
                        color: '#fff',
                    }}
                >
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" noWrap component="div">
                            Admin Dashboard
                        </Typography>
                        <IconButton color="inherit" onClick={handleToggleTheme}>
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#0f172a',
                            color: '#fff',
                        },
                    }}
                >
                    <Toolbar />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem button key={item.text} onClick={() => handleMenuClick(item)}>
                                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: theme.palette.background.default,
                        minHeight: '100vh',
                        marginLeft: `${drawerWidth}px`,
                        pt: 8,
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default PageWrapper;
