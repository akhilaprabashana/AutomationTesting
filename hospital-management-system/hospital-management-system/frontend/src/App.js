import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Auth Provider
import { AuthProvider } from './utils/AuthContext';

// Pages and Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/patients/PatientRegistration';
import PatientList from './pages/patients/PatientList';
import PatientDetails from './pages/patients/PatientDetails';
import PatientEdit from './pages/patients/PatientEdit';
import AppointmentForm from './pages/appointments/AppointmentForm';
import AppointmentList from './pages/appointments/AppointmentList';
import AppointmentEdit from './pages/appointments/AppointmentEdit';
import LabReportList from './pages/lab-reports/LabReportList';
import LabReportForm from './pages/lab-reports/LabReportForm';
import LabReportDetails from './pages/lab-reports/LabReportDetails';
import DoctorList from './pages/doctors/DoctorList';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import NotFound from './pages/NotFound';

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                <AuthProvider>
                    <Router>
                        <div className="app">
                            <Navbar />
                            <div className="content">
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />

                                    {/* Protected Routes - Any authenticated user */}
                                    <Route path="/" element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    } />

                                    {/* Patient Routes - Staff, Doctor, Admin */}
                                    <Route path="/patients" element={
                                        <PrivateRoute requiredRole={['admin', 'staff', 'doctor']}>
                                            <PatientList />
                                        </PrivateRoute>
                                    } />

                                    {/* Staff or Admin only routes */}
                                    <Route path="/patients/register" element={
                                        <PrivateRoute requiredRole={['admin', 'staff']}>
                                            <PatientRegistration />
                                        </PrivateRoute>
                                    } />

                                    <Route path="/patients/:id" element={
                                        <PrivateRoute requiredRole={['admin', 'staff', 'doctor']}>
                                            <PatientDetails />
                                        </PrivateRoute>
                                    } />

                                    <Route path="/patients/:id/edit" element={
                                        <PrivateRoute requiredRole={['admin', 'staff']}>
                                            <PatientEdit />
                                        </PrivateRoute>
                                    } />

                                    {/* Appointment Routes */}
                                    <Route path="/appointments" element={
                                        <PrivateRoute requiredRole={['admin', 'staff', 'doctor']}>
                                            <AppointmentList />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/appointments/create" element={
                                        <PrivateRoute requiredRole={['admin', 'staff']}>
                                            <AppointmentForm />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/appointments/:id/edit" element={
                                        <PrivateRoute requiredRole={['admin', 'staff']}>
                                            <AppointmentEdit />
                                        </PrivateRoute>
                                    } />

                                    {/* Lab Report Routes */}
                                    <Route path="/lab-reports" element={
                                        <PrivateRoute requiredRole={['admin', 'staff', 'doctor']}>
                                            <LabReportList />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/lab-reports/create" element={
                                        <PrivateRoute requiredRole={['admin', 'staff']}>
                                            <LabReportForm />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/lab-reports/:id" element={
                                        <PrivateRoute requiredRole={['admin', 'staff', 'doctor']}>
                                            <LabReportDetails />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/lab-reports/:id/edit" element={
                                        <PrivateRoute requiredRole={['admin', 'staff']}>
                                            <LabReportForm />
                                        </PrivateRoute>
                                    } />

                                    {/* Doctor Routes */}
                                    <Route path="/doctors" element={
                                        <PrivateRoute requiredRole={['admin', 'staff', 'doctor']}>
                                            <DoctorList />
                                        </PrivateRoute>
                                    } />

                                    {/* Catch-all and 404 */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </div>
                        </div>
                    </Router>
                </AuthProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App; 