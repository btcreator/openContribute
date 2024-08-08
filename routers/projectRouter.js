const express = require("express");
const projectController = require("../controller/projectController");

const router = express.Router();

router
  .route("/")
  .get(projectController.queryProjects)
  .post(projectController.createNewProject)
  .patch(projectController.updateProject);

router
  .route("/:id")
  .get(projectController.getProjectById)
  .delete(projectController.deleteProject);
module.exports = router;
