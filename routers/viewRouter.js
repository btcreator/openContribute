const express = require('express');

const router = express.Router();

router.get('/');
router.get('/login');
router.get('/signup');
router.get('/search');
router.get('/profile');

// router.get('/project/:slug');
// router.get('/project-create');
// router.get("/project-update/:slug");

module.exports = router;
