import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import settingsData from "../data/settingsData";

export default function Settings() {
  const [settings, setSettings] = useState(settingsData);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Settings
        </Typography>
        <FormGroup>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={() => toggleSetting("emailNotifications")}
                />
              }
              label="Email Notifications"
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={() => toggleSetting("darkMode")}
                />
              }
              label="Enable Dark Mode"
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoUpdate}
                  onChange={() => toggleSetting("autoUpdate")}
                />
              }
              label="Auto Updates"
            />
          </Stack>
        </FormGroup>
      </Paper>
    </Box>
  );
}
