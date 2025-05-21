const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const LabReport = require('../models/LabReport');
const auth = require('../middleware/auth');
const { startOfDay, endOfDay } = require('date-fns');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
    try {
        // Get total patients count
        const totalPatients = await Patient.countDocuments();

        // Get total appointments count
        const totalAppointments = await Appointment.countDocuments();

        // Get today's appointments count
        const today = new Date();
        const todayAppointments = await Appointment.countDocuments({
            appointmentDate: {
                $gte: startOfDay(today),
                $lte: endOfDay(today)
            }
        });

        // Get lab reports stats
        const totalLabReports = await LabReport.countDocuments();
        const pendingLabReports = await LabReport.countDocuments({ status: 'pending' });
        const todayLabReports = await LabReport.countDocuments({
            testDate: {
                $gte: startOfDay(today),
                $lte: endOfDay(today)
            }
        });

        res.json({
            totalPatients,
            totalAppointments,
            todayAppointments,
            totalLabReports,
            pendingLabReports,
            todayLabReports
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent lab reports
router.get('/recent-lab-reports', auth, async (req, res) => {
    try {
        const reports = await LabReport.find()
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username')
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(reports);
    } catch (error) {
        console.error('Error fetching recent lab reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 