import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { patientsAPI } from '../../utils/api';

const PatientList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Delete dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        // Filter patients based on search query
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = patients.filter(
                patient =>
                    patient.firstName.toLowerCase().includes(lowerCaseQuery) ||
                    patient.lastName.toLowerCase().includes(lowerCaseQuery) ||
                    patient.email.toLowerCase().includes(lowerCaseQuery) ||
                    patient.contactNumber.includes(searchQuery)
            );
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    const fetchPatients = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await patientsAPI.getAll();
            setPatients(response.data);
            setFilteredPatients(response.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Failed to load patients. Please try again later.');
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
        setPage(0); // Reset to first page on search
    };

    const handleDeleteClick = (patient) => {
        setPatientToDelete(patient);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!patientToDelete) return;

        setDeleteLoading(true);
        setError('');

        try {
            await patientsAPI.delete(patientToDelete._id);

            // Remove patient from both lists
            const updatedPatients = patients.filter(p => p._id !== patientToDelete._id);
            setPatients(updatedPatients);
            setFilteredPatients(updatedPatients.filter(p =>
                p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.contactNumber.includes(searchQuery)
            ));

            setOpenDeleteDialog(false);
            setSuccessMessage(`Patient ${patientToDelete.firstName} ${patientToDelete.lastName} has been deleted successfully.`);
            setPatientToDelete(null);
        } catch (err) {
            console.error('Error deleting patient:', err);
            setError(err.response?.data?.message || 'Failed to delete patient. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setPatientToDelete(null);
    };

    if (loading && patients.length === 0) {
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
                        Patients
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/patients/register"
                    >
                        Register New Patient
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Manage your patient records
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box p={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search patients by name, email, or phone number..."
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
                </Box>

                {filteredPatients.length === 0 ? (
                    <Box p={4} textAlign="center">
                        <PersonAddIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No patients found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {searchQuery ? 'Try a different search term or' : 'Get started by'} registering a new patient.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            component={Link}
                            to="/patients/register"
                        >
                            Register New Patient
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table aria-label="patients table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Date of Birth</TableCell>
                                        <TableCell>Contact Number</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPatients
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((patient) => (
                                            <TableRow key={patient._id} hover>
                                                <TableCell>
                                                    {`${patient.firstName} ${patient.lastName}`}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                                                        size="small"
                                                        color={
                                                            patient.gender === 'male'
                                                                ? 'primary'
                                                                : patient.gender === 'female'
                                                                    ? 'secondary'
                                                                    : 'default'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {patient.dateOfBirth
                                                        ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>{patient.contactNumber}</TableCell>
                                                <TableCell>{patient.email}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => navigate(`/patients/${patient._id}`)}
                                                        size="small"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => navigate(`/patients/${patient._id}/edit`)}
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteClick(patient)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredPatients.length}
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
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete patient record for{' '}
                        <strong>
                            {patientToDelete
                                ? `${patientToDelete.firstName} ${patientToDelete.lastName}`
                                : ''}
                        </strong>
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PatientList; 