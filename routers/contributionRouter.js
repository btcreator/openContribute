const express = require('express');
const { authenticate, restrictedTo } = require('./../controller/authentication/authController');
const contiController = require('./../controller/contributionController');
const { checkId } = require('../utils/helpers');

const router = express.Router();

// Public routes
router.route('/stat').get(contiController.getStats);

// For guests / public
router
  .route('/myContribution')
  .all(contiController.isGuest)
  .get(contiController.getGuestContribution)
  .post(contiController.createGuestContribution)
  .patch(contiController.updateGuestContribution)
  .delete(contiController.deleteGuestContribution);

// After this point an authentication is needed
router.use(authenticate);

router.route('/myContributions').get(contiController.myContributions);
router.route('/myContribution').post(contiController.createMyContribution);

router
  .route('/myContribution/:id')
  .all(checkId)
  .get(contiController.getMyContribution)
  .patch(contiController.updateMyContribution)
  .delete(contiController.deleteMyContribution);

// After this point is the restricted area for admins
router.use(restrictedTo('admin'));

router.route('/').get(contiController.getAllContributions).post(contiController.createContribution);

router
  .route('/:id')
  .all(checkId)
  .get(contiController.getContribution)
  .patch(contiController.updateContribution)
  .delete(contiController.deleteContribution);

module.exports = router;
