const express = require('express');
const { authenticate, identificateUser, restrictedTo } = require('./../controller/authentication/authController');
const contriController = require('./../controller/contributionController');
const { checkId } = require('../utils/helpers');

const router = express.Router();

// For guests / public
router.route('/project/:id').get(checkId, contriController.getProjectsContributors);

router
  .route('/myContribution')
  .all(contriController.isGuest)
  .get(contriController.getGuestContribution)
  .patch(contriController.updateGuestContribution)
  .delete(contriController.deleteGuestContribution);

// POST for guests and users
router.route('/myContribution').post(identificateUser, contriController.createContribution);

// After this point an authentication is needed
router.use(authenticate);

router.route('/myContributions').get(contriController.getAllMyContributions);
router.route('/myContributions/summary').get(contriController.myContributionsSummary);

router
  .route('/myContribution/:id')
  .all(checkId)
  .get(contriController.getMyContribution)
  .patch(contriController.updateMyContribution)
  .delete(contriController.deleteMyContribution);

// After this point is the restricted area for admins
router.use(restrictedTo('admin'));

router.route('/').get(contriController.getAllContributions).post(contriController.createContribution);

router
  .route('/:id')
  .all(checkId)
  .get(contriController.getContribution)
  .patch(contriController.updateContribution)
  .delete(contriController.deleteContribution);

module.exports = router;
