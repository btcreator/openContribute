const express = require('express');
const { checkId } = require('./../utils/helpers');
const authController = require('./../controller/authentication/authController');
const projectController = require('../controller/projectController');

const router = express.Router();

router.route('/search').get(projectController.getSearchResults);
router.route('/:id').get(checkId, projectController.getProject);

// After this point an authentication is needed
router.use(authController.authenticate);

router.route('/myProjects').get(projectController.myProjects).post(projectController.createMyProject);
router
  .route('/myProjects/:id')
  .all(checkId)
  .patch(projectController.updateMyProject)
  .delete(projectController.deleteMyProject);

// After this point is the restricted area for admins
router.use(authController.restrictedTo('admin'));

router.route('/').get(projectController.getAllProjects).post(projectController.createProject);
router.route('/:id').all(checkId).patch(projectController.updateProject).delete(projectController.deleteProject);

module.exports = router;
