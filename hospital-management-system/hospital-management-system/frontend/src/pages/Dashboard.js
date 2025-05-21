import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Divider,
    Chip,
} from '@mui/material';
import {
    PeopleAlt as PatientsIcon,
    EventNote as AppointmentsIcon,
    Today as TodayIcon,
    Add as AddIcon,
    Science as LabIcon,
    Pending as PendingIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { dashboardAPI } from '../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        totalLabReports: 0,
        pendingLabReports: 0,
        todayLabReports: 0,
    });
    const [appointments, setAppointments] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, appointmentsRes, labReportsRes] = await Promise.all([
                    dashboardAPI.getStats(),
                    dashboardAPI.getRecentAppointments(),
                    dashboardAPI.getRecentLabReports()
                ]);

                setStats(statsRes.data);
                setAppointments(appointmentsRes.data);
                setLabReports(labReportsRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusChipProps = (status) => {
        switch (status) {
            case 'completed':
                return { color: 'success', label: 'Completed' };
            case 'pending':
                return { color: 'warning', label: 'Pending' };
            case 'cancelled':
                return { color: 'error', label: 'Cancelled' };
            default:
                return { color: 'default', label: status };
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome to the Hospital Management System
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'primary.light',
                            color: 'white',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <PatientsIcon fontSize="large" />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Total Patients
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div">
                                {stats.totalPatients}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/patients" size="small" color="inherit">
                                View Patients
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'secondary.light',
                            color: 'white',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <AppointmentsIcon fontSize="large" />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Total Appointments
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div">
                                {stats.totalAppointments}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/appointments" size="small" color="inherit">
                                View Appointments
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'success.light',
                            color: 'white',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TodayIcon fontSize="large" />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Today's Appointments
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div">
                                {stats.todayAppointments}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/appointments/create" size="small" color="inherit">
                                Schedule New
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Lab Reports Stats */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'info.light',
                            color: 'white',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <LabIcon fontSize="large" />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Total Lab Reports
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div">
                                {stats.totalLabReports}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/lab-reports" size="small" color="inherit">
                                View Reports
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'warning.light',
                            color: 'white',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <PendingIcon fontSize="large" />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Pending Reports
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div">
                                {stats.pendingLabReports}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/lab-reports" size="small" color="inherit">
                                View Pending
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'error.light',
                            color: 'white',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TodayIcon fontSize="large" />
                                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                    Today's Reports
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div">
                                {stats.todayLabReports}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/lab-reports/create" size="small" color="inherit">
                                Create New
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Quick Action Buttons */}
                <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/patients/register"
                                    startIcon={<AddIcon />}
                                >
                                    Register Patient
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/appointments/create"
                                    startIcon={<AddIcon />}
                                >
                                    Schedule Appointment
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/lab-reports/create"
                                    startIcon={<AddIcon />}
                                >
                                    Create Lab Report
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Recent Data Tables */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="h2">
                                Recent Appointments
                            </Typography>
                            <Button component={Link} to="/appointments" size="small">
                                View All
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                            <Table aria-label="recent appointments">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Patient</TableCell>
                                        <TableCell>Doctor</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appointments.map((appointment) => (
                                        <TableRow key={appointment._id}>
                                            <TableCell>
                                                {`${appointment.patient.firstName} ${appointment.patient.lastName}`}
                                            </TableCell>
                                            <TableCell>{appointment.doctor.username}</TableCell>
                                            <TableCell>
                                                {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusChipProps(appointment.status).label}
                                                    color={getStatusChipProps(appointment.status).color}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="h2">
                                Recent Lab Reports
                            </Typography>
                            <Button component={Link} to="/lab-reports" size="small">
                                View All
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                            <Table aria-label="recent lab reports">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Report Number</TableCell>
                                        <TableCell>Patient</TableCell>
                                        <TableCell>Test Type</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {labReports.map((report) => (
                                        <TableRow key={report._id}>
                                            <TableCell>{report.reportNumber}</TableCell>
                                            <TableCell>
                                                {`${report.patient.firstName} ${report.patient.lastName}`}
                                            </TableCell>
                                            <TableCell>{report.testType}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusChipProps(report.status).label}
                                                    color={getStatusChipProps(report.status).color}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 