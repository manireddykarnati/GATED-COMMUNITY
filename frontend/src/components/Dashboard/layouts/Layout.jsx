import React from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          overflowY: "auto",
          backgroundColor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
