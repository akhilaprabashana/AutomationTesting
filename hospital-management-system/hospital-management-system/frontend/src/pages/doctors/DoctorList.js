import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { usersAPI } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';

const DoctorList = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // New doctor form state
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        username: '',
        email: '',
    });
    const [addingDoctor, setAddingDoctor] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Delete dialog state
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [deletingDoctor, setDeletingDoctor] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await usersAPI.getDoctors();
            setDoctors(response.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError('Failed to load doctors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor({
            ...newDoctor,
            [name]: value,
        });

        // Clear field-specific error when user types
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!newDoctor.username.trim()) {
            errors.username = 'Name is required';
        }

        if (!newDoctor.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(newDoctor.email)) {
            errors.email = 'Email is invalid';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddDoctor = async () => {
        if (!validateForm()) return;

        setAddingDoctor(true);
        setError('');

        try {
            const response = await usersAPI.createDoctor(newDoctor);
            setDoctors([...doctors, response.data.user]);
            setSuccessMessage('Doctor added successfully');
            setOpenAddDialog(false);
            setNewDoctor({ username: '', email: '' });
        } catch (err) {
            console.error('Error adding doctor:', err);
            setError(err.response?.data?.message || 'Failed to add doctor. Please try again.');
        } finally {
            setAddingDoctor(false);
        }
    };

    const handleDeleteClick = (doctor) => {
        setDoctorToDelete(doctor);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!doctorToDelete) return;

        setDeletingDoctor(true);

        try {
            await usersAPI.deleteUser(doctorToDelete.id || doctorToDelete._id);
            setDoctors(doctors.filter(d => (d.id || d._id) !== (doctorToDelete.id || doctorToDelete._id)));
            setSuccessMessage('Doctor removed successfully');
            setOpenDeleteDialog(false);
        } catch (err) {
            console.error('Error deleting doctor:', err);
            setError(err.response?.data?.message || 'Failed to delete doctor. Please try again.');
        } finally {
            setDeletingDoctor(false);
        }
    };

    if (loading && doctors.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    const isAdmin = user && user.role === 'admin';

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>
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
                        Doctors
                    </Typography>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAddDialog(true)}
                        >
                            Add New Doctor
                        </Button>
                    )}
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Manage hospital doctors
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                {doctors.length === 0 ? (
                    <Box p={4} textAlign="center">
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No doctors found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {isAdmin ? 'Get started by adding a new doctor.' : 'No doctors are currently registered in the system.'}
                        </Typography>
                        {isAdmin && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenAddDialog(true)}
                            >
                                Add New Doctor
                            </Button>
                        )}
                    </Box>
                ) : (
                    <TableContainer>
                        <Table aria-label="doctors table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    {isAdmin && <TableCell align="right">Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doctors.map((doctor) => (
                                    <TableRow key={doctor._id || doctor.id} hover>
                                        <TableCell>{doctor.username}</TableCell>
                                        <TableCell>{doctor.email}</TableCell>
                                        <TableCell>Doctor</TableCell>
                                        {isAdmin && (
                                            <TableCell align="right">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteClick(doctor)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Add Doctor Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Enter the doctor's details. A default password will be assigned.
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="username"
                                label="Doctor Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={newDoctor.username}
                                onChange={handleInputChange}
                                error={!!formErrors.username}
                                helperText={formErrors.username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={newDoctor.email}
                                onChange={handleInputChange}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} disabled={addingDoctor}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddDoctor}
                        variant="contained"
                        disabled={addingDoctor}
                        startIcon={addingDoctor ? <CircularProgress size={20} /> : null}
                    >
                        {addingDoctor ? 'Adding...' : 'Add Doctor'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove Dr. {doctorToDelete?.username} from the system?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} disabled={deletingDoctor}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={deletingDoctor}
                        startIcon={deletingDoctor ? <CircularProgress size={20} /> : null}
                    >
                        {deletingDoctor ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DoctorList; 