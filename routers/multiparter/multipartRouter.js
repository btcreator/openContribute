const express = require('express');
const {
  bufferImage,
  editAndSaveUserImage,
  saveProjectImages,
  reparseMultipartBody,
  passMethods,
} = require('../../controller/multipartParser/multipartController');

const router = express.Router();

router.route(/.*user.*/).all(passMethods('patch', 'post'), bufferImage('userPhoto'), editAndSaveUserImage);
router.route(/.*project.*/).all(passMethods('patch', 'post'), saveProjectImages, reparseMultipartBody);

module.exports = router;
