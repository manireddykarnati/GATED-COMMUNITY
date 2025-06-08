import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';

import StreetsManagement from './admin/StreetsManagement';
import PlotsManagement from './admin/PlotsManagement';
import ResidentsManagement from './admin/ResidentsManagement';
import PaymentsManagement from './admin/PaymentsManagement';
import ReportsAnalytics from './admin/ReportsAnalytics';

const AdminDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                {/* ✅ Default landing route */}
                <Route index element={<StreetsManagement />} />
                <Route path="streets" element={<StreetsManagement />} />
                <Route path="plots" element={<PlotsManagement />} />
                <Route path="residents" element={<ResidentsManagement />} />
                <Route path="payments" element={<PaymentsManagement />} />
                <Route path="reports" element={<ReportsAnalytics />} />
            </Route>
        </Routes>
    );
};

export default AdminDashboard;
