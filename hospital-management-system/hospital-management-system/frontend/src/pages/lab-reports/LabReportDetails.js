import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { labReportsAPI } from '../../utils/api';

const LabReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await labReportsAPI.getById(id);
                setReport(response.data);
            } catch (err) {
                console.error('Error fetching lab report:', err);
                setError('Failed to load lab report details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

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

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Container>
        );
    }

    if (!report) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">Lab report not found</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Container>
        );
    }

    const statusChip = getStatusChipProps(report.status);

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" mb={3}>
                    <IconButton
                        edge="start"
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box flexGrow={1}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Lab Report Details
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Report Number: {report.reportNumber}
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            component={Link}
                            to={`/lab-reports/${report._id}/edit`}
                            sx={{ mr: 1 }}
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Content */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Patient Name
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {report.patient
                                ? `${report.patient.firstName} ${report.patient.lastName}`
                                : "No patient data"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Doctor
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {report.doctor ? report.doctor.username : "No doctor data"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Test Type
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {report.testType}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Test Date
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {format(new Date(report.testDate), 'MMMM dd, yyyy')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Results
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {report.results}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Normal Range
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {report.normalRange}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Unit
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {report.unit}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Status
                        </Typography>
                        <Chip
                            label={statusChip.label}
                            color={statusChip.color}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Grid>

                    {report.remarks && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Remarks
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {report.remarks}
                            </Typography>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Created by: {report.createdBy ? report.createdBy.username : "Unknown"}
                            <br />
                            Created at: {format(new Date(report.createdAt), 'MMMM dd, yyyy HH:mm')}
                            {report.updatedAt !== report.createdAt && (
                                <>
                                    <br />
                                    Last updated: {format(new Date(report.updatedAt), 'MMMM dd, yyyy HH:mm')}
                                </>
                            )}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default LabReportDetails; 