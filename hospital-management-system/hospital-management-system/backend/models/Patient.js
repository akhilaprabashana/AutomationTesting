const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    medicalHistory: [{
        condition: String,
        diagnosisDate: Date,
        treatment: String
    }],
    insuranceInfo: {
        provider: String,
        policyNumber: String,
        groupNumber: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);
