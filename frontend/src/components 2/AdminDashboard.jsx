import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocationCity as StreetIcon,
  Home as PlotIcon,
  People as ResidentIcon,
  Payment as PaymentIcon,
  Assessment as ReportIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Get user data on component mount
  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      
      // Verify user is admin
      if (user.user_type !== 'admin') {
        console.log('User is not admin, redirecting...');
        navigate('/dashboard');
        return;
      }
    } else {
      // No user data found, redirect to login
      console.log('No user data found, redirecting to login...');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('userData');
    // Redirect to login
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Streets Management', icon: <StreetIcon />, value: 'streets' },
    { text: 'Plots & Flats', icon: <PlotIcon />, value: 'plots' },
    { text: 'Residents Management', icon: <ResidentIcon />, value: 'residents' },
    { text: 'Payments Management', icon: <PaymentIcon />, value: 'payments' },
    { text: 'Reports & Analytics', icon: <ReportIcon />, value: 'reports' },
  ];

  const renderMainContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Statistics Cards */}
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Residents
                  </Typography>
                  <Typography component="p" variant="h4">
                    150
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 'auto', opacity: 0.8 }}>
                    +12% from last month
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                  }}
                >
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Plots
                  </Typography>
                  <Typography component="p" variant="h4">
                    75
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 'auto', opacity: 0.8 }}>
                    100% Occupied
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                  }}
                >
                  <Typography component="h2" variant="h6" gutterBottom>
                    Pending Payments
                  </Typography>
                  <Typography component="p" variant="h4">
                    12
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 'auto', opacity: 0.8 }}>
                    ₹2,40,000 pending
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                  }}
                >
                  <Typography component="h2" variant="h6" gutterBottom>
                    Total Streets
                  </Typography>
                  <Typography component="p" variant="h4">
                    8
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 'auto', opacity: 0.8 }}>
                    All maintained
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Quick Actions */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={() => setSelectedMenu('residents')}
                      >
                        Add New Resident
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth
                        onClick={() => setSelectedMenu('payments')}
                      >
                        View Payments
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button 
                        variant="contained" 
                        color="success" 
                        fullWidth
                        onClick={() => setSelectedMenu('plots')}
                      >
                        Manage Plots
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button 
                        variant="contained" 
                        color="info" 
                        fullWidth
                        onClick={() => setSelectedMenu('reports')}
                      >
                        Generate Report
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Recent Activities */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activities
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PaymentIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Payment received from Plot A-101" 
                        secondary="₹5,000 - Maintenance fee - 2 hours ago"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <ResidentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="New resident registered" 
                        secondary="John Doe - Plot B-205 - 1 day ago"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <ReportIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Monthly report generated" 
                        secondary="Community maintenance report - 2 days ago"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Community Summary */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Community Summary
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Collection Rate
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      84% (₹4,20,000/₹5,00,000)
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Occupancy Rate
                    </Typography>
                    <Typography variant="h6" color="primary">
                      100% (75/75 plots)
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Pending Issues
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      3 Maintenance requests
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        );
      default:
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                {menuItems.find(item => item.value === selectedMenu)?.text}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                This section is under development. The {menuItems.find(item => item.value === selectedMenu)?.text.toLowerCase()} functionality will be available soon.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => setSelectedMenu('dashboard')}
              >
                Back to Dashboard
              </Button>
            </Paper>
          </Container>
        );
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          GCMS Admin
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Admin Profile Section */}
      {userData && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
            <ProfileIcon />
          </Avatar>
          <Typography variant="subtitle2" noWrap>
            {userData.display_name || 'Admin'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Administrator
          </Typography>
        </Box>
      )}
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={selectedMenu === item.value}
            onClick={() => setSelectedMenu(item.value)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: selectedMenu === item.value ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      {/* Logout Button */}
      <List>
        <ListItem button onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gated Community Management System
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;