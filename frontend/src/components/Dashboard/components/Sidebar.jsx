import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import {
  Home,
  Map,
  Payment,
  Notifications,
  AccountCircle,
  Settings,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useDarkMode } from "../context/DarkModeContext";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 220;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

const menuItems = [
  { text: "Dashboard", icon: <Home />, path: "/dashboard" },
  { text: "Plot Info", icon: <Map />, path: "/dashboard/plot-info" },
  { text: "Payment History", icon: <Payment />, path: "/dashboard/payment-history" },
  { text: "Notifications", icon: <Notifications />, path: "/dashboard/notifications" },
  { text: "Profile", icon: <AccountCircle />, path: "/dashboard/profile" },
  { text: "Settings", icon: <Settings />, path: "/dashboard/settings" },
];


  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 64,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
        }}
      >
        {open && (
          <Typography variant="h6" fontWeight={700}>
            GCMS
          </Typography>
        )}
        <IconButton onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => {
          const isSelected = location.pathname.startsWith(item.path);
          return (
            <Tooltip
              key={item.text}
              title={!open ? item.text : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  backgroundColor: isSelected ? "primary.main" : "transparent",
                  color: isSelected ? "white" : "text.primary",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? "primary.dark"
                      : "action.hover",
                  },
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? "white" : "text.secondary",
                    transition: "color 0.3s ease",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          );
        })}

        <Divider sx={{ my: 1 }} />

        <Tooltip
          title={!open ? "Toggle Theme" : ""}
          placement="right"
          arrow
        >
          <ListItemButton
            onClick={toggleDarkMode}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              "& .MuiListItemIcon-root": {
                transition: "color 0.3s ease",
              },
            }}
          >
            <ListItemIcon>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            {open && <ListItemText primary="Toggle Theme" />}
          </ListItemButton>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
