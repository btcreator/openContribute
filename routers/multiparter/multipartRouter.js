const express = require('express');
const {
  bufferImage,
  editAndSaveUserImage,
  saveProjectImages,
} = require('../../controller/multipartParser/multipartController');

const router = express.Router();

router.route(/.*user.*/).all(bufferImage('userPhoto'), editAndSaveUserImage);
router.route(/.*project.*/).all(saveProjectImages);

module.exports = router;
