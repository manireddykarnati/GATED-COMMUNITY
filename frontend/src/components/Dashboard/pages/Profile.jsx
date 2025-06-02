import React from "react";
import { Box, Typography, Avatar, Button, Fade } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled, keyframes } from "@mui/material/styles";
import profile from "../data/profileData";

// 🔁 Animated gradient background
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 0,
  background: "linear-gradient(-45deg, #0f172a, #1e3a8a, #2563eb, #3b82f6)",
  backgroundSize: "400% 400%",
  animation: `${animatedGradient} 15s ease infinite`,
  filter: "blur(16px) brightness(0.6)",
});

const Overlay = styled(Box)({
  position: "relative",
  zIndex: 2,
  padding: "2rem",
  minHeight: "100vh",
});

const TopInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  justifyContent: "space-between",
  flexWrap: "wrap",
  paddingBottom: theme.spacing(4),
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const WelcomeBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(3),
  color: "#fff",
  padding: theme.spacing(5),
  minHeight: 200,
  backgroundImage:
    "linear-gradient(rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.7)), url('https://demos.creative-tim.com/vision-ui-dashboard-react/static/media/welcome-profile.309ed05e.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: theme.shadows[4],
  backdropFilter: "blur(6px)",
}));

const Profile = () => {
  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ position: "relative" }}>
        <Background />
        <Overlay>
          <TopInfo>
            <UserInfo>
              <Avatar src={profile.avatar} alt={profile.name} sx={{ width: 72, height: 72 }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.email}
                </Typography>
              </Box>
            </UserInfo>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: 2 }}
            >
              Logout
            </Button>
          </TopInfo>

          <WelcomeBox>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome back!
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.9)">
              Nice to see you, {profile.name}! {profile.bio}
            </Typography>
            <Typography variant="subtitle2" mt={2} sx={{ opacity: 0.9, fontStyle: "italic" }}>
              Plan: {profile.plan}
            </Typography>
          </WelcomeBox>
        </Overlay>
      </Box>
    </Fade>
  );
};

export default Profile;
