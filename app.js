const express = require('express');
const projectRouter = require('./routers/projectRouter');
const userRouter = require('./routers/userRouter');
const feedRouter = require('./routers/feedRouter');
const contributionRouter = require('./routers/contributionRouter');
const reviewRouter = require('./routers/reviewRouter');
const viewRouter = require('./routers/viewRouter');
const { stats } = require('./controller/statisticsController');
const exception = require('./controller/exception/exceptionHandler');
const cookieParser = require('cookie-parser');
const multiparter = require('./routers/multiparter/multipartRouter');
const security = require('./security');
const cors = require('cors');
const path = require('path');

// Create app
const app = express();

// For barrier-free connections
////
// if behind proxy - TODO after deploying the app needs check for proxies between client and server
app.enable('trust proxy');
// enable cross origin resource sharing for everyone
app.use(cors());

// Load and parse
//// body, images and cookies
app.use(express.json({ limit: '10kb' }));
app.use(multiparter);
app.use(cookieParser());

// Implement security - prevent attack procedures
app.use(security);

// Setup view
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views/pages'));

// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Route incoming requests to corresponding router
app.use('/', viewRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/contribution', contributionRouter);
app.use('/api/v1/feed', feedRouter);
app.use('/api/v1/reviews', reviewRouter);
app.get('/api/v1/stats', stats);

// Routes, that are not implemented - 404
app.use(exception.globalRouteHandler);

// Error handling
app.use(exception.globalErrorHandler);

module.exports = app;
