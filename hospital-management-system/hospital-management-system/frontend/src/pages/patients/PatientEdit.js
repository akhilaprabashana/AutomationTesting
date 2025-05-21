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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { patientsAPI } from '../../utils/api';

const PatientEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        gender: '',
        contactNumber: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
        },
        insuranceInfo: {
            provider: '',
            policyNumber: '',
            groupNumber: '',
        },
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await patientsAPI.getById(id);
                const patientData = response.data;

                // Convert date string to Date object for the DatePicker
                if (patientData.dateOfBirth) {
                    patientData.dateOfBirth = new Date(patientData.dateOfBirth);
                }

                setFormData(patientData);
            } catch (err) {
                console.error('Error fetching patient:', err);
                setError('Failed to load patient data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dateOfBirth: date,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await patientsAPI.update(id, formData);
            setSuccess(true);
            // Navigate back to patient details after successful update
            navigate(`/patients/${id}`);
        } catch (err) {
            console.error('Error updating patient:', err);
            setError(err.response?.data?.message || 'Failed to update patient. Please try again.');
            setSaving(false);
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
                        Edit Patient
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Personal Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Date of Birth"
                                value={formData.dateOfBirth}
                                onChange={handleDateChange}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth required />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Contact Number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Address Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Address Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street Address"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="State"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="ZIP Code"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Emergency Contact */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Emergency Contact
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Relationship"
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="emergencyContact.phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Insurance Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Insurance Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Provider"
                                name="insuranceInfo.provider"
                                value={formData.insuranceInfo.provider}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Policy Number"
                                name="insuranceInfo.policyNumber"
                                value={formData.insuranceInfo.policyNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Group Number"
                                name="insuranceInfo.groupNumber"
                                value={formData.insuranceInfo.groupNumber}
                                onChange={handleChange}
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

export default PatientEdit; 