const catchAsync = require('./../../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

// File upload - profile photo
////
// grab image from incoming request, and load it to memory for futher use
exports.grabImage = (req, res, next) => {
  // be sure that no malicious filename gets uploaded
  delete req.body.photo;

  // save uploaded image in memory
  const storage = multer.memoryStorage();

  // just images are allowed
  const fileFilter = function (req, file, cb) {
    const type = file.mimetype.split('/')[0];
    if (type !== 'image') {
      cb(new AppError(415, 'Unsupported media type.'));
    }
    cb(null, true);
  };

  // upload the image to memory
  const upload = multer({ storage, fileFilter, limits: { fileSize: 5e6 } }).single('userPhoto');
  return upload(req, res, next);
};

// edit uploaded image to a frendly format
exports.editImage = catchAsync(async (req, res, next) => {
  // check if file exists, and if its loaded to memory
  if (!req.file?.buffer) return next();

  // set file name and path
  const hasPhoto = !req.user.photo.includes('default');
  const filename = hasPhoto ? req.user.photo : `${Date.now()}_${Math.floor(Math.random() * 1e9)}.png`;
  const filePath = `./public/img/users/${filename}`;

  // resize photo - default fit is "cover"
  await sharp(req.file.buffer).resize(800, 800).png().toFile(filePath);

  hasPhoto || (req.body.photo = filename);
  next();
});
