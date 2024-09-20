const express = require('express');
const { authenticate, restrictedTo } = require('./../controller/authentication/authController');
const contriController = require('./../controller/contributionController');
const { checkId } = require('../utils/helpers');

const router = express.Router();

// Public routes
router.route('/stat').get(contriController.getStats);

// For guests / public
router
  .route('/myContribution')
  .all(contriController.isGuest)
  .get(contriController.getGuestContribution)
  .post(contriController.createGuestContribution)
  .patch(contriController.updateGuestContribution)
  .delete(contriController.deleteGuestContribution);

// After this point an authentication is needed
router.use(authenticate);

router.route('/myContributions').get(contriController.myContributions);
router.route('/myContribution').post(contriController.createMyContribution);

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
