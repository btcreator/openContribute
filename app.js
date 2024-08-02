const projectRouter = require("./routers/projectRouter");
const userRouter = require("./routers/userRouter");
const { globalErrorHandler } = require("./controller/error/errorHandler");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Load and parse
//// body and cookies
app.use(express.json());
app.use(cookieParser());

// Serve the static files
app.use(express.static("public"));

// Route incoming requests to corresponding router
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/user", userRouter);

// Error handling
app.use(globalErrorHandler);

module.exports = app;
