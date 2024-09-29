const express = require('express');
const {
  bufferImage,
  editAndSaveUserImage,
  saveProjectImages,
  parseTextOnlyMultipartBody,
  reparseMultipartBody,
  passMethods,
  checkContetType,
} = require('../../controller/multipartParser/multipartController');

const router = express.Router();

router
  .route(/.*user.*/)
  .all(passMethods('patch', 'post'), checkContetType, bufferImage('userPhoto'), editAndSaveUserImage);
router.route(/.*project.*/).all(passMethods('patch', 'post'), checkContetType, saveProjectImages, reparseMultipartBody);
router.route(/.*contribution.*/).all(passMethods('patch', 'post'), checkContetType, parseTextOnlyMultipartBody());

module.exports = router;
