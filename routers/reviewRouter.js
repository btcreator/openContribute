const express = require('express');
const reviewController = require('./../controller/reviewController');

const router = express.Router();

router.route('/latest-ten').get(reviewController.getLatestTenReviews);
router.route('/').get(reviewController.getAllReviews);

module.exports = router;
