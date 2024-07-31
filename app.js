const projectRouter = require("./routers/projectRouter");
const userRouter = require("./routers/userRouter");
const { globalErrorHandler } = require("./controller/errorHandler");
const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/api/v1/project", projectRouter);
app.use("/api/v1/user", userRouter);

app.use(globalErrorHandler);

module.exports = app;
