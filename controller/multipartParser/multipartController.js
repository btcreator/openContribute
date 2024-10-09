const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const _IMAGE_FILE_SIZE_LIMIT = 5e6;
const _VIDEO_FILE_SIZE_LIMIT = 50e6;

// Parse multipart incoming data to memory
exports.bufferImage = (image) => (req, res, next) => {
  // save uploaded image in memory
  const storage = multer.memoryStorage();

  // just images are allowed
  const fileFilter = function (req, file, cb) {
    const type = file.mimetype.split('/')[0];
    if (type !== 'image') {
      return cb(new AppError(415, 'Unsupported media type.'));
    }
    cb(null, true);
  };

  // upload the image to memory
  const upload = multer({ storage, fileFilter, limits: { fileSize: _IMAGE_FILE_SIZE_LIMIT } }).fields([
    { name: image, maxCount: 1 },
  ]);
  return upload(req, res, next);
};

// Edit uploaded image to a frendly format
exports.editAndSaveUserImage = catchAsync(async (req, res, next) => {
  // check if file exists, when not, remove the empty/wrong uploaded files object
  if (!req.files?.userPhoto?.[0]) {
    delete req.files;
    return next();
  }

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
      // just images are allowed
      const type = file.mimetype.split('/')[0];
      if (type !== 'image') {
        return cb(new AppError(415, 'Unsupported media type.'));
      }
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
      cb(null, `${mainFilename}_${file.fieldname}${ext}`);
    },
  });

  // save the images
  const upload = multer({ storage, limits: { fileSize: _IMAGE_FILE_SIZE_LIMIT } }).fields([
    { name: 'cover', maxCount: 1 },
    { name: 'result', maxCount: 1 },
  ]);

  return upload(req, res, next);
});

// Parse text-only multipart/form-data
exports.parseTextOnlyMultipartBody = function () {
  return multer().none();
};

// Multer parse the body, but filelds like array or objects are handled as string. So we need to reparse
exports.reparseMultipartBody = function (req, res, next) {
  const regex = new RegExp(/^[\[,\{].*[\],\}]$/s);

  Object.keys(req.body).forEach((key) => {
    const value = req.body[key].trim();
    if (regex.test(value)) {
      req.body[key] = JSON.parse(value);
    }
  });
  next();
};

// Handle uploaded images and videos
exports.uploadFeedMultimedia = function (req, res, next) {
  // set uploaded images storage and filename
  const imgPath = './public/feed/img';
  const vidPath = './public/feed/vid';

  // where and how the files should be stored
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype.split('/')[0] === 'image') {
        cb(null, imgPath);
      } else if (file.mimetype === 'video/mp4') {
        cb(null, vidPath);
      } else {
        cb(new AppError(415, 'Unsupported media type.'));
      }
    },
    filename: function (req, file, cb) {
      const mainFilename = `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
      cb(null, `${mainFilename}${ext}`);
    },
  });

  // images and videos should appear in the right fields. Else they are ignored
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === 'images' && file.mimetype.split('/')[0] === 'image') {
      return cb(null, true);
    } else if (file.fieldname === 'videos' && file.mimetype === 'video/mp4') {
      return cb(null, true);
    }
    cb(null, false);
  };

  // set limits for each field separately. When malicious upload fileds are present (DoS) for sure set limit to 0 (for this feature see _customBusboy_multipart.js in utils folder)
  const limits = {
    fileSize: {
      images: _IMAGE_FILE_SIZE_LIMIT,
      videos: _VIDEO_FILE_SIZE_LIMIT,
      REST_MAX_LIMIT: 0,
    },
  };

  // save the media
  const upload = multer({ storage, fileFilter, limits }).fields([
    { name: 'images', maxCount: process.env.FEED_MAX_IMAGE_ALLOWED },
    { name: 'videos', maxCount: process.env.FEED_MAX_VIDEO_ALLOWED },
  ]);

  return upload(req, res, next);
};

// Guard middlewares
////
// Just the specified methodes are allowed to call the next middlewares
exports.passMethods = function (...methods) {
  return function (req, res, next) {
    if (!methods.includes(req.method.toLowerCase())) return next('route');
    next();
  };
};

// Only multipart/form-data is allowed
exports.checkContetType = function (req, res, next) {
  return !req.headers['content-type']?.startsWith('multipart/form-data') ? next('route') : next();
};
