// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const limiter = require('./middleware/rateLimiter');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')


// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sosRoutes = require('./routes/sosRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/community', communityRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
