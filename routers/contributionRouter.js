const express = require('express');
const { authenticate, restrictedTo } = require('./../controller/authentication/authController');
const contiController = require('./../controller/contributionController');

const router = express.Router();

// Public routes
router.route('/stat').get(contiController.getStats);

// For guests / public
router
  .route('/guest')
  .get(contiController.getGuestContribution)
  .post(contiController.createGuestContribution)
  .patch(contiController.updateGuestContribution)
  .delete(contiController.deleteGuestContribution);

// After this point an authentication is needed
router.use(authenticate);

router.route('/myContribution').get(contiController.myContributions).post(contiController.createMyContribution);

router
  .route('/myContribution/:id')
  .get(contiController.getMyContribution)
  .patch(contiController.updateMyContribution)
  .delete(contiController.deleteMyContribution);

// After this point is the restricted area for admins
router.use(restrictedTo('admin'));

router.route('/').get(contiController.getAllContributions).post(contiController.createContribution);

router
  .route('/:id')
  .get(contiController.getContribution)
  .patch(contiController.updateContribution)
  .delete(contiController.deleteContribution);

module.exports = router;
