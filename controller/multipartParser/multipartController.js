const catchAsync = require('../../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

// Parse multipart incoming data to memory
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
  const upload = multer({ storage, fileFilter, limits: { fileSize: 5e6 } }).fields([{ name: image, maxCount: 1 }]);
  return upload(req, res, next);
};

// Edit uploaded image to a frendly format
exports.editAndSaveUserImage = catchAsync(async (req, res, next) => {
  // check if file exists
  if (!req.files) return next();

  // set path and a temporary file name
  const userPhoto = req.files.userPhoto[0];
  const filename = `${Date.now()}_${Math.floor(Math.random() * 1e9)}.png`;
  const path = './public/img/users/';

  // resize photo - default fit is "cover"
  await sharp(userPhoto.buffer).resize(800, 800).png().toFile(`${path}${filename}`);

  // save where the files are stored. If needed, can be removed when something goes wrong by db update
  userPhoto.destination = path;
  userPhoto.filename = filename;
  next();
});

// Parse and save to disk incoming multipart data
exports.saveProjectImages = catchAsync(async (req, res, next) => {
  // set uploaded images storage and filename
  const mainFilename = `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
  const path = './public/img/projects/content/';

  // where and how the files should be stored
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
      cb(null, `${mainFilename}_${file.fieldname}${ext}`);
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

// multer parse the body, but filelds like array or objects are handled as string. So we need to reparse
exports.reparseMultipartBody = function (req, res, next) {
  if (!req.headers['content-type'].startsWith('multipart/form-data')) return next();
  const regex = new RegExp(/^[\[,\{].*[\],\}]$/);

  Object.keys(req.body).forEach((key) => {
    const value = req.body[key];
    if (regex.test(value)) {
      req.body[key] = JSON.parse(value);
    }
  });
  next();
};
