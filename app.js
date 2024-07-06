const projectRouter = require("./routers/projectRouter");
const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/api/v1/project", projectRouter);

module.exports = app;
