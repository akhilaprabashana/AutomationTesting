const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testType: {
        type: String,
        required: true,
        trim: true
    },
    testDate: {
        type: Date,
        required: true
    },
    results: {
        type: String,
        required: true
    },
    normalRange: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    remarks: {
        type: String,
        trim: true
    },
    reportNumber: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return this.generateReportNumber();
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Method to generate report number
labReportSchema.methods.generateReportNumber = async function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datePrefix = `LR-${year}${month}${day}`;

    // Find the latest report number for today
    const latestReport = await this.constructor.findOne({
        reportNumber: new RegExp(`^${datePrefix}`)
    }).sort({ reportNumber: -1 });

    let sequence = '0001';
    if (latestReport) {
        const lastSequence = parseInt(latestReport.reportNumber.slice(-4));
        sequence = String(lastSequence + 1).padStart(4, '0');
    }

    return `${datePrefix}-${sequence}`;
};

// Generate unique report number before saving
labReportSchema.pre('save', async function (next) {
    try {
        if (!this.reportNumber) {
            this.reportNumber = await this.generateReportNumber();

            // Verify uniqueness
            const existingReport = await this.constructor.findOne({
                reportNumber: this.reportNumber
            });

            if (existingReport) {
                // If duplicate found, try to generate a new number
                this.reportNumber = await this.generateReportNumber();
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const LabReport = mongoose.model('LabReport', labReportSchema);

module.exports = LabReport; 