import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    CircularProgress,
    IconButton,
    Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { labReportsAPI, patientsAPI, usersAPI } from '../../utils/api';

const LabReportForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        patient: null,
        doctor: null,
        testType: '',
        testDate: null,
        results: '',
        normalRange: '',
        unit: '',
        status: 'pending',
        remarks: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    patientsAPI.getAll(),
                    usersAPI.getDoctors()
                ]);

                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);

                if (isEditing) {
                    const reportRes = await labReportsAPI.getById(id);
                    const report = reportRes.data;

                    setFormData({
                        patient: report.patient,
                        doctor: report.doctor,
                        testType: report.testType,
                        testDate: new Date(report.testDate),
                        results: report.results,
                        normalRange: report.normalRange,
                        unit: report.unit,
                        status: report.status,
                        remarks: report.remarks || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load necessary data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const reportData = {
                ...formData,
                patient: formData.patient._id,
                doctor: formData.doctor._id,
            };

            if (isEditing) {
                await labReportsAPI.update(id, reportData);
            } else {
                await labReportsAPI.create(reportData);
            }

            navigate('/lab-reports', {
                state: {
                    successMessage: `Lab report ${isEditing ? 'updated' : 'created'} successfully!`
                }
            });
        } catch (err) {
            console.error('Error saving lab report:', err);
            setError(err.response?.data?.message || 'Failed to save lab report. Please try again.');
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                        {isEditing ? 'Edit Lab Report' : 'New Lab Report'}
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
                                    setFormData(prev => ({
                                        ...prev,
                                        patient: newValue
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Patient"
                                        fullWidth
                                    />
                                )}
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
                                    setFormData(prev => ({
                                        ...prev,
                                        doctor: newValue
                                    }));
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
                            <TextField
                                required
                                fullWidth
                                label="Test Type"
                                name="testType"
                                value={formData.testType}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="Test Date"
                                value={formData.testDate}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        testDate: newValue
                                    }));
                                }}
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
                                label="Results"
                                name="results"
                                value={formData.results}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Normal Range"
                                name="normalRange"
                                value={formData.normalRange}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                name="remarks"
                                value={formData.remarks}
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
                                    {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Report')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default LabReportForm; 