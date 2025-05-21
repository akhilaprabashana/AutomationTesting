import React, { useState } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { patientsAPI } from '../../utils/api';

const PatientRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        setError('');

        try {
            // Using our API utility
            await patientsAPI.create(formData);

            setSuccess(true);

            // Reset form after successful submission
            setFormData({
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
        } catch (err) {
            console.error('Error registering patient:', err);
            setError(
                err.response?.data?.message ||
                'Failed to register patient. Please try again.'
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
                        Patient Registration
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
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                name="lastName"
                                label="Last Name"
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
                                    <TextField
                                        {...params}
                                        required
                                        fullWidth
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                id="gender"
                                name="gender"
                                label="Gender"
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
                                id="contactNumber"
                                name="contactNumber"
                                label="Contact Number"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
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
                                id="street"
                                name="address.street"
                                label="Street Address"
                                value={formData.address.street}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="city"
                                name="address.city"
                                label="City"
                                value={formData.address.city}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="state"
                                name="address.state"
                                label="State/Province"
                                value={formData.address.state}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="zipCode"
                                name="address.zipCode"
                                label="ZIP / Postal Code"
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
                                id="emergencyName"
                                name="emergencyContact.name"
                                label="Name"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="emergencyRelationship"
                                name="emergencyContact.relationship"
                                label="Relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="emergencyPhone"
                                name="emergencyContact.phone"
                                label="Phone Number"
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
                                id="insuranceProvider"
                                name="insuranceInfo.provider"
                                label="Insurance Provider"
                                value={formData.insuranceInfo.provider}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="policyNumber"
                                name="insuranceInfo.policyNumber"
                                label="Policy Number"
                                value={formData.insuranceInfo.policyNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="groupNumber"
                                name="insuranceInfo.groupNumber"
                                label="Group Number"
                                value={formData.insuranceInfo.groupNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{ py: 1.5 }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Register Patient"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Snackbar
                    open={success}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="success"
                        variant="filled"
                    >
                        Patient registered successfully!
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    );
};

export default PatientRegistration; 