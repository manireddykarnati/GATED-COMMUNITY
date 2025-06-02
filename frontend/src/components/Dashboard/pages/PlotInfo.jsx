import React from "react";
import { Box, Typography, useTheme, Grid, Avatar, Fade, Paper } from "@mui/material";
import { Map, HomeWork, Place, Person, LocationOn } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import plotData from "../data/plotInfoData";

// 🌁 Blurred background image
const Background = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage:
    'url("https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1950&q=80")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(12px) brightness(0.6)",
  zIndex: 0,
});

// 🌈 Subtle gradient overlay (on top of image)
const GradientOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))"
      : "linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(230, 244, 255, 0.8))",
  zIndex: 1,
}));

// 🌟 Info card panel
const InfoPanel = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  padding: theme.spacing(4),
  backdropFilter: "blur(10px)",
  background: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.75)",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  transition: "all 0.4s ease",
  position: "relative",
  zIndex: 2,
}));

const Overlay = styled(Box)({
  position: "relative",
  zIndex: 2,
});

const PlotInfo = () => {
  const theme = useTheme();

  const fields = [
    { label: "Plot Number", value: plotData.plotNumber, icon: <Map /> },
    { label: "Area", value: plotData.area, icon: <HomeWork /> },
    { label: "Block", value: plotData.block, icon: <Place /> },
    { label: "Owner Name", value: plotData.ownerName, icon: <Person /> },
    { label: "Address", value: plotData.address, icon: <LocationOn /> },
  ];

  return (
    <Fade in timeout={700}>
      <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <Background />
        <GradientOverlay />
        <Overlay>
          <Box sx={{ px: 3, py: 5 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              color={theme.palette.mode === "dark" ? "white" : "primary.main"}
              sx={{ mb: 4 }}
            >
              🧾 My Plot Information
            </Typography>

            <InfoPanel elevation={0}>
              <Grid container spacing={4}>
                {fields.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color={theme.palette.mode === "dark" ? "#fff" : "text.primary"}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </InfoPanel>
          </Box>
        </Overlay>
      </Box>
    </Fade>
  );
};

export default PlotInfo;
