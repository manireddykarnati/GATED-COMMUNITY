import React, { useState } from "react";
import { Box, Typography, Paper, Avatar, Grid, Fade, Button, useTheme } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { styled, keyframes } from "@mui/material/styles";
import initialNotifications from "../data/notificationsData";

// 🔁 Animated background
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  background: "linear-gradient(-45deg, #1e3c72, #2a5298, #00c6ff, #0072ff)",
  backgroundSize: "400% 400%",
  animation: `${animatedGradient} 15s ease infinite`,
  filter: "blur(8px) brightness(0.6)",
});

const NotificationCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.85)",
  boxShadow: theme.shadows[4],
  transition: "all 0.3s ease",
  backdropFilter: "blur(5px)",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-4px)",
  },
  position: "relative",
  zIndex: 2,
}));

const Overlay = styled(Box)({
  position: "relative",
  zIndex: 2,
});

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const theme = useTheme();

  const handleDismiss = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Fade in timeout={700}>
      <Box sx={{ position: "relative", minHeight: "100vh", px: 3, py: 5 }}>
        <Background />
        <Overlay>
          <Typography variant="h4" fontWeight={700} mb={4} color="white">
            🔔 Notifications
          </Typography>

          {notifications.length === 0 ? (
            <Typography variant="h6" color="white">
              You&apos;re all caught up!
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {notifications.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <NotificationCard>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <NotificationsActiveIcon />
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={600} color="text.primary">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {item.date}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDismiss(index)}
                    >
                      Dismiss
                    </Button>
                  </NotificationCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Overlay>
      </Box>
    </Fade>
  );
};

export default Notifications;
