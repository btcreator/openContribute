const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const router = express.Router();

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from your IP. Try again in one Hour.',
});

// Set security HTTP headers
router.use(helmet());
// Rate limiting - small protection agianst brute force
router.use('/api', limit);

// Sanitize incoming data from $ signs to prevent NoSql query injection
router.use(mongoSanitize());
// Prevent Cross Site Scripting - XSS
router.use(xss());

// Prevent parameter pollution
router.use(hpp());

module.exports = router;
