const catchAsync = require('../../utils/catchAsync');
const User = require('../../model/user');
const multer = require('multer');
const sharp = require('sharp');

// Parse multipart incoming data
exports.bufferImage = (image) => (req, res, next) => {
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
  const upload = multer({ storage, fileFilter, limits: { fileSize: 5e6 } }).single(image);
  return upload(req, res, next);
};

// edit uploaded image to a frendly format
exports.editAndSaveUserImage = catchAsync(async (req, res, next) => {
  // check if file exists, and if its loaded to memory
  if (!req.file?.buffer) return next();

  // set path and a temporary file name
  const filename = `${Date.now()}_${Math.floor(Math.random() * 1e9)}.png`;
  const path = './public/img/users/';

  // resize photo - default fit is "cover"
  await sharp(req.file.buffer).resize(800, 800).png().toFile(`${path}temp_${filename}`);

  // save where the files are stored. If needed, can be removed when something goes wrong by db update
  req.tempFiles = [{ path, filename }];
  next();
});

exports.saveProjectImages = catchAsync(async (req, res) => {
  // set uploaded images storage and filename
  const mainFilename = `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
  const path = './public/img/projects/content/';

  // init for the temporary file names
  req.tempFiles = [];

  // where and how the files should be stored
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const filename = `${mainFilename}_${file.fieldname}`;
      req.tempFiles.push({ path, filename });
      cb(null, `temp_${filename}`);
    },
  });

  // just images are allowed
  const fileFilter = function (req, file, cb) {
    const type = file.mimetype.split('/')[0];
    if (type !== 'image') {
      cb(new AppError(415, 'Unsupported media type.'));
    }
    cb(null, true);
  };

  // save the images
  const upload = multer({ storage, fileFilter, limits: { fileSize: 5e6 } }).fields([
    { name: 'cover', maxCount: 1 },
    { name: 'result', maxCount: 1 },
  ]);

  return upload(req, res, next);
});
