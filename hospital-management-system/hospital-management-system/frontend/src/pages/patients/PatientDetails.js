import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Divider,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { patientsAPI } from '../../utils/api';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await patientsAPI.getById(id);
                setPatient(response.data);
            } catch (err) {
                console.error('Error fetching patient details:', err);
                setError('Failed to load patient details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </Container>
        );
    }

    if (!patient) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">Patient not found</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/patients')}
                    sx={{ mt: 2 }}
                >
                    Return to Patient List
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                    <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" component="h1">
                        Patient Details
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/patients/${id}/edit`)}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<EventIcon />}
                        component={Link}
                        to="/appointments/create"
                        state={{ patientId: id }}
                    >
                        Schedule Appointment
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {/* Personal Information */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Name
                        </Typography>
                        <Typography variant="body1">
                            {patient.firstName} {patient.lastName}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Gender
                        </Typography>
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
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Date of Birth
                        </Typography>
                        <Typography variant="body1">
                            {patient.dateOfBirth
                                ? format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')
                                : 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Contact Number
                        </Typography>
                        <Typography variant="body1">{patient.contactNumber}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email
                        </Typography>
                        <Typography variant="body1">{patient.email}</Typography>
                    </Grid>

                    {/* Address Information */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Address Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Street Address
                        </Typography>
                        <Typography variant="body1">
                            {patient.address?.street || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            City
                        </Typography>
                        <Typography variant="body1">
                            {patient.address?.city || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            State/Province
                        </Typography>
                        <Typography variant="body1">
                            {patient.address?.state || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            ZIP Code
                        </Typography>
                        <Typography variant="body1">
                            {patient.address?.zipCode || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Emergency Contact */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Emergency Contact
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Name
                        </Typography>
                        <Typography variant="body1">
                            {patient.emergencyContact?.name || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Relationship
                        </Typography>
                        <Typography variant="body1">
                            {patient.emergencyContact?.relationship || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Phone Number
                        </Typography>
                        <Typography variant="body1">
                            {patient.emergencyContact?.phone || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Insurance Information */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Insurance Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Provider
                        </Typography>
                        <Typography variant="body1">
                            {patient.insuranceInfo?.provider || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Policy Number
                        </Typography>
                        <Typography variant="body1">
                            {patient.insuranceInfo?.policyNumber || 'Not provided'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Group Number
                        </Typography>
                        <Typography variant="body1">
                            {patient.insuranceInfo?.groupNumber || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Medical History */}
                    {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                        <>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Medical History
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12}>
                                <List>
                                    {patient.medicalHistory.map((item, index) => (
                                        <ListItem key={index} divider={index < patient.medicalHistory.length - 1}>
                                            <ListItemText
                                                primary={item.condition}
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" component="span">
                                                            Diagnosis Date:{' '}
                                                            {item.diagnosisDate
                                                                ? format(new Date(item.diagnosisDate), 'MMMM dd, yyyy')
                                                                : 'Unknown'}
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="body2" component="span">
                                                            Treatment: {item.treatment || 'None specified'}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default PatientDetails; 