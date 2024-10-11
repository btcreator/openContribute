const express = require('express');
const { checkId } = require('./../utils/helpers');
const { identificateUser, authenticate, restrictedTo } = require('./../controller/authentication/authController');
const feedController = require('./../controller/feedController');

const router = express.Router();

router.route('/project/:id').get(checkId, identificateUser, feedController.getProjectsFeed);

router.use(authenticate);
router.route('/myFeed').post(feedController.createMyFeed);
router.route('/myFeed/:id').patch(feedController.updateMyFeed).delete(feedController.deleteMyFeed);

router.route('/remove-files-from/:id').delete(feedController.removeFiles);

router.use(restrictedTo('admin'));
router.route('/').post(feedController.createFeed).get(feedController.getAllFeed);
router.route('/:id').patch(feedController.updateFeed).delete(feedController.deleteFeed);

module.exports = router;
