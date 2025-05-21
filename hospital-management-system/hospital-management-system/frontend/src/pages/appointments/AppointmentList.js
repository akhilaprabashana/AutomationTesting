import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { appointmentsAPI } from '../../utils/api';

const AppointmentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Delete dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Define filterAppointments as a memoized callback to avoid recreation on every render
    const filterAppointments = useCallback(() => {
        if (!appointments.length) return;

        let filtered = [...appointments];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(appointment => appointment.status === statusFilter);
        }

        // Apply text search
        if (searchQuery.trim() !== '') {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                appointment =>
                    (appointment.patient &&
                        appointment.patient.firstName &&
                        appointment.patient.lastName &&
                        (appointment.patient.firstName + ' ' + appointment.patient.lastName)
                            .toLowerCase()
                            .includes(lowerCaseQuery)) ||
                    (appointment.doctor &&
                        appointment.doctor.username &&
                        appointment.doctor.username.toLowerCase().includes(lowerCaseQuery)) ||
                    (appointment.purpose &&
                        appointment.purpose.toLowerCase().includes(lowerCaseQuery))
            );
        }

        setFilteredAppointments(filtered);
    }, [appointments, searchQuery, statusFilter]);

    useEffect(() => {
        fetchAppointments();

        // Handle success message from navigation state
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            // Clear the navigation state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    useEffect(() => {
        filterAppointments();
    }, [filterAppointments]);

    const fetchAppointments = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await appointmentsAPI.getAll();
            setAppointments(response.data);
            setFilteredAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSuccessMessage('');
        setPage(0); // Reset to first page on search
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setSuccessMessage('');
        setPage(0); // Reset to first page on filter change
    };

    const handleDeleteClick = (appointment) => {
        setAppointmentToDelete(appointment);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!appointmentToDelete) return;

        setDeleteLoading(true);
        setError('');

        try {
            await appointmentsAPI.delete(appointmentToDelete._id);

            // Remove appointment from list
            setAppointments(appointments.filter(a => a._id !== appointmentToDelete._id));
            setFilteredAppointments(filteredAppointments.filter(a => a._id !== appointmentToDelete._id));
            setOpenDeleteDialog(false);

            // Show success message
            setSuccessMessage('Appointment cancelled successfully!');
        } catch (err) {
            console.error('Error deleting appointment:', err);
            setError(
                err.response?.data?.message ||
                'Failed to delete appointment. Please try again.'
            );
            // Keep the dialog open so they can try again
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setAppointmentToDelete(null);
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case 'scheduled':
                return { color: 'primary', label: 'Scheduled' };
            case 'completed':
                return { color: 'success', label: 'Completed' };
            case 'cancelled':
                return { color: 'error', label: 'Cancelled' };
            case 'no-show':
                return { color: 'warning', label: 'No Show' };
            default:
                return { color: 'default', label: status };
        }
    };

    if (loading && appointments.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
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

            {successMessage && (
                <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Appointments
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/appointments/create"
                    >
                        Schedule New Appointment
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Manage patient appointments
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box p={2} display="flex" flexWrap="wrap" gap={2}>
                    <TextField
                        sx={{ flexGrow: 1 }}
                        variant="outlined"
                        placeholder="Search by patient name, doctor, or purpose..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="status-filter-label">Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            id="status-filter"
                            value={statusFilter}
                            label="Status"
                            onChange={handleStatusFilterChange}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="no-show">No Show</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {filteredAppointments.length === 0 ? (
                    <Box p={4} textAlign="center">
                        <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No appointments found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try changing your search criteria or'
                                : 'Get started by'} scheduling a new appointment.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            component={Link}
                            to="/appointments/create"
                        >
                            Schedule New Appointment
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table aria-label="appointments table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Patient</TableCell>
                                        <TableCell>Doctor</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Purpose</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAppointments
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((appointment) => {
                                            const statusChip = getStatusChipProps(appointment.status);

                                            return (
                                                <TableRow key={appointment._id} hover>
                                                    <TableCell>
                                                        {appointment.patient && appointment.patient.firstName && appointment.patient.lastName
                                                            ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                                                            : "No patient data"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {appointment.doctor && appointment.doctor.username
                                                            ? appointment.doctor.username
                                                            : "No doctor data"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {appointment.appointmentDate
                                                            ? format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')
                                                            : "No date"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {appointment.appointmentTime || "No time"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {appointment.purpose || "No purpose specified"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={statusChip.label}
                                                            color={statusChip.color}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => navigate(`/appointments/${appointment._id}/edit`)}
                                                            size="small"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDeleteClick(appointment)}
                                                            size="small"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredAppointments.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel the appointment for{' '}
                        <strong>
                            {appointmentToDelete && appointmentToDelete.patient &&
                                appointmentToDelete.patient.firstName && appointmentToDelete.patient.lastName
                                ? `${appointmentToDelete.patient.firstName} ${appointmentToDelete.patient.lastName}`
                                : 'this patient'}
                        </strong>
                        {appointmentToDelete
                            ? ` on ${appointmentToDelete.appointmentDate
                                ? format(new Date(appointmentToDelete.appointmentDate), 'MMMM dd, yyyy')
                                : "the scheduled date"} at ${appointmentToDelete.appointmentTime || "the scheduled time"}`
                            : ''}
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
                        No, Keep It
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
                    >
                        {deleteLoading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AppointmentList; 