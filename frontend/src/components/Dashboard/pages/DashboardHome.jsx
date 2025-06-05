import React from "react";
import { Box, Card, CardContent, Typography, Grid, Avatar, useTheme } from "@mui/material";

import { HomeWork, NotificationsActive, Payment, Event, DirectionsCar } from "@mui/icons-material";

import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Hero section
const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: theme.palette.mode === "dark"
    ? "linear-gradient(135deg, #1e1e2f 0%, #282c34 100%)"
    : "linear-gradient(135deg, #c3dafe 0%, #e0e7ff 100%)",
  color: theme.palette.mode === "dark" ? "#fff" : "#111827",
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[6],
}));

// Cards
const WidgetCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  background: theme.palette.mode === "dark"
    ? "linear-gradient(135deg, #1f2937 0%, #2d3748 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)",
  boxShadow: theme.shadows[4],
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.shadows[8],
  },
}));



const DashboardHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const widgets = [
    {
      title: "My Plot Info",
      description: "Check your flat/plot number, size, block, and ownership details.",
      icon: <HomeWork fontSize="large" />,
      route: "/dashboard/plot-info",
    },
    {
      title: "Community Notifications",
      description: "Stay updated with announcements and emergency alerts.",
      icon: <NotificationsActive fontSize="large" />,
      route: "/dashboard/notifications",
    },
    {
      title: "Payment Status",
      description: "Track your maintenance and utility bills with status updates.",
      icon: <Payment fontSize="large" />,
      route: "/dashboard/payment-history",
    },
    {
      title: "Events & Bookings",
      description: "View upcoming events and book common areas or facilities.",
      icon: <Event fontSize="large" />,
      route: "/events", // Optional future page
    },
    {
      title: "Vehicle Info",
      description: "Register and manage parking slots for your vehicles.",
      icon: <DirectionsCar fontSize="large" />,
      route: "/vehicles", // Optional future page
    },
  ];

  return (
    <Box sx={{ px: 3, py: 4 }}>
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h4" fontWeight={700}>
          Welcome to Your Community Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
          Manage everything from plots and payments to events and vehicle parking — all in one place.
        </Typography>
      </HeroSection>

      {/* Cards */}
      <Grid container spacing={3}>
        {widgets.map((widget, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <WidgetCard onClick={() => navigate(widget.route)}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    mb: 2,
                  }}
                >
                  {widget.icon}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  {widget.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {widget.description}
                </Typography>
              </CardContent>
            </WidgetCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardHome;
