// src/routes/sosRoutes.js
const express = require('express');
const { sendSOS } = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
    '/',
    protect,
    validate([
        body('message').optional().isString(),
        body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
        body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    ]),
    sendSOS
);

module.exports = router;
