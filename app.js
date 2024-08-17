const projectRouter = require('./routers/projectRouter');
const userRouter = require('./routers/userRouter');
const exception = require('./controller/exception/exceptionHandler');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const security = require('./security');

// Load and parse
//// body and cookies
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Implement security - prevent attack procedures
app.use(security);

// Serve the static files
app.use(express.static('public'));

// Route incoming requests to corresponding router
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/user', userRouter);

// Routes, that are not implemented - 404
app.use(exception.globalRouteHandler);

// Error handling
app.use(exception.globalErrorHandler);

module.exports = app;
