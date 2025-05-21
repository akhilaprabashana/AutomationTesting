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
} from '@mui/icons-material';
import { format } from 'date-fns';
import { labReportsAPI } from '../../utils/api';

const LabReportList = () => {
    const navigate = useNavigate();
    const [labReports, setLabReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Delete dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchLabReports();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredReports(labReports);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = labReports.filter(report =>
                report.reportNumber.toLowerCase().includes(lowerCaseQuery) ||
                report.testType.toLowerCase().includes(lowerCaseQuery) ||
                (report.patient &&
                    `${report.patient.firstName} ${report.patient.lastName}`
                        .toLowerCase()
                        .includes(lowerCaseQuery)) ||
                (report.doctor &&
                    report.doctor.username.toLowerCase().includes(lowerCaseQuery))
            );
            setFilteredReports(filtered);
        }
    }, [searchQuery, labReports]);

    const fetchLabReports = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await labReportsAPI.getAll();
            setLabReports(response.data);
            setFilteredReports(response.data);
        } catch (err) {
            console.error('Error fetching lab reports:', err);
            setError('Failed to load lab reports. Please try again later.');
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
        setPage(0);
    };

    const handleDeleteClick = (report) => {
        setReportToDelete(report);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!reportToDelete) return;

        setDeleteLoading(true);
        setError('');

        try {
            await labReportsAPI.delete(reportToDelete._id);
            setLabReports(labReports.filter(r => r._id !== reportToDelete._id));
            setFilteredReports(filteredReports.filter(r => r._id !== reportToDelete._id));
            setOpenDeleteDialog(false);
            setSuccessMessage('Lab report deleted successfully!');
        } catch (err) {
            console.error('Error deleting lab report:', err);
            setError(
                err.response?.data?.message ||
                'Failed to delete lab report. Please try again.'
            );
        } finally {
            setDeleteLoading(false);
        }
    };

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
                        Lab Reports
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/lab-reports/create"
                    >
                        New Lab Report
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Manage patient lab reports
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box p={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by report number, test type, patient name, or doctor..."
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

                <TableContainer>
                    <Table aria-label="lab reports table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Report Number</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell>Test Type</TableCell>
                                <TableCell>Test Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredReports
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((report) => {
                                    const statusChip = getStatusChipProps(report.status);

                                    return (
                                        <TableRow key={report._id} hover>
                                            <TableCell>{report.reportNumber}</TableCell>
                                            <TableCell>
                                                {report.patient
                                                    ? `${report.patient.firstName} ${report.patient.lastName}`
                                                    : "No patient data"}
                                            </TableCell>
                                            <TableCell>
                                                {report.doctor
                                                    ? report.doctor.username
                                                    : "No doctor data"}
                                            </TableCell>
                                            <TableCell>{report.testType}</TableCell>
                                            <TableCell>
                                                {format(new Date(report.testDate), 'MMM dd, yyyy')}
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
                                                    color="primary"
                                                    onClick={() => navigate(`/lab-reports/${report._id}`)}
                                                    size="small"
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => navigate(`/lab-reports/${report._id}/edit`)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteClick(report)}
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
                    count={filteredReports.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the lab report{' '}
                        <strong>{reportToDelete?.reportNumber}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        disabled={deleteLoading}
                    >
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

export default LabReportList; 