import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    CircularProgress,
    IconButton,
    Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { appointmentsAPI, patientsAPI, usersAPI } from '../../utils/api';

const AppointmentEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
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
            try {
                const [patientsRes, doctorsRes, appointmentRes] = await Promise.all([
                    patientsAPI.getAll(),
                    usersAPI.getDoctors(),
                    appointmentsAPI.getById(id)
                ]);

                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);

                const appointment = appointmentRes.data;

                // Convert date string to Date object for the DatePicker
                const appointmentDate = appointment.appointmentDate ? new Date(appointment.appointmentDate) : null;

                // Convert time string to Date object for the TimePicker
                let appointmentTime = null;
                if (appointment.appointmentTime) {
                    const [hours, minutes] = appointment.appointmentTime.split(':');
                    appointmentTime = new Date();
                    appointmentTime.setHours(parseInt(hours, 10));
                    appointmentTime.setMinutes(parseInt(minutes, 10));
                }

                setFormData({
                    patient: appointment.patient,
                    doctor: appointment.doctor,
                    appointmentDate: appointmentDate,
                    appointmentTime: appointmentTime,
                    purpose: appointment.purpose,
                    status: appointment.status,
                    notes: appointment.notes || '',
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load appointment data. Please try again.');
            } finally {
                setLoading(false);
                setFetchingData(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Format time for backend
            const timeString = formData.appointmentTime
                ? `${formData.appointmentTime.getHours().toString().padStart(2, '0')}:${formData.appointmentTime.getMinutes().toString().padStart(2, '0')}`
                : null;

            const appointmentData = {
                ...formData,
                patient: formData.patient._id,
                doctor: formData.doctor._id,
                appointmentTime: timeString,
            };

            await appointmentsAPI.update(id, appointmentData);
            navigate('/appointments', {
                state: {
                    successMessage: 'Appointment updated successfully!'
                }
            });
        } catch (err) {
            console.error('Error updating appointment:', err);
            setError(err.response?.data?.message || 'Failed to update appointment. Please try again.');
            setSaving(false);
        }
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    if (loading || fetchingData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

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
                        Edit Appointment
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={patients}
                                value={formData.patient}
                                getOptionLabel={(option) =>
                                    option ? `${option.firstName} ${option.lastName}` : ''
                                }
                                onChange={(event, newValue) => {
                                    setFormData({
                                        ...formData,
                                        patient: newValue
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Patient"
                                        fullWidth
                                    />
                                )}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={doctors}
                                value={formData.doctor}
                                getOptionLabel={(option) =>
                                    option ? option.username : ''
                                }
                                onChange={(event, newValue) => {
                                    setFormData({
                                        ...formData,
                                        doctor: newValue
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Doctor"
                                        fullWidth
                                    />
                                )}
                            />
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
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Purpose"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="scheduled">Scheduled</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                <MenuItem value="no-show">No Show</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={saving}
                                    startIcon={saving ? <CircularProgress size={20} /> : null}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AppointmentEdit; 