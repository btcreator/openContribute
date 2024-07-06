const projectController = require('../controller/projectController');
const { getContributors } = require('../controller/contributionController');
const express = require('express');

const router = express.Router();

router.use('/contributors', getContributors);

router
    .route('/')
    .get(projectController.queryProjects)
    .post(projectController.createNewProject)
    .patch(projectController.updateProject);

router
    .route('/:id')
    .get(projectController.getProjectById)
    .delete(projectController.deleteProject);
module.exports = router;
