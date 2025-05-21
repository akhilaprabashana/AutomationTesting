const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Get all patients
router.get('/', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get patient by ID
router.get('/:id', auth, roleAuth(['admin', 'staff', 'doctor']), async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new patient
router.post('/', auth, roleAuth(['admin', 'staff']), async (req, res) => {
    try {
        const newPatient = new Patient({
            ...req.body,
            registeredBy: req.user.userId
        });

        const patient = await newPatient.save();
        res.status(201).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update patient
router.put('/:id', auth, roleAuth(['admin', 'staff']), async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete patient
router.delete('/:id', auth, roleAuth(['admin']), async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Patient removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
