const express = require('express');
const router = express.Router();
const LabReport = require('../models/LabReport');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Get all lab reports
router.get('/', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const labReports = await LabReport.find()
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(labReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get lab report by ID
router.get('/:id', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const labReport = await LabReport.findById(req.params.id)
            .populate('patient', 'firstName lastName email contactNumber')
            .populate('doctor', 'username email')
            .populate('createdBy', 'username');

        if (!labReport) {
            return res.status(404).json({ message: 'Lab report not found' });
        }

        res.json(labReport);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Lab report not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new lab report
router.post('/', auth, roleAuth(['admin', 'staff']), async (req, res) => {
    try {
        const newLabReport = new LabReport({
            ...req.body,
            createdBy: req.user.userId
        });

        // Generate report number if not provided
        if (!newLabReport.reportNumber) {
            newLabReport.reportNumber = await newLabReport.generateReportNumber();
        }

        const labReport = await newLabReport.save();

        // Populate the response with referenced data
        const populatedReport = await LabReport.findById(labReport._id)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username')
            .populate('createdBy', 'username');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error creating lab report:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update lab report
router.put('/:id', auth, roleAuth(['admin', 'staff']), async (req, res) => {
    try {
        const labReport = await LabReport.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username')
            .populate('createdBy', 'username');

        if (!labReport) {
            return res.status(404).json({ message: 'Lab report not found' });
        }

        res.json(labReport);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Lab report not found' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete lab report
router.delete('/:id', auth, roleAuth(['admin']), async (req, res) => {
    try {
        const labReport = await LabReport.findByIdAndDelete(req.params.id);

        if (!labReport) {
            return res.status(404).json({ message: 'Lab report not found' });
        }

        res.json({ message: 'Lab report deleted successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Lab report not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Get lab reports by patient ID
router.get('/patient/:patientId', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const labReports = await LabReport.find({ patient: req.params.patientId })
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.json(labReports);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 