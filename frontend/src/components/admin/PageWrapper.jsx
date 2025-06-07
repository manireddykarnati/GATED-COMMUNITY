// src/components/admin/PageWrapper.jsx
import React from 'react';
import { Box, Paper } from '@mui/material';

const PageWrapper = ({ children }) => (
    <Box sx={{ ml: '240px', p: 3, minHeight: '100vh', background: '#f5f5f5' }}>
        <Paper sx={{ p: 3 }}>
            {children}
        </Paper>
    </Box>
);

export default PageWrapper;
