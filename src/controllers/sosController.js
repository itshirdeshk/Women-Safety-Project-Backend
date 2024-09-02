// src/controllers/sosController.js
const asyncHandler = require('express-async-handler');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');
const twilioService = require('../services/twilioService');
const emailService = require('../services/emailService');

// @desc    Send SOS Alert
// @route   POST /api/sos
// @access  Private
exports.sendSOS = asyncHandler(async (req, res) => {
    const { message, location } = req.body;

    const sosAlert = await SOSAlert.create({
        user: req.user.id,
        message,
        location,
    });

    const user = await User.findById(req.user.id).populate('emergencyContacts');

    // Send SMS to emergency contacts
    for (let contact of user.emergencyContacts) {
        await twilioService.sendSMS(
            contact.phoneNumber,
            `${message} - Location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
        );

        // Optionally send Email as well
        await emailService.sendEmail(
            contact.email,
            'SOS Alert Received',
            `Emergency message: ${message}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}`
        );
    }

    res.status(200).json({
        success: true,
        data: sosAlert,
    });
});
