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
  Card,
  CardContent,
  CircularProgress,
  Alert,
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
  TrendingUp,
  MonetizationOn,
  Group,
  Business,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import management components
import StreetsManagement from './StreetsManagement';
import PlotsManagement from './PlotsManagement';
import ResidentsManagement from './ResidentsManagement';
import PaymentsManagement from './PaymentsManagement';

const drawerWidth = 240;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get user data on component mount and fetch dashboard stats
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

      // Fetch dashboard statistics
      fetchDashboardStats(user.org_id);
    } else {
      // No user data found, redirect to login
      console.log('No user data found, redirecting to login...');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const fetchDashboardStats = async (orgId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard-stats/${orgId}`);
      if (response.data.success) {
        setDashboardStats(response.data.data);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderMainContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        if (loading) {
          return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading dashboard...
              </Typography>
            </Container>
          );
        }

        if (error) {
          return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button variant="contained" onClick={() => fetchDashboardStats(userData?.org_id)}>
                Retry
              </Button>
            </Container>
          );
        }

        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Statistics Cards */}
              <Grid item xs={12} md={3}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    height: 140,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Group sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Residents</Typography>
                    </Box>
                    <Typography variant="h3" component="div">
                      {dashboardStats?.totalResidents || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Active community members
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    height: 140,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Business sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Plots</Typography>
                    </Box>
                    <Typography variant="h3" component="div">
                      {dashboardStats?.totalPlots || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Properties managed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    height: 140,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <MonetizationOn sx={{ mr: 1 }} />
                      <Typography variant="h6">Pending Payments</Typography>
                    </Box>
                    <Typography variant="h3" component="div">
                      {dashboardStats?.pendingPayments?.count || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {formatCurrency(dashboardStats?.pendingPayments?.amount || 0)} pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    height: 140,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TrendingUp sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Streets</Typography>
                    </Box>
                    <Typography variant="h3" component="div">
                      {dashboardStats?.totalStreets || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Well organized areas
                    </Typography>
                  </CardContent>
                </Card>
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
                        sx={{ py: 1.5 }}
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
                        sx={{ py: 1.5 }}
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
                        sx={{ py: 1.5 }}
                      >
                        Manage Plots
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button 
                        variant="contained" 
                        color="info" 
                        fullWidth
                        onClick={() => setSelectedMenu('streets')}
                        sx={{ py: 1.5 }}
                      >
                        Manage Streets
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
                  {dashboardStats?.recentActivities?.length > 0 ? (
                    <List>
                      {dashboardStats.recentActivities.map((activity, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              {activity.activity_type === 'payment' ? (
                                <PaymentIcon color="success" />
                              ) : activity.activity_type === 'resident' ? (
                                <ResidentIcon color="primary" />
                              ) : (
                                <ReportIcon color="info" />
                              )}
                            </ListItemIcon>
                            <ListItemText 
                              primary={activity.activity} 
                              secondary={`${activity.details} - ${formatTimeAgo(activity.activity_date)}`}
                            />
                          </ListItem>
                          {index < dashboardStats.recentActivities.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No recent activities found.
                    </Typography>
                  )}
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
                      Payment Collection Rate
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {dashboardStats?.totalPlots > 0 
                        ? Math.round(((dashboardStats.totalPlots - dashboardStats.pendingPayments.count) / dashboardStats.totalPlots) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Total Properties
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {dashboardStats?.totalPlots || 0} plots
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Pending Amount
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {formatCurrency(dashboardStats?.pendingPayments?.amount || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => fetchDashboardStats(userData?.org_id)}
                    >
                      Refresh Data
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        );

      case 'streets':
        return <StreetsManagement userData={userData} />;
      
      case 'plots':
        return <PlotsManagement userData={userData} />;
      
      case 'residents':
        return <ResidentsManagement userData={userData} />;
      
      case 'payments':
        return <PaymentsManagement userData={userData} />;

      case 'reports':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Reports & Analytics
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Advanced reporting features are under development. This will include:
              </Typography>
              <Box sx={{ mt: 3, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Monthly payment collection reports
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Resident demographics analysis
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Property occupancy statistics
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Financial summaries and trends
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Maintenance request analytics
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                sx={{ mt: 3 }}
                onClick={() => setSelectedMenu('dashboard')}
              >
                Back to Dashboard
              </Button>
            </Paper>
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
                This section is under development.
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

  if (!userData && !loading) {
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