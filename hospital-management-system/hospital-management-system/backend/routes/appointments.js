const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Get all appointments
router.get('/', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username email')
            .sort({ appointmentDate: 1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent appointments for dashboard
router.get('/recent', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'username email')
            .sort({ appointmentDate: 1 })
            .limit(5);
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get appointment by ID
router.get('/:id', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'firstName lastName email contactNumber')
            .populate('doctor', 'username email');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new appointment
router.post('/', auth, roleAuth(['admin', 'staff']), async (req, res) => {
    try {
        const newAppointment = new Appointment({
            ...req.body,
            createdBy: req.user.userId
        });

        const appointment = await newAppointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update appointment
router.put('/:id', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
            .populate('patient', 'firstName lastName email contactNumber')
            .populate('doctor', 'username email');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete appointment
router.delete('/:id', auth, roleAuth(['admin', 'staff']), async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment removed successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
