const express = require('express');
const {
  bufferImage,
  editAndSaveUserImage,
  saveProjectImages,
  reparseMultipartBody,
} = require('../../controller/multipartParser/multipartController');

const router = express.Router();

router.route(/.*user.*/).all(bufferImage('userPhoto'), editAndSaveUserImage);
router.route(/.*project.*/).all(saveProjectImages, reparseMultipartBody);

module.exports = router;
