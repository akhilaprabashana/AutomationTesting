import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    Box,
    Divider,
    Snackbar,
    CircularProgress,
    IconButton,
    FormHelperText,
    Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { appointmentsAPI, patientsAPI, usersAPI } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';

const AppointmentForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);

    const [formData, setFormData] = useState({
        patient: null,
        doctor: null,
        appointmentDate: null,
        appointmentTime: null,
        purpose: '',
        status: 'scheduled',
        notes: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setFetchingData(true);
            try {
                // Fetch patients data using our API utility
                const patientsResponse = await patientsAPI.getAll();

                // Fetch doctors using our API utility
                const doctorsResponse = await usersAPI.getDoctors();

                setPatients(patientsResponse.data);
                setDoctors(doctorsResponse.data || []);
            } catch (err) {
                console.error('Error fetching data for appointment form:', err);
                setError('Failed to load necessary data. Please try again later.');
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            appointmentDate: date,
        });
    };

    const handleTimeChange = (time) => {
        setFormData({
            ...formData,
            appointmentTime: time,
        });
    };

    const handlePatientChange = (event, newValue) => {
        setFormData({
            ...formData,
            patient: newValue,
        });
    };

    const handleDoctorChange = (event, newValue) => {
        setFormData({
            ...formData,
            doctor: newValue,
        });
    };

    const validateForm = () => {
        if (!formData.patient || !formData.doctor || !formData.appointmentDate ||
            !formData.appointmentTime || !formData.purpose) {
            setError('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const formatTime = (date) => {
        if (!date) return '';
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // Format the date for the API
            const formattedDate = formData.appointmentDate.toISOString().split('T')[0];

            // Format the time from the date object
            const formattedTime = formatTime(formData.appointmentTime);

            // Prepare the appointment data to be submitted
            const appointmentData = {
                patient: formData.patient._id,
                doctor: formData.doctor._id,
                appointmentDate: formattedDate,
                appointmentTime: formattedTime,
                purpose: formData.purpose,
                status: formData.status,
                notes: formData.notes,
            };

            // Using our API utility
            await appointmentsAPI.create(appointmentData);

            setSuccess(true);

            // Reset form after successful submission
            setFormData({
                patient: null,
                doctor: null,
                appointmentDate: null,
                appointmentTime: null,
                purpose: '',
                status: 'scheduled',
                notes: '',
            });

            // Navigate to appointments list after a short delay
            setTimeout(() => {
                navigate('/appointments');
            }, 2000);
        } catch (err) {
            console.error('Error scheduling appointment:', err);
            setError(
                err.response?.data?.message ||
                'Failed to schedule appointment. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSuccess(false);
    };

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                    <IconButton
                        edge="start"
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" component="h1">
                        Schedule Appointment
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Snackbar
                    open={success}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        Appointment scheduled successfully!
                    </Alert>
                </Snackbar>

                {fetchingData ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Patient and Doctor Selection */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Appointment Details
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    id="patient-select"
                                    options={patients}
                                    getOptionLabel={(option) =>
                                        option ? `${option.firstName} ${option.lastName}` : ''
                                    }
                                    value={formData.patient}
                                    onChange={handlePatientChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Select Patient"
                                            placeholder="Search patient..."
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    id="doctor-select"
                                    options={doctors}
                                    getOptionLabel={(option) => option ? option.username : ''}
                                    value={formData.doctor}
                                    onChange={handleDoctorChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Select Doctor"
                                            placeholder="Search doctor..."
                                        />
                                    )}
                                />
                                {doctors.length === 0 && (
                                    <FormHelperText>
                                        No doctors available. Please contact an administrator.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label="Appointment Date"
                                    value={formData.appointmentDate}
                                    onChange={handleDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                    minDate={new Date()}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TimePicker
                                    label="Appointment Time"
                                    value={formData.appointmentTime}
                                    onChange={handleTimeChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="purpose"
                                    name="purpose"
                                    label="Purpose of Visit"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="status"
                                    name="status"
                                    select
                                    label="Status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="scheduled">Scheduled</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                    <MenuItem value="no-show">No Show</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="notes"
                                    name="notes"
                                    label="Additional Notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={loading || doctors.length === 0}
                                    fullWidth
                                >
                                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Paper>
        </Container>
    );
};

export default AppointmentForm; 