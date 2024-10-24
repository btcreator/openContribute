const express = require('express');
const {
  bufferImage,
  editAndSaveUserImage,
  saveProjectImages,
  parseTextOnlyMultipartBody,
  uploadFeedMultimedia,
  reparseMultipartBody,
  passMethods,
  checkContetType,
} = require('../../controller/multipartParser/multipartController');

const router = express.Router();

router
  .route(/.*user.*/)
  .all(
    passMethods('patch', 'post'),
    checkContetType,
    bufferImage('userPhoto'),
    editAndSaveUserImage,
    reparseMultipartBody
  );
router.route(/.*project.*/).all(passMethods('patch', 'post'), checkContetType, saveProjectImages, reparseMultipartBody);
router.route(/.*contribution.*/).all(passMethods('patch', 'post'), checkContetType, parseTextOnlyMultipartBody);
router.route(/.*feed.*/).all(passMethods('patch', 'post'), checkContetType, uploadFeedMultimedia);

module.exports = router;
